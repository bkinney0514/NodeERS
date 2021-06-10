//imports
// import 'regenerator-runtime/runtime';
// import axios from 'axios';

const express = require('express')
const app = express()
const path = require('path'); 
const bodyParser = require('body-parser');;
const {MongoClient} = require ('mongodb');
const { readFileSync } = require('fs')
const http = require('http')
const mongod = require('mongodb')
// const axios = require('axios').default

const port = process.env.PORT || 5000;
const uri = "mongodb+srv://rmb:rmbpass@testdb.rfocg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true }); 

const { createRmb, 
    viewEmps, 
    viewPending, 
    viewResolved, 
    viewEmpRequests,
    empViewPending,
    empViewResolved,
    resolve,
    clearDB } = require('./mongodb');
const { urlencoded } = require('express');

// --------------------------------------------Static/Middleware--------------------------------------------------------------
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));
// ----------------------------------------------HTML loading -----------------------------------------------------------------
//index page
app.get('/', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, './html/index.html'))
})

//emp home page
app.get('/emphome', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, './html/empHome.html'))
})

//manager home page
app.get('/manager', (req,res) => { 
    res.status(200).sendFile(path.resolve(__dirname, './html/manHome.html'))
})

//managers - view all pending requests
app.get('/manager/pending', (req, res) => { 
    res.status(200).sendFile(path.resolve(__dirname, './html/pending.html'))

})

//managers - view all resolved requests
app.get('/manager/resolved', (req, res) => { 
    res.status(200).sendFile(path.resolve(__dirname, './html/resolved.html'))
})

// view requests by employee
app.get('/requests/:id',(req,res) =>{
    res.status(200).sendFile(path.resolve(__dirname, './html/empRequest.html'))
})

// view all employees
app.get('/employees',(req,res) =>{
    res.status(200).sendFile(path.resolve(__dirname, './html/employees.html'))
})



//// ----------------------------------------------CRUD operations --------------------------------------------------------------

//employee submit new rmb request
app.post('/emphome/newrmb', (req, res) => { 
    const { empname, amount, reason } = req.body;
    console.log(req.body)
    
    const result = createRmb(client, {
        empname: empname, 
        amount: amount, 
        reason: reason,  
        status: 'pending', 
        comment: ''
    })

    if (result) { 
        res.status(200).send('new rmb created successfully')
    } else {
        res.status(500).send('unable to create request')
    }
})

//manager view all employees
app.get('/manager/employees', (req, res) => { 
    const results = viewEmps(client).then((results)=>{
        if (results.length > 0) { 
            res.status(200).send(results)
        } else { 
            res.status(500).send('yikes')
        }
    })    
})

//delete all reimbursements
app.get('/clear', (req,res) => {
    const results = clearDB(client).then((results) =>{
        if (results) {
            res.status(200).send('database cleared')
        } else {
            res.status(500).send('oh yikes')
        }
    })
})

//manager view all pending requests
app.get('/pending', (req, res) => {
    const results = viewPending(client).then((results)=>{
        if(results.length > 0) { 
            res.status(200).send(results)
        } else { 
            res.status(500).send('YIKES!')
        }
    })
})

//manager view all resolved requests
app.get('/resolved', (req, res) => { 
    const results = viewResolved(client).then((results) => { 
        if (results.length > 0) { 
            res.status(200).send(results)
        } else { 
            res.status(500).send('yikeroni')
        }
    })
})

//Manager view requests by employee name.
app.get('/emprequests/:name', (req, res) => { 
    const name = req.params.name; 
    const results = viewEmpRequests(client, name).then((results) => {
        if (results.length > 0) { 
            res.status(200).send(results)
        } else { 
            res.status(500).send('yikerino')
        }
    })
})

//Employee view their own pending requests
app.get('/pending/:name', (req, res) => { 
    const name = req.params.name;
    const results = empViewPending(client, name).then((results) => { 
        if (results.length > 0) { 
            res.status(200).send(results)
        } else { 
            res.status(500).send('error')
        }
    })
})

//Employee view their own resolved requests
app.get('/resolved/:name', (req, res) => { 
    const name = req.params.name; 
    const results = empViewResolved(client, name).then((results) => {
        if (results.length > 0) { 
            res.status(200).send(results)
        } else { 
            res.status(500).send('error')
        }
    })
})

//Manager update request status
app.put('/resolve/:id/:status', (req, res) => {
    //const id = req.params.id;
    const id = mongod.ObjectID(req.params.id)
    // const newStatus = 'approved';
    const status = req.params.status;
    const result = resolve(client, id, {status: status}).then((result) =>{
        if (result) {
            res.status(200).send(result)
        } else {
            res.status(500).send('oh yikes')
        }
    })
})

app.put('/deny/:id', (req, res) => {
    //const id = req.params.id;
    const id = mongod.ObjectID(req.params.id)
    // const newStatus = 'approved';
    const result = resolve(client, id, {status: 'approved'}).then((result) =>{
        if (result) {
            res.status(200).send(result)
        } else {
            res.status(500).send('oh yikes')
        }
    })
})

//Gabe's Wild exploration with sending information to Mongodb
app.post('/empHome', function(req, res) {
    const { empname, amount, reason } = req.body;
    const newreq = 
        { empname: empname, 
        amount: amount,
        reason: reason} 
        // Testing purposes
    // console.log(empname) 
    // console.log(reason)  
    // console.log(amount)   
    res.send(newreq)
});



//404 handling
app.get('*', (req,res) => { 
    res.status(200).sendFile(path.resolve(__dirname, './html/404.html'))
})

//Heroku conflicts?
app.listen(port, () => {
    try {
        client.connect();
    } catch (e) {
        console.error(e);
    } finally {
        client.close();
    }
    console.log('Server is listening on port: ' + port)
})