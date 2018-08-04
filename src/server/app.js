var express = require('express')
var fs = require('fs')
var headers = require('./utils/headers')
var app = express()

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

app.get('/', function (req, res) {
    res.send('Hello World!')
})

// Returns an array of JSON objects for a BGAME file
// This data can be used to create a boxscore
app.get('/boxscore', function (req, res) {
    const csv = require("csvtojson")
    csv({
        noheader: true,
        headers: headers.getBGAMEHeaders()
    })
    .fromFile(req.query.f)
    .then((jsonObj) => {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify(jsonObj))
        res.end()
    }, (err) => {
        console.log('read file error occurred')
        console.log(err)
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('read file failed')
    })
})

app.get('/bevent', function (req, res) {
    const csv = require("csvtojson")
    csv({
        noheader: true,
        headers: headers.getBEVENTHeaders()
    })
    .fromFile(req.query.f)
    .then((jsonObj) => {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify(jsonObj))
        res.end()
    }, (err) => {
        console.log('read file error occurred')
        console.log(err)
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('read file failed')
    })
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
