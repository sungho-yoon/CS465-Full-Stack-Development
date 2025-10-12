const express = require("express");
const router = express.Router();

//This is where we import the controllers we will route
const tripsController = require("../controllers/trips");

// Define route for our trips endpoint
router.route('/trips')
        .get(tripsController.tripsList)
        .post(tripsController.tripsAddTrip); //POST Method Adds a Trip

//GET Method routes tripsFindByCode = requires parameter
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode) //GET Method routes tripList
    .put(tripsController.tripsUpdateTrip);

module.exports = router;