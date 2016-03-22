"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var commands = require('./commands');

var app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/send', function (req, res, next) {
    if (!req.query.token) {
        res.status(400).json({
            'status': 400,
            'error': 'token parameter missing'
        });
        return;
    }
    if (!req.query.command) {
        res.status(400).json({
            'status': 400,
            'error': 'command parameter missing'
        });
        return;
    }
    commands.set(req.query.token, req.query.command);
    res.json({
        'token': req.query.token,
        'command': req.query.command
    });
});

app.get('/poll', function (req, res, next) {
    if (!req.query.token) {
        res.status(400).json({
            'status': 400,
            'error': 'token parameter missing'
        });
        return;
    }
    commands.poll(req.query.token, function (value) {
        res.json({'command': value});
    });
});

app.use(function (req, res, next) {
    var err = new Error('not found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    err.status = err.status || 500;
    res.status(err.status).json({
        'status': err.status,
        'error': err.message
    });
});


module.exports = app;
