const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    } 
}));

// Validtation help function
function validateGenres(genre) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required()
        });
    return schema.validate(genre);
};

module.exports.Genre = Genre;
module.exports.validate = validateGenres;