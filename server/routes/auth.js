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

        res.status(201).json({ message: 'User created successfully' });
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

router.get('/home',async (req, res) => {
    try {
        const user = await User.find()
        res.json(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
})

router.get('/profile/:id', async (req,res) =>{
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({message:'User not found'})
        }else{
            res.json(user)
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
})

router.put('/profile/update/:id', async (req,res) =>{
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, req.body,{new: true})
        if(!updateUser){
            return res.status(404).json({message: 'User not found'})
        }
        res.json(updateUser)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:'Server Error'})
    }
})

router.delete('/delete/:id', async (req,res) =>{
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id)
        if(!deleteUser){
            return res.status(404).json({message:'User not found'})
        }
        res.json({message:'User Deleted successfully'})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:'Server Error'})
    }
})
module.exports = router;