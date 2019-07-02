const express = require('express');
const AgencyLead = require('../models/agencyLead');

const router = new express.Router();

//////// AGENCY LEAD ROUTES ////////

router.post('/agency-lead', async (req, res) => {
    const agencyLead = new AgencyLead(req.body)
    try {
        await agencyLead.save()
        // sendWelcomeEmail(user.email, user.name)
        res.status(201).send(agencyLead)
    } catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router