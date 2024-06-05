const adminMiddleware = async ( req, res, next ) =>
{
    try
    {
        // console.log( req.user[0].isAdmin );
        const adminRole = req.user[0].isAdmin;
        // console.log(adminRole)
        if(!adminRole){
            return res.status(403).json({message:"Access Denied User is Not Admin"});
        }
        // res.status(200).json(req.user[0].isAdmin)
        next();
    } catch ( error )
    {
        next(error);
    }
};

module.exports = adminMiddleware;