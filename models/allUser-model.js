const mongoose = require( 'mongoose' );
// const bcrypt = require( "bcryptjs" );
const jwt = require( "jsonwebtoken" );

let endDate = new Date();
endDate.setFullYear( endDate.getFullYear() + 1 );
const allUserSchema = new mongoose.Schema( {
  id: Number,
  student_name: String,
  pick_up_address: String,
  drop_up_address: String,
  area: String,
  gender: String,
  std: Number,
  div: String,
  society: String,
  mobile_number: {
    type: Number,
    unique: false,
  },
  alternate_number: Number,
  time: { type: String, default: "empty" },
  password: String,
  route: {
    type: String,
    default: "empty",
  },
  pending_amount: { type: Number, default: 0 },
  paid_amount: { type: Number, default: 0 },
  total_amount: { type: Number, default: 0 },
  start_date: { type: Date, default: new Date() },
  end_date: { type: Date, default: endDate },
  payment_date: { type: Date, default: new Date() },
  due_date: { type: Date, default: new Date() },
  quarter: { type: String, default: "" },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: false,
  },
  rate: {
    type: Number,
    default: 0,
  },
  paymentId: { type: String, default: "" },
} );

// Hash Password.
// allUserSchema.pre( "save", async function ( next )
// {
//   const user = this;
//   if ( !user.isModified( "password" ) )
//   {
//     next();
//   }

//   try
//   {
//     const saltRound = await bcrypt.genSalt( 5 );
//     const hash_password = await bcrypt.hash( user.password, saltRound );
//     user.password = hash_password;
//   } catch ( error )
//   {
//     next( error );
//   }
// } );


// allUserSchema.methods.comparePassword = function ( password )
// {
//   try
//   {
//     return bcrypt.compare( password, this.password );
//   } catch ( error )
//   {
//     res.status( 400 ).json( error );
//   }
// };

// JWT Token
allUserSchema.methods.generateToken = async function ()
{
  try
  {
    return jwt.sign( {
      userId: this._id.toString(),
      mobile_number: this.mobile_number,
      isAdmin: this.isAdmin,
      isStatus: this.status,
    },
      process.env.JWT_SECRET_KEY
    );
  } catch ( error )
  {
    res.status( 400 ).json( error );
  }
};


// loginModal.methods.comparePassword = async function ( password )
// {
//     try
//     {
//         const compare = await bcrypt.compare( password, this.password );
//         if ( !compare )
//         {
//             return password === this.password;
//         } else
//         {
//             return bcrypt.compare( password, this.password );
//         }
//     } catch ( error )
//     {
//         res.status( 400 ).json( error );
//     }
// };

// loginModal.methods.generateToken = async function ()
// {
//     try
//     {
//         return jwt.sign( {
//             userId: this._id.toString(),
//             mobile_number: this.mobile_number,
//             isAdmin: this.isAdmin,
//             isStatus: this.status,
//         },
//             process.env.JWT_SECRET_KEY
//         );
//     } catch ( error )
//     {
//         console.log( error );
//         res.status( 400 ).json( error );
//     }
// };

const AllUser = mongoose.model( 'AllUser', allUserSchema );

module.exports = AllUser;
