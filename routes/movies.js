const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');
const express = require('express');
const router = express.Router();

// Get all movies
router.get('/', async (req,res) => {
    const movies = await Movie.find().sort({ title: 1 });
    res.send(movies);
});

// Get a specific movie
router.get('/:id', async (req,res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('The movie with the given ID isn\'t found'); // If doesn't exist, return 404
    res.send(movie);
});

// Create a new movie
router.post('/', async (req,res) => { 
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); // If invalid, return 400 - bad request
    
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send('The genre with the given ID isn\'t found'); // If doesn't exist, return 404

    // creation 
    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    try {
        movie = await movie.save();
    }
    catch(ex) {
        for(field in ex.errors)
            console.log(ex.errors[field].message);
    }
    res.send(movie);
});

// Update movie 
router.put('/:id', async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); // If invalid, return 400 - bad request
    
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send('The genre with the given ID isn\'t found'); // If doesn't exist, return 404

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            genre: {
                _id: genre.id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }
    }, { new: true });

    if (!movie) return res.status(404).send('The movie with the given ID isn\'t found'); // If doesn't exist, return 404
    res.send(movie); // return the updated movie
});

// Delete movie
router.delete('/:id', async (req,res) => {   
    const movie = await Movie.findByIdAndDelete(req.params.id); 
    if (!movie) return res.status(404).send('The movie with the given ID isn\'t found'); // If doesn't exist, return 404
    res.send(movie);
});

module.exports = router;