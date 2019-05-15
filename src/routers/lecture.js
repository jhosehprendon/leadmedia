const express = require('express');
const Lecture = require('../models/lecture');
const auth = require('../middleware/auth');
const checkTeacher = require('../middleware/checkTeacher');

const router = new express.Router();


//////// MODULE ROUTES - :id (ID of corresponding module) ////////

router.post('/lecture/:idCourse/:idModule', auth, checkTeacher, async (req, res) => {
    const lecture = new Lecture({
        ...req.body,
        ownerModule: req.params.idModule,
        ownerCourse: req.params.idCourse,
        owner: req.user._id
    })

    try {
        await lecture.save()
        res.status(201).send(lecture)
    } catch(e) {
        res.status(400).send(err)
    }

})


router.patch('/lecture/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description', 'videoLink']
    const isValidOperation = updates.every(el => {
        return allowedUpdates.includes(el)
    })

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates'})
    }

    try {
        
        const lecture = await Lecture.findOne({_id: req.params.id, owner: req.user._id})
   
        if(!lecture) {
            return res.status(404).send()
        }
        
        updates.forEach((el) => lecture[el] = req.body[el])
        await lecture.save()
        res.send(lecture)
        
    }catch(e) {
        res.status(400).send()
    }
})



// GET ALL LECTURES FROM SPECIFIC MODULE (:ID)

router.get('/lectures/:idModule', auth, async (req, res) => {

    try {
  
        const lecture = await Lecture.find({ ownerModule: req.params.idModule })
     
        res.send(lecture)
    } catch(e) {
        res.status(500).send()
    }
    
})

// DELETE Module

router.delete('/lecture/:id', auth, async (req, res) => {
    try {
        const lecture = await Lecture.findByIdAndRemove({ _id: req.params.id, owner: req.user._id})

        if(!lecture) {
            res.send(404).send()
        }
        res.send(lecture)
    }catch(e) {
        res.status(500).send()
    }
})

module.exports = router