if (!window.jQuery)
    throw new Error("jQuery is not loaded");

const audioCache = {};

function getAudio(trackId) {
    return new Promise(function(resolve, reject) {
        if (audioCache[trackId]) {
            resolve(audioCache[trackId]);
        } else {
            $.getJSON(`/api/track/${trackId}`)
                .then(function(track) {
                    let audio = new Audio(`/mp3/${track.fileName}`);
                    audio.loop = true;
                    audio.autoplay = true;
                    audioCache[trackId] = audio;
                    resolve(audio);
                })
                .catch(function(error) {
                    reject(error);
                });
        }
    });
}

const audioManager = {
    playing: false,
    init: function() {
        this.audio = new Audio();
        this.audio.addEventListener('ended', function() {
            AudioManager.playing = false;
            AudioManager.currentTrack = null;
        });
    },
    play: async function(trackId) {
        let audio = await getAudio(trackId);
    },
};

$(function() {
    $('.track').click(function() {
        let id = $(this).data("id");
        audioManager.play(id);
    });
});
