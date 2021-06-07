//imports
const express = require('express')
const app = express()
const { readFileSync } = require('fs')
const http = require('http')


//get html
const empHomepage = readFileSync('./html/empHome.html')
const manHomepage = readFileSync('./html/manHome.html')
const pending = readFileSync('./html/pending.html')
const resolved = readFileSync('./html/resolved.html')
const emprequest = readFileSync('./html/empRequest.html')
const employees=  readFileSync('./html/employees.html')


const server = http.createServer((req,res) => {
    const url = req.url
    const id = req.params; 

    //Employee home page
    if (url === '/') { 
        res.writeHead(200, {'content-type':'text/html'})
        res.write(empHomepage)
        res.end()
    } 

    //Manager home page 
    else if (url === '/manager') { 
        res.writeHead(200, {'content-type':'text/html'})
        res.write(manHomepage)
        res.end()
    }

    //All Pending Requests
    else if (url === '/pending') { 
        res.writeHead(200, {'content-type':'text/html'})
        res.write(pending)
        res.end()
    } 

    //All Resolved Requests
    else if (url === '/resolved') { 
        res.writeHead(200, {'content-type':'text/html'})
        res.write(resolved)
        res.end()
    }

    //View all employees
    else if (url === '/employees') { 
        res.writeHead(200, {'content-type':'text/html'})
        res.write(employees)
        res.end()
    }

    //Requests by employee id
    else if (url === `/requests/${id}`) {
        
        // const ingleID = requests.find(request => {XMLHttpRequestEventTarget.id === 1});
        res.writeHead(200, {'content-type':'text/html'})
        res.write(emprequest)
        res.end()
    }

    //404
    else { 
        res.writeHead(404, {'content-type':'text/html'})
        res.write('<h1>Page Not Found</h1>')
        res.end()
    }
})

// app.get('/', (req,res) => {
//     res.writeHead(200, {'content-type':'text/html'})
//     res.write(empHomepage)
//     res.end()
// })

// app.get ('/manager', (req,res) => { 
//     res.writeHead(200, {'content-type':'text/html'})
//     res.write(manHomepage)
//     res.end()
// })

// app.get('/pending', (req,res) => { 
//     res.writeHead(200, {'content-type':'text/html'})
//     res.write(pending)
//     res.end()
// })

// app.get('/resolved', (req,res) => { 
//     res.writeHead(200, {'content-type':'text/html'})
//     res.write(resolved)
//     res.end()
// })

// app.get ('/requests/:id', (req,res) => { 
//     res.writeHead(200, {'content-type':'text/html'})
//     res.write(emprequest)
//     res.end()
// })

// app.get ('/employees', (req,res) => { 
//     res.writeHead(200, {'content-type':'text/html'})
//     res.write(employees)
//     res.end()
// })

server.listen(5000, () => {
    console.log('Server is listening on port 5000...')
})