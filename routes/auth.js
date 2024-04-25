const express = require('express')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config/config')
const User = require('../models/user')

const router = express.Router();

router.post('/signup', async(req,res) =>{
    try {
        const {name, rollNo, year, email, password, confirmPassword} = req.body;

        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: 'user already exists'});
        }

        if(password !== confirmPassword){
            return res.status(400).json({message: 'Password do not match'})
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        user = new User({ name, rollNo, year, email, password: hashedPassword})
        await user.save();

        res.status(201).json({ message: 'User Created Sucessfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
        
    }
})

router.post('/login', async (req, res) =>{
    try {
        const {email, password} = req.body;

        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({ message: 'Invalid Username' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid Password' });
        }

        const payload = {
            user : {
                id: user.id
            }
        };

        jwt.sign(payload, config.jwtSecret, { expiresIn: 3600 }, (err, token) =>{
            if(err) throw err;
            res.json({token});
        });
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;