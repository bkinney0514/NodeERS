//imports
// import 'regenerator-runtime/runtime';
// import axios from 'axios';

const express = require('express');
const app = express();
const path = require('path'); 
const bodyParser = require('body-parser');;
const {MongoClient} = require ('mongodb');
const { readFileSync } = require('fs');
const http = require('http');
const mongod = require('mongodb');

// const axios = require('axios').default

const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI || "mongodb+srv://rmb:rmbpass@testdb.rfocg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"; 
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true });
const cors = require('cors'); 

const { createRmb, 
    viewEmps, 
    viewAllEmps,
    viewPending, 
    viewResolved, 
    viewEmpRequests,
    empViewPending,
    empViewResolved,
    resolve,
    clearDB,
    addEmp } = require('./mongodb');
const { urlencoded } = require('express');

// --------------------------------------------Static/Middleware--------------------------------------------------------------
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));
app.use(cors());

// ----------------------------------------------HTML loading -----------------------------------------------------------------
//index page
app.get('/', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, './html/index.html'))
});

//emp home page
app.get('/emphome', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, './html/empHome.html'))
});

//manager home page
app.get('/manager', (req,res) => { 
    res.status(200).sendFile(path.resolve(__dirname, './html/manHome.html'))
});


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
});

//Manager add a new employee
app.post('/manager/addEmp', (req, res) => { 
    const { name } = req.body; 

    const result = addEmp(client, 
        {
            name: name,
            title: "Employee"
        })

    if(result) { 
        res.status(200).send(`Employee ${name} successfully added!`)
    } else { 
        res.status(500).send('Error.')
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
});



//manager view all pending requests
app.get('/pending', (req, res) => {
    const results = viewPending(client).then((results)=>{
        if(results.length > 0) { 
            res.status(200).send(results)
        } else { 
            res.status(500).send('YIKES!')
        }
    })
});

//manager view all resolved requests
app.get('/resolved', (req, res) => { 
    const results = viewResolved(client).then((results) => { 
        if (results.length > 0) { 
            res.status(200).send(results)
        } else { 
            res.status(500).send('yikeroni')
        }
    })
});

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
});

//Log in
app.get('/employeeList', (req, res) => { 
    const results = viewAllEmps(client).then((results)=>{
        if (results.length > 0) { 
            res.status(200).send(results)
        } else { 
            res.status(500).send('yikes')
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
});

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
});

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
});

//delete all reimbursements
app.get('/clear', (req,res) => {
    const results = clearDB(client).then((results) =>{
        if (results) {
            res.status(200).send('database cleared')
        } else {
            res.status(500).send('oh yikes')
        }
    })
});

//404 handling
app.get('*', (req,res) => { 
    res.status(200).sendFile(path.resolve(__dirname, './html/404.html'))
});

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
