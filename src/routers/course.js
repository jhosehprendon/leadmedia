const express = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const checkTeacher = require('../middleware/checkTeacher');

const router = new express.Router();


//////// BUSINESS ROUTES ////////

router.post('/course', auth, checkTeacher, async (req, res) => {
    const course = new Course({
        ...req.body,
        owner: req.user._id
    })

    try {
        await course.save()
        res.status(201).send(course)
    } catch(e) {
        res.status(400).send(err)
    }

})

router.get('/course/:id', auth, async (req, res) => {

    const _id = req.params.id

    try {

        const course = await Course.findOne({ _id, owner: req.user._id})

        if(!course) {
            return res.status(404).send()
        }
        res.send(course)
    } catch(e) {
        res.status(500).send()
    }

})

router.patch('/course/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description']
    const isValidOperation = updates.every(el => {
        return allowedUpdates.includes(el)
    })

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates'})
    }

    try {
        
        const course = await Course.findOne({_id: req.params.id, owner: req.user._id})
   
        if(!course) {
            return res.status(404).send()
        }
        
        updates.forEach((el) => course[el] = req.body[el])
        await course.save()
        res.send(course)
        
    }catch(e) {
        res.status(400).send()
    }
})

router.delete('/course/:id', auth, async (req, res) => {
    try {

        const course = await Course.findOneAndDelete({ _id: req.params.id, owner: req.user._id})

        if(!course) {
            res.send(404).send()
        }
        res.send(course)
    }catch(e) {
        res.status(500).send()
    }
})

module.exports = router