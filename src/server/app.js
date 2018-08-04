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

app.get('/file', function (req, res) {
    fs.readFile(req.query.f, function (err, data) {
        if (err) {
            console.log(err)
            res.writeHead(500)
            res.end('failed')
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.write(JSON.stringify(data))
            res.end()
        }
    })
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

app.get('/readfile', function (req, res) {
    var Converter = require("csvtojson").Converter
    var converter = new Converter({
        noheader: false
    })

    fs.readFile(req.query.f, function (err, data) {
        if (err) {
            console.log(err)
            res.writeHead(500)
            res.end('failed')
        } else {
            var jsonStr = data.toString()
            converter.fromString(jsonStr, function (csv_err, result) {
                if (csv_err) {
                    console.log('Convert error occurred')
                    console.log(csv_err)
                    res.writeHead(500, { 'Content-Type': 'text/plain' })
                    res.end('convert failed')
                }

                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.write(JSON.stringify(result))
                res.end()
            })
        }
    })
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
