const express = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const checkTeacher = require('../middleware/checkTeacher');

const router = new express.Router();


//////// COURSE ROUTES ////////

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

        const course = await Course.findOne({ _id })

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

//////////////////////////////////
////// GET ADVANCED COURSES///////
/////////////////////////////////


///// USER SPECIFIC CORUSES (TEACHER)

router.get('/courses', auth, async (req, res) => {
    const sort = {}

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'course',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(req.user.course)
    } catch(e) {
        res.status(500).send()
    }
})

// ALL COURSES AVALABLE

router.get('/courses/all', auth, async (req, res) => {
    const sort = {}
    let limit = null
    let skip = 0

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    if(req.query.limit) {
        limit = parseInt(req.query.limit) 
        skip = parseInt(req.query.skip) || 0
    }

    try {
  
        const courses = await Course.find()

        var coursesFiltered = courses.sort(() => {
            return sort.createdAt
        })

        if(limit) {
            var coursesLimit = []
            for(var i = skip; i < limit+skip; i++) {
                if(coursesFiltered[i] == null) {
                    break;
                }
                coursesLimit.push(coursesFiltered[i])
            }
            return res.send(coursesLimit)
        }
        res.send(coursesFiltered)
    } catch(e) {
        res.status(500).send()
    }
    
})

// DELETE Course

router.delete('/course/:id', auth, async (req, res) => {
    try {
        const course = await Course.findByIdAndRemove({ _id: req.params.id, owner: req.user._id})

        if(!course) {
            res.send(404).send()
        }
        res.send(course)
    }catch(e) {
        res.status(500).send()
    }
})

module.exports = router