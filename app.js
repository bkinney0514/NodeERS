//imports
const express = require('express')
const app = express()
const path = require('path'); 
const {MongoClient} = require ('mongodb');
const { readFileSync } = require('fs')
const http = require('http')

const uri = "mongodb+srv://rmb:rmbpass@testdb.rfocg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true }); 
const { createRmb } = require('./mongodb')

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

app.post('/employee/newrmb', (req, res) => { 
    const { amount, reason } = req.body

    try { 
        client.connect();

        createRmb(client, {
            // empname: empname, 
            amount: amount, 
            reason: reason,  
            status: 'pending', 
            comment: ''
        })
    } catch (e) {
        console.error(e); 
    } finally { 
        client.close(); 
    }
})

app.listen(5000, () => {
    console.log('Server is listening on port 5000...')
})