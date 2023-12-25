const express = require('express');
const router = express.Router();
const db = require('../../services/db');

router.get('/track/:id', function(req, res, next) {
    db.getTrack(req.params.id)
        .then(function(track) {
            res.json(track);
        })
        .catch(function(error) {
            res.status(500).json({ error: error });
        });
});

module.exports = router;
