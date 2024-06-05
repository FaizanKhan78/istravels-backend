const AllUser = require( '../models/allUser-model' );
// *----------
// ? AllData
// *----------



const getAllNewData = async ( req, res, next ) =>
{
    try
    {
        const newData = await AllUser.find();
        res.status( 200 ).json( newData );
    } catch ( error )
    {
        res.status( 400 ).json( error );
    }
};

const updateAllUsers = async ( req, res ) =>
{
    try
    {
        console.log( req.body );
        const payload = { ...req.body, pending_amount: req.body.rate * 12, total_amount: req.body.rate * 12, paid_amount: 0 };
        const data = await AllUser.updateMany( { area: payload.area }, payload, { new: true } );
        res.status( 200 ).json( data );
    } catch ( error )
    {
        res.status( 500 ).json( error );
    }
};


const updateSingle = async ( req, res ) =>
{
    try
    {
        const number = req.params.number;
        const data = await AllUser.findOneAndUpdate( { mobile_number: number }, req.body, {
            new: true,
        } );
        res.status( 200 ).json( data );
    } catch ( error )
    {
        res.status( 500 ).json( error );
    }
};



const deleteUser = async ( req, res ) =>
{
    try
    {
        const id = req.params.id;
        await AllUser.findByIdAndDelete( { _id: id } );
        res.status( 200 ).json( { msg: "Deleted Successfully" } );
    } catch ( error )
    {
        res.status( 500 ).json( error );
    }
};

module.exports = { updateAllUsers, updateSingle, deleteUser, getAllNewData };