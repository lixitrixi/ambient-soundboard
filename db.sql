
CREATE TABLE IF NOT EXISTS Tracks
(
    trackId int NOT NULL AUTO_INCREMENT,
    name VARCHAR(256),
    filePath VARCHAR(256),
    PRIMARY KEY (trackId)
);

CREATE TABLE IF NOT EXISTS Tags
(
    tagId int NOT NULL AUTO_INCREMENT,
    name VARCHAR(256),
    PRIMARY KEY (tagId)
);

CREATE TABLE IF NOT EXISTS TrackTags
(
    trackId int NOT NULL,
    tagId int NOT NULL,
    PRIMARY KEY (trackId, tagId),
    FOREIGN KEY (trackId) REFERENCES Tracks(trackId),
    FOREIGN KEY (tagId) REFERENCES Tags(tagId)
);
