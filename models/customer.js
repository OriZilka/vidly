const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const customerSchema = new mongoose.Schema({
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
});

const Customer = mongoose.model('Customer', customerSchema);

// Validation help function
function validateCustomers(customer) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        phone: Joi.string().min(2).max(50).required(),
        isGold: Joi.boolean()
        });
    return schema.validate(customer);
};

module.exports.customerSchema = customerSchema;
module.exports.Customer = Customer;
module.exports.validate = validateCustomers;
