const _ = require('lodash');
// const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user');
const Joi = require('@hapi/joi');
const express = require('express');
const router = express.Router();

// Authentication of an existing user
router.post('/', async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); // If invalid, return 400 - bad request
    
    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send(`Invalid email`);
    
    // const validPassword = await bcrypt.compare(req.body.password, user.password)
    // if (!validPassword) return res.status(400).send(`Invalid password`);

    const token = user.generateAuthToken();
    res.send(token);
});

function validate(req) {
    const schema = Joi.object(
        {
            email: Joi.string().min(5).max(255).required().email(),
            password: Joi.string().min(5).max(255).required()
        });
    return schema.validate(req);
}

module.exports = router;
