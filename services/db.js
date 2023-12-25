require('dotenv').config();

const con = require('mysql2').createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}).promise();

con.connect()
    .then(() => console.log('Connected to database'))
    .catch(() => console.error('Error connecting to DB: ' + err));

function Track(id, name, fileName, tags) {
    this.id = id;
    this.name = name;
    this.fileName = fileName;
    this.tags = tags;
}

function resultToTrack(result) {
    return new Promise(function(resolve, reject) {
        let id = result.trackId;
        getTrackTags(id)
            .then(function(tags) {
                resolve(new Track(
                    id,
                    result.name,
                    result.fileName,
                    tags
                ));
            })
            .catch(function(error) {
                reject(error);
            });
    });
}

function getTrackTags(trackId) {
    return new Promise(function(resolve, reject) {
        con.query('SELECT Tags.name \
            FROM Tags JOIN TrackTags ON Tags.tagId = TrackTags.tagId \
            WHERE TrackTags.trackId = ?', [trackId])
            .then(function(results) {
                resolve(results[0].map((res) => res.name));
            })
            .catch(function(error) {
                reject(error);
            });
    });
}

getTracks = function() {
    return new Promise(function(resolve, reject) {
        con.query('SELECT * FROM Tracks')
            .then(function(results) {
                let trackPromises = results[0].map(resultToTrack);
                Promise.all(trackPromises)
                    .then(function(tracks) {
                        resolve(tracks);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            })
            .catch(function(error) {
                reject(error);
            });
    });
}

getTracks()
    .then(function(tracks) {
        console.log(tracks);
    });

module.exports = {
    getTracks
};
