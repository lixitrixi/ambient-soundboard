const express = require('express');
const router = express.Router();
const db = require('../services/db');

/* GET home page. */
router.get('/', function(req, res, next) {
    db.getTracks()
        .then(function(tracks) {
            res.render('index', { title: 'StAmbience', tracks: tracks });
        })
        .catch(function(error) {
            res.render('error', { message: 'Error', error: error });
        });
});

module.exports = router;
