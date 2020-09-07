const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        min: 5,
        max: 1024
    }
}));

// Validation help function
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
        });
    return schema.validate(user);
};

module.exports.User = User;
module.exports.validate = validateUser;