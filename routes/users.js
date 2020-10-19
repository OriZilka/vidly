const auth = require('../middleware/auth');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const {User, validate} = require('../models/user');
const express = require('express');
const router = express.Router();

// Getting info about the current user
router.get('/me', auth, async (req,res) => {
    const users = await User.findById(req.user._id).select('-password');
    res.send(users);
});

// Creating a new user (registration)
router.post('/', async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); // If invalid, return 400 - bad request
    
    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send(`A user with email ${req.body.email} is already registered`);
    
    // creation 
    user = new User(_.pick(req.body, [ 'name', 'email', 'password' ]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
        await user.save();
    }
    catch(ex) {
        for(field in ex.errors)
            console.log(ex.errors[field].message);
    }
    
    const token = user.generateAuthToken();
    res.header('x-authentication-token', token).send(_.pick(user, [ '_id', 'name', 'email' ]));
});

// Delete user
router.delete('/:id', async (req,res) => {   
    const user = await User.findByIdAndDelete(req.params.id); 
    if (!user) return res.status(404).send('The user with the given ID isn\'t found'); // If doesn't exist, return 404
    res.send(user);
});

module.exports = router;
