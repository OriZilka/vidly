const {Customer, validate} = require('../models/customer');
const express = require('express');
const router = express.Router();

// Get all customers
router.get('/', async (req,res) => {
    const customers = await Customer.find().sort({ name: 1 });
    res.send(customers);
});

// Get a specific customer
router.get('/:id', async (req,res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID isn\'t found'); // If doesn't exist, return 404
    res.send(customer);
});

// Create a new customer
router.post('/', async (req,res) => { 
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); // If invalid, return 400 - bad request
    
    // creation 
    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    try {
        customer = await customer.save();
    }
    catch(ex) {
        for(field in ex.errors)
            console.log(ex.errors[field].message);
    }
    res.send(customer);
});

// Update customer 
router.put('/:id', async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); // If invalid, return 400 - bad request
    
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        }
    }, { new: true });

    if (!customer) return res.status(404).send('The customer with the given ID isn\'t found'); // If doesn't exist, return 404
    res.send(customer); // return the updated customer
});

// Delete customer
router.delete('/:id', async (req,res) => {   
    const customer = await Customer.findByIdAndDelete(req.params.id); 
    if (!customer) return res.status(404).send('The customer with the given ID isn\'t found'); // If doesn't exist, return 404
    res.send(customer);
});

module.exports = router;