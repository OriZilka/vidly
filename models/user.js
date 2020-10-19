const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');;
// const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
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
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}
const User = mongoose.model('User', userSchema );

// Validation help function
function validateUser(user) {

    // const passwordcomplexityOptions = {
    //     min: 10,
    //     max: 30,
    //     lowerCase: 1,
    //     upperCase: 1,
    //     numeric: 1,
    //     symbol: 1,
    //     requirementCount: 2,
    // }

    const schema = Joi.object(
        {
            name: Joi.string().min(2).max(50).required(),
            email: Joi.string().min(5).max(255).required().email(),
            password: Joi.string().min(5).max(255).regex(/.*[A-Z].*/)
                .regex(/.*[0-9].*/).required()
            // password: passwordComplexity(passwordcomplexityOptions) //.required()
        });
    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;