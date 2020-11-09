const {Rental, validate} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const Fawn = require('fawn');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');


Fawn.init(mongoose);

// Get all rentals
router.get('/', async (req,res) => {
    const rentals = await Rental.find().sort('-dateOut'); 
    res.send(rentals);
});

// Get a specific rental
router.get('/:id', validateObjectId, async (req,res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send('The rental with the given ID isn\'t found'); // If doesn't exist, return 404
    res.send(rental);
});

// Create a new rental
router.post('/', async (req,res) => { 
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); // If invalid, return 400 - bad request
    
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send('The customer with the given ID isn\'t found'); // If doesn't exist, return 404

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send('The movie with the given ID isn\'t found'); // If doesn't exist, return 404

    if (movie.numberInStock === 0) return res.status(404).send(`${movie.title} is not in stock.`);

    // creation 
    let rental = new Rental({
        customer: {
            _id: customer._id,
            isGold: customer.isGold,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
    });

    try {
        new Fawn.Task ()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 } // movie.numberInStock--
            })
            .run();
    }
    catch(ex) {
        res.status(500).send('Something failed');
    }
    res.send(rental);
});

// // Update rental 

// // Delete rental

module.exports = router;