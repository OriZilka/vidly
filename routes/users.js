const {User, validate} = require('../models/user');
const express = require('express');
const router = express.Router();

// Get all users
router.get('/', async (req,res) => {
    const users = await User.find().sort({ name: 1 });
    res.send(users);
});

// Creating a new user (registration)
router.post('/', async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); // If invalid, return 400 - bad request
    
    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User already registered');

    // creation 
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        await user.save();
    }
    catch(ex) {
        for(field in ex.errors)
            console.log(ex.errors[field].message);
    }
    res.send(user);
});

// Delete user
router.delete('/:id', async (req,res) => {   
    const user = await User.findByIdAndDelete(req.params.id); 
    if (!user) return res.status(404).send('The user with the given ID isn\'t found'); // If doesn't exist, return 404
    res.send(user);
});

module.exports = router;
