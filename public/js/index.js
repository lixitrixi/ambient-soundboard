if (!window.jQuery) {
    throw new Error("jQuery is not loaded");
}

// Track data and audio objects
const tracks = {};
const trackElements = $("#tracks").children();

class Track {
    constructor(id, name, fileName, tags) {
        this.id = id;
        this.name = name;
        this.fileName = fileName;
        this.tags = tags;
    }
    #audio = null;

    // Lazy getter for audio object
    get audio() {
        if (this.#audio == null)
            this.#audio = new Audio(`/mp3/${this.fileName}`);
            this.#audio.loop = true;
        return this.#audio;
    }

    play(volume) {
        this.audio.volume = volume;
        this.audio.play();
    }

    playing() {
        return (this.#audio)
            ? this.audio.volume > 0
            : false;
    }
}

$(function() {
    // Eagerly load track data and set up event handlers
    trackElements.each(function() {
        const trackId = $(this).data('track-id');
        $.getJSON(`/api/track/${trackId}`)
            .then(function(track) {
                tracks[trackId] = new Track(
                    track.id,
                    track.name,
                    track.fileName,
                    track.tags
                );
            })
            .catch(function(error) {
                console.error(`Error loading track #${trackId}`, error);
            });
        $("input[type='range']", $(this)).on("input", function() {
            const volume = $(this)[0].value / 10;
            tracks[trackId].play(volume);
        });
    });
});



// Tag filtering controls
const tagElements = $("#tags").children();
const clearButton = $("#clear-tags");

function filterTrackElements() {
    const tagIds = tagElements.filter(".active")
        .map((_, e) => $(e).data("tag-id")).get();
    trackElements.each(function() {
        const trackId = $(this).data("track-id");
        const track = tracks[trackId];

        // Inclusive filter, more tags = more tracks
        let show = tagIds.length == 0; // No tags = show all tracks
        for (let id of tagIds) {
            if (track.tags.includes(id)) {
                show = true;
                break;
            }
        }
        show ? $(this).show() : $(this).hide();
    });
    if (tagIds.length > 0) {
        clearButton.show();
    } else {
        clearButton.hide();
    }
}

$(function() {
    tagElements.on("click", function() {
        $(this).toggleClass("active");
        filterTrackElements();
    });

    clearButton.on("click", function() {
        tagElements.removeClass("active");
        filterTrackElements();
        $(this).hide();
    });
    clearButton.hide();
});
