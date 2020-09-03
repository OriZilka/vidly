const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    } 
});

const Genre = mongoose.model('Genre', genreSchema);

// Validation help function
function validateGenres(genre) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required()
        });
    return schema.validate(genre);
};

module.exports.genreSchema = genreSchema;
module.exports.Genre = Genre;
module.exports.validate = validateGenres;