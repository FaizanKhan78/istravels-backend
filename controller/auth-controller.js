const Counter = require( '../models/id-model' );
const AllUser = require( '../models/allUser-model' );
const Razorpay = require( "razorpay" );
const crypto = require( "crypto" );
const dayjs = require( 'dayjs' );
const instance = new Razorpay( {
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
} );

// *----------
// ? Update
// *----------
const update = async ( req, res ) =>
{
    try
    {
        console.log( req.body );
        const { _id, orderId, paymentId, payment_date, due_date, pending_amount, paid_amount } = req.body;
        const user = await AllUser.findOneAndUpdate( { _id }, { payment_date, due_date, paid_amount, pending_amount, paymentId }, { new: true } );
        res.status( 200 ).send( user );
    } catch ( error )
    {
        console.log( error );
        res.status( 500 ).json( { error: "Internal Server Error" } );
    }
};


// *----------
// ? Register
// *----------
const register = async ( req, res ) =>
{
    try
    {
        const { student_name, mobile_number, password, pick_up_address, drop_up_address, area, div, society, gender, payment_date, due_date, std, alternate_number } = req.body;
        console.log( student_name );
        console.log( mobile_number );
        const userExist = await AllUser.findOne( { student_name } );
        if ( userExist?.student_name === student_name && userExist?.mobile_number === mobile_number )
        {
            if ( userExist.status === false )
            {
                return res.status( 400 ).json( { message: "Your Status is Pending" } );
            }
            return res.status( 400 ).json( { message: "User Already Exist" } );
        }

        const counterData = await Counter.findOneAndUpdate(
            { id: "autoVal" },
            { "$inc": { "seq": 1 } },
            { new: true }
        );

        // If the counter data is null, create a new counter
        let seqId;
        if ( !counterData )
        {
            const newVal = new Counter( { id: "autoVal", seq: 1 } );
            await newVal.save();
            seqId = 1;
        } else
        {
            seqId = counterData.seq;
        }

        const user = await AllUser.create( {
            id: seqId,
            student_name,
            pick_up_address,
            drop_up_address,
            area,
            gender,
            payment_date,
            due_date,
            std,
            div,
            society,
            mobile_number,
            alternate_number,
            password,
        } );
        res.status( 200 ).json( { msg: "Registration is Not Approved Wet" } );
    } catch ( error )
    {
        console.error( error );
        res.status( 500 ).json( error );
    }
};

// *----------
// ? Login
// *----------

const login = async ( req, res ) =>
{
    try
    {
        const { mobile_number, password } = req.body;
        console.log( req.body );
        let userExist = await AllUser.find( { mobile_number } );
        console.log( userExist );
        for ( let i = 0; i < userExist.length; i++ )
        {
            if ( !userExist )
            {
                return res.status( 400 ).json( { message: "Invalid Credentials" } );
            } else if ( userExist[ i ].status === false )
            {
                return res.status( 400 ).json( { message: "Your Status is Pending" } );
            }
        }
        const user = userExist[ 0 ].password === password;
        if ( user )
        {
            res.status( 200 ).json( { msg: "Login Successful", token: await userExist[ 0 ].generateToken() } );
        } else
        {
            res.status( 401 ).json( "Unauthorized error" );
        }
    } catch ( error )
    {
        res.status( 500 ).json( error );
    }
};

// *---------------------------------------
// ? To send Data User - logic form invoice.
// *---------------------------------------

const invoice = async ( req, res ) =>
{
    try
    {
        const userData = req.user;
        res.status( 200 ).json( userData );
    } catch ( error )
    {
        res.status( 400 ).json( error );
    }
};


const checkout = async ( req, res ) =>
{
    try
    {
        const removeMonthDifference = ( date1, date2 ) =>
        {
            // Parse the dates using dayjs
            const d1 = dayjs( date1 );
            const d2 = dayjs( date2 );

            // Calculate the difference in months
            const monthDifference = d2.diff( d1, 'month' );
            if ( !monthDifference )
            {
                return 1;
            }
            return monthDifference;
        };


        const user = req.body;
        const monthDifference = removeMonthDifference( user[ 0 ]?.payment_date, user[ 0 ]?.due_date );
        const amount = user[ 0 ]?.rate * monthDifference * 100;
        const options = {
            amount,  // amount in the smallest currency unit
            currency: "INR",
        };
        const order = await instance.orders.create( options );
        res.status( 200 ).json( { success: true, order } );
    } catch ( error )
    {
        console.log( error );
    }
};


const paymentVerification = async ( req, res ) =>
{
    // const { razorpay_order_id } = req.body;
    try
    {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const sha = crypto.createHmac( "sha256", process.env.RAZORPAY_SECRET_KEY );
        // order_id + "|" + razorpay_payment_id, secret
        sha.update( `${ razorpay_order_id }|${ razorpay_payment_id }` );
        const digest = sha.digest( "hex" );
        if ( digest !== razorpay_signature )
        {
            return res.status( 400 ).json( { message: "Transaction Failed" } );
        }
        res.status( 200 ).json( {
            message: "success",
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
        } );
    } catch ( error )
    {
        console.log( error );
    }
};

const updatePassword = async ( req, res ) =>
{
    try
    {
        const number = req.params.number;
        console.log( number );
        let data = await AllUser.find( { mobile_number: number } );
        console.log( data );
        if ( data.length === 0 )
        {
            return res.status( 500 ).json( { message: "User Doesn't Exist" } );
        }
        if ( data[ 0 ].password === req.body.password )
        {
            return res.status( 400 ).json( { message: "New password cannot be the same as your old password" } );
        }
        data = await AllUser.updateMany( { mobile_number: number }, req.body, { new: true } );
        if ( !data.acknowledged )
        {
            await AllUser.updateOne( { mobile_number: number }, req.body, { new: true } );
        }
        res.status( 200 ).json( data );
    } catch ( error )
    {
        res.status( 500 ).json( error );
    }
};


module.exports = { update, register, login, invoice, updatePassword, checkout, paymentVerification };
