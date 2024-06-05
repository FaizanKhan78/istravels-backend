require( 'dotenv' ).config();
const express = require( 'express' );
const app = express();
const cors = require( 'cors' );
const router = require( './router/auth-router' );
const adminRouter = require( './router/admin-router' );
const connectDB = require( './utils/db' );
const errorMiddleware = require( './middleware/error-middleware' );

const allowedOrigins = [ 'http://localhost:5173', 'https://666032b286974fe5be82961b--flourishing-pika-02ecfd.netlify.app', 'https://main--istravels.netlify.app' ];

const corsOptions = {
    origin: ( origin, callback ) =>
    {
        if ( !origin || allowedOrigins.includes( origin ) )
        {
            callback( null, true );
        } else
        {
            callback( new Error( 'Not allowed by CORS' ) );
        }
    },
    methods: "GET,POST,DELETE,PATCH,PUT",
    credentials: true,
    optionsSuccessStatus: 200 // Ensure successful OPTIONS requests
};
// Apply CORS middleware
app.use( cors( corsOptions ) );
app.options( cors( corsOptions ) );

// Apply other middleware
app.use( express.json() );

// Define the root route
app.get( '/', ( req, res ) =>
{
    res.json( "Welcome to the iStravels API!" );
} );

// Define other routes
app.use( '/api/auth', router );
app.use( '/admin', adminRouter );
app.get( '/api/getkey', ( req, res ) => res.status( 200 ).json( { key: process.env.RAZORPAY_API_KEY } ) );

// Error handling middleware
app.use( errorMiddleware );

// Connect to the database and start the server
const PORT = process.env.PORT || 9000;
connectDB().then( () =>
{
    app.listen( PORT, () =>
    {
        console.log( `Server is running at localhost ${ PORT }` );
    } );
} );
