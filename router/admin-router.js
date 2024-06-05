const express = require( 'express' );
const adminRouter = express.Router();
const adminController = require( "../controller/admin-controller" );
const authMiddleWare = require( "../middleware/auth-middleware" );
const adminMiddleware = require( "../middleware/admin-middleware" );


adminRouter.route( '/getallusers' ).get( authMiddleWare, adminController.getAllNewData );

adminRouter.route( '/updateallusers' ).patch( authMiddleWare, adminController.updateAllUsers );

adminRouter.route( '/updatesingle/:number' ).patch( authMiddleWare, adminController.updateSingle );

adminRouter.route( '/delete/:id' ).delete( authMiddleWare, adminController.deleteUser );


module.exports = adminRouter;