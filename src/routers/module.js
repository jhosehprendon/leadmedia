const express = require('express');
const Module = require('../models/module');
const auth = require('../middleware/auth');
const checkTeacher = require('../middleware/checkTeacher');
const checkCourse = require('../middleware/checkCourse');

const router = new express.Router();


//////// MODULE ROUTES - :id (ID of corresponding course) ////////

router.post('/module/:idCourse', auth, checkTeacher, checkCourse, async (req, res) => {
    const modules = new Module({
        ...req.body,
        ownerCourse: req.params.idCourse,
        owner: req.user._id
    })

    try {
        await modules.save()
        res.status(201).send(modules)
    } catch(e) {
        res.status(400).send(err)
    }

})


router.patch('/module/:id', auth, checkTeacher, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name']
    const isValidOperation = updates.every(el => {
        return allowedUpdates.includes(el)
    })

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates'})
    }

    try {
        
        const modules = await Module.findOne({_id: req.params.id, owner: req.user._id})
   
        if(!modules) {
            return res.status(404).send()
        }
        
        updates.forEach((el) => modules[el] = req.body[el])
        await modules.save()
        res.send(modules)
        
    }catch(e) {
        res.status(400).send()
    }
})



// GET ALL MODULES FROM SPECIFIC COURSE (:ID)

router.get('/modules/:idCourse', auth, checkCourse, async (req, res) => {

    try {
  
        const modules = await Module.find({ ownerCourse: req.params.idCourse })
     
        res.send(modules)
    } catch(e) {
        res.status(500).send()
    }
    
})

// DELETE Module

router.delete('/module/:id', auth, checkTeacher, async (req, res) => {
    try {
        const modules = await Module.findByIdAndRemove({ _id: req.params.id, owner: req.user._id})

        if(!modules) {
            res.send(404).send()
        }
        res.send(modules)
    }catch(e) {
        res.status(500).send()
    }
})

module.exports = router