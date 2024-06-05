const express = require( 'express' );
const router = express.Router();
const authController = require( '../controller/auth-controller' );
const validate = require( "../middleware/validate-middleware" );
const signupSchema = require( "../validator/auth-validator" );
const loginSchema = require( "../validator/login-validator" );
const authMiddleWare = require( "../middleware/auth-middleware" );

router.route( '/update' ).post( authController.update );

router.route( '/register' ).post( validate( signupSchema ), authController.register );

router.route( '/login' ).post( validate( loginSchema ), authController.login );

router.route( '/invoice' ).get( authMiddleWare, authController.invoice );

router.route( '/checkout' ).post( authController.checkout );

router.route( '/paymentverification' ).post( authController.paymentVerification );

router.route( '/updatepassword/:number' ).patch( authController.updatePassword );

// router.route('/olddata/:number').get(authController.oldData);


module.exports = router;
