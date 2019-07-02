const express = require('express');
const AgencyClient = require('../models/agencyClient');

const router = new express.Router();

//////// AGENCY ROUTES ////////

router.post('/agency-client', async (req, res) => {
    const agencyClient = new AgencyClient(req.body)
    try {
        await agencyClient.save()
        // sendWelcomeEmail(user.email, user.name)
        res.status(201).send(agencyClient)
    } catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router