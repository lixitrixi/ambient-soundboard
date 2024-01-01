const express = require('express');
const router = express.Router();
const db = require('../services/db');

/* GET home page. */
router.get('/', function(req, res, next) {
    var tracks;
    db.getTracks()
        .then(function(ts) {
            tracks = ts;
            return db.getTags();
        })
        .then(function(tags) {
            console.log(tags);
            res.render('index', { tracks, tags });
        })
        .catch(function(error) {
            res.render('error', { message: 'Error', error: error });
        });
});

module.exports = router;
