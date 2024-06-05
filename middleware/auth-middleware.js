const jwt = require( "jsonwebtoken" );
const AllUser = require( "../models/allUser-model" );

const authMiddleWare = async ( req, res, next ) =>
{
    const token = req.header( "Authorization" );
    // console.log( token );
    if ( !token )
    {
        return res.status( 401 ).json( { message: "Unauthorized HTTP , Token not provided" } );
    }

    const jwtToken = token.replace( "Bearer", "" ).trim();
    try
    {
        const isVerified = jwt.verify( jwtToken, process.env.JWT_SECRET_KEY );
        // console.log(isVerified)
        // console.log(isVerified.mobile_number);
        const userData = await AllUser.find( { mobile_number: isVerified.mobile_number } );
        req.user = userData;
        req.token = token;
        req.userID = userData._id;
    } catch ( error )
    {
        return res.status( 401 ).json( { message: "Unauthorized. Invalid Token" } );
    }
    next();
};

module.exports = authMiddleWare;