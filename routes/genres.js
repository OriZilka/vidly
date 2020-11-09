const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const {Genre, validate} = require('../models/genre');
const express = require('express');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');

// Get all genres
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort({ name: 1 });
    res.send(genres);
});

// Get a specific genre
router.get('/:id', validateObjectId, async (req,res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send('The genre with the given ID isn\'t found'); // If doesn't exist, return 404
    
    res.send(genre);
});

// Create a new genre
router.post('/', auth, async (req,res) => {     
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); // If invalid, return 400 - bad request
    
    // creation 
    const genre = new Genre({ name: req.body.name });

    try {
        await genre.save();
    }
    catch(ex) {
        for(field in ex.errors)
            console.log(ex.errors[field].message);
    }
    res.send(genre);
});

// Update genre
router.put('/:id', validateObjectId, auth, async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); // If invalid, return 400 - bad request
    
    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name
        }
    }, { new: true });

    if (!genre) return res.status(404).send('The genre with the given ID isn\'t found'); // If doesn't exist, return 404
    res.send(genre); // return the updated genre
});

// Delete genre
router.delete('/:id', validateObjectId, [auth, admin], async (req,res) => {   
    const genre = await Genre.findByIdAndDelete(req.params.id); 
    if (!genre) return res.status(404).send('The genre with the given ID isn\'t found'); // If doesn't exist, return 404
    res.send(genre);
});

module.exports = router;