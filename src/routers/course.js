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


////// GET ADVANCED


// router.get('/courses', auth, checkCourses, async (req, res) => {
//     const match = {}
//     const sort = {}
//     if(req.query.completed) {
//         match.completed = req.query.completed === 'true'
//     }

//     if(req.query.sortBy) {
//         const parts = req.query.sortBy.split(':')
//         sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
//     }

//     if(req.business) {
//         try {
//             await req.business.populate({
//                 path: 'activity',
//                 match,
//                 options: {
//                     limit: parseInt(req.query.limit),
//                     skip: parseInt(req.query.skip),
//                     sort
//                 }
//             }).execPopulate()
    
//             res.send(req.business.activity)
//         } catch(e) {
//             res.status(500).send()
//         }
//     } else {
//         res.status(400).send({ error: 'You have not created a business yet'})
//     }
// })

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

module.exports = router