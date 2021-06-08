//imports
const express = require('express')
const app = express()
const path = require('path'); 
const bodyParser = require('body-parser');;
const {MongoClient} = require ('mongodb');
const { readFileSync } = require('fs')
const http = require('http')

const uri = "mongodb+srv://rmb:rmbpass@testdb.rfocg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true }); 

const { createRmb } = require('./mongodb');
const { urlencoded } = require('express');

// --------------------------------------------Static/Middleware--------------------------------------------------------------
app.use(express.urlencoded({extended: false}))
app.use(express.json())

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

//404 handling
app.get('*', (req,res) => { 
    res.status(200).sendFile(path.resolve(__dirname, './html/404.html'))
})

//// ----------------------------------------------CRUD operations --------------------------------------------------------------

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

app.listen(5000, () => {
    try {
        client.connect();
    } catch (e) {
        console.error(e);
    } finally {
        client.close();
    }
    console.log('Server is listening on port 5000...')
})