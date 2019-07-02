const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const courseRouter = require('./routers/course');
const moduleRouter = require('./routers/module');
const lectureRouter = require('./routers/lecture');
const agencyClientRouter = require('./routers/agencyClient');
const agencyLeadRouter = require('./routers/agencyLead');

const app = express()
const port = process.env.PORT

// Maintenance Mode Middleware

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down')
// })

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        res.status(200).json({ })
    }
    next()
})

app.use(express.json())
app.use(userRouter)
app.use(courseRouter)
app.use(moduleRouter)
app.use(lectureRouter)
app.use(agencyClientRouter)
app.use(agencyLeadRouter)

app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})