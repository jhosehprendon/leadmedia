const express = require('express');
const ActiveCampaign = require("activecampaign");
const AgencyLead = require('../models/agencyLead');

const router = new express.Router();
const ac = new ActiveCampaign("https://payjhosehp.api-us1.com", "aa9ace4505ed827783707a3c542f46abd5aee91825de6725112370260201e6708a2abff8");

//////// AGENCY LEAD ROUTES ////////

router.post('/agency-lead', async (req, res) => {
    const agencyLead = new AgencyLead(req.body)
    try {
        await agencyLead.save()

        // Active Campaign
        var contact = {
            'email': agencyLead.email,
            'first_name': agencyLead.name,
            'p[2]': 1,
            'status[2]': 1,
        };
        var contact_add = ac.api("contact/add", contact);

        contact_add.then(function(result) {
            console.log(result);
        }, function(result) {
            console.log(result);
        });

        res.status(201).send(agencyLead)
    } catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router