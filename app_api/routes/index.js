const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

//This is where we import the controllers we will route
const tripsController = require("../controllers/trips");
const authController = require('../controllers/authentication');

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

//Method to authenticate JWT
function authenticateJWT(req, res, next) {
    console.log('In Middleware');
    const authHeader = req.headers["authorization"];
    console.log('Auth Header: ' + authHeader);
    if (authHeader == null) {
        console.log("Auth Header Required but NOT PRESENT ! ");
        return res.sendStatus(401);
    }
    let headers = authHeader.split(" ");
    if (headers.lentgh < 1) {
        console.log("Not enough tokens in Auth Header: " + headers.length);
        return res.sendStatus(501);
    }
    const token = authHeader.split(" ")[1];
    console.log('Token: ' + token);
    if (token == null) {
        console.log("Null Bearer Token");
        return res.sendStatus(400);
    }
    console.log(process.env.JWT_SECRET);

    console.log(jwt.decode(token));

    const verified = jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, verified) => {
            if (err) {
                return res.sendStatus(401).json("Token Validation Error!");
            }
            req.auth = verified; //Set the auth param to decoded object
        }
    );
    next(); //We need to continue or this will hang forever
}

// Define route for our trips endpoint
router
    .route('/login')
    .post(authController.login);

router
    .route('/register')
    .post(authController.register);

router
    .route('/trips')
    .get(tripsController.tripsList)
    .post(authenticateJWT, tripsController.tripsAddTrip); //POST Method Adds a Trip
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode) //GET Method routes tripList
    .put(authenticateJWT, tripsController.tripsUpdateTrip);

module.exports = router;