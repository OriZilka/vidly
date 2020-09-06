const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
// const {customerSchema} = require('./customer');
const {movieSchema} = require('./movie'); 


const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            isGold:{
                type: Boolean,
                default: false
            },
            name: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 50
            },
            phone: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 50
            } 
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 2,
                maxlength: 50
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturn: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0,
    }
}));

// Validation help function
function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
        });
    return schema.validate(rental);
};

module.exports.Rental = Rental;
module.exports.validate = validateRental;