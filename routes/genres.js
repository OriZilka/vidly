const Joi = require('@hapi/joi');
const express = require('express');
const router = express.Router();

router.use(express.json());

const genres = [ 
    {id: 1, name: 'Action'},
    {id: 2, name: 'Horor'},
    {id: 3, name: 'Romance'},
];

let numOfDeletes = 0; // Stay in track of id numbers when adding, prevent duplicate id's

// Get all genres
router.get('/', (req,res) => {
    res.send(genres);
});

// Get a specific genre
router.get('/:id', (req,res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id)); // Look up the genre
    if (!genre) return res.status(404).send('The genre with the given ID isn\'t found'); // If doesn't exist, return 404
    res.send(genre);
});

// Create a new genre
router.post('/', (req,res) => { 
    const { error } = validateGenres(req.body); // Validate
    if(error) return res.status(400).send(error.details[0].message); // If invalid, return 400 - bad request
    
    // creation 
    const genre = {
        id: genres.length + numOfDeletes + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

// Update genre
router.put('/:id', (req,res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id)); // Look up the genre
    if (!genre) return res.status(404).send('The genre with the given ID isn\'t found'); // If doesn't exist, return 404
   
    const { error } = validateGenres(req.body); // Validate
    if(error) return res.status(400).send(error.details[0].message); // If invalid, return 400 - bad request
 
    genre.name = req.body.name; // updating
    res.send(genre); // return the updated genre
});

// Delete genre
router.delete('/:id', (req,res) => {    
    const genre = genres.find(g => g.id === parseInt(req.params.id)); // Look up the genre
    if (!genre) return res.status(404).send('The genre with the given ID isn\'t found'); // If doesn't exist, return 404
   
    // uncomment this when delete by name
    // const { error } = validateGenres(req.body); // Validate
    // if(error) return res.status(400).send(error.details[0].message); // If invalid, return 400 - bad request
    
    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    numOfDeletes++;

    res.send(genre);
});

// Validtation help function
function validateGenres(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
        });
    return schema.validate(genre);
    //     return Joi.validate(genre, schema); // previus version 
};

module.exports = router;