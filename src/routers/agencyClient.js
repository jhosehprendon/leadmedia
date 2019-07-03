const express = require('express');
const ActiveCampaign = require("activecampaign");

const router = new express.Router();

//////// AGENCY CLIENT ROUTES ////////

router.post('/agency-client', async (req, res) => {
    const agencyClient = new AgencyClient(req.body)
    try {
        await agencyClient.save()

        res.status(201).send(agencyClient)
    } catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router