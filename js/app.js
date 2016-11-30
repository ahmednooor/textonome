// -- textonome
// -- CAUTION -- Read the following code on your own risk!

window.onload = function () {
    var playlist = document.getElementsByClassName('playlist')[0],
        tracks = playlist.getElementsByTagName('a'),
        audioPlayer = document.getElementById('audioPlayer'),
        currentTitle = document.getElementById('currentTitle'),
        trackDuration,
        trackIndex = 0,
        playPauseBtn = document.getElementById('playPauseBtn'),
        frwrdBtn = document.getElementById('frwrdBtn'),
        rvrseBtn = document.getElementById('rvrseBtn'),
        volPlusBtn = document.getElementById('volPlusBtn'),
        volMinusBtn = document.getElementById('volMinusBtn'),
        volIndicator = document.getElementById('volIndicator'),
        currentDuration = document.getElementById('currentDuration'),
        totalDuration = document.getElementById('totalDuration'),
        trackProgressBar = document.getElementById('trackProgressBar');


    function sortTracks(tracksArray, container) {
        var trackTitles = [],
            dataTitle,
            l,
            k,
            m;
        for (l = 0; l < tracksArray.length; l += 1) {
            trackTitles[l] = tracksArray[l].getAttribute('data-title');
            trackTitles[l] = trackTitles[l].toUpperCase();
        }
        trackTitles.sort();
        for (k = 0; k < tracksArray.length; k += 1) {
            for (m = 0; m < tracksArray.length; m += 1) {
                dataTitle = tracksArray[m].getAttribute('data-title');
                dataTitle = dataTitle.toUpperCase();
                if (trackTitles[k] == dataTitle) {
                    container.appendChild(tracksArray[m]);
                }
            }
        }
    }
    sortTracks(tracks, playlist);


    function trackTitleSetter(tracksArray) {
        var inTracks,
            tracksTitle,
            i;
        for (i = 0; i < tracksArray.length; i += 1) {
            inTracks = tracksArray[i];
            tracksTitle = inTracks.getAttribute('data-title');
            inTracks.innerHTML = '- ' + tracksTitle;
        }
    }
    trackTitleSetter(tracks);


    function setTimeRange(player) {
        player.onloadeddata = function () {
            var totalDurHour = Math.floor(Math.floor(player.duration) / 3600),
                totalDurMin = Math.floor(Math.floor(player.duration / 60) % 60),
                totalDurSec = Math.floor(player.duration) % 60;
            trackDuration = player.duration * 1000;
            trackProgressBar.max = trackDuration.toFixed(0);
            trackProgressBar.value = 0;
            totalDuration.innerHTML = (totalDurHour < 10 ? '0' + totalDurHour : totalDurHour)
                + ':' + (totalDurMin < 10 ? '0' + totalDurMin : totalDurMin)
                + ':' + (totalDurSec < 10 ? '0' + totalDurSec : totalDurSec);
            currentDuration.innerHTML = '00:00:00';
        };
    }
    
    function setCurrentDurationText(elemDotMethod, divider) {
        var currentDurHour = Math.floor(Math.floor(elemDotMethod / divider) / 3600),
            currentDurMin = Math.floor(Math.floor((elemDotMethod / divider) / 60) % 60),
            currentDurSec = Math.floor(elemDotMethod / divider) % 60;
        currentDuration.innerHTML = (currentDurHour < 10 ? '0' + currentDurHour : currentDurHour)
            + ':' + (currentDurMin < 10 ? '0' + currentDurMin : currentDurMin)
            + ':' + (currentDurSec < 10 ? '0' + currentDurSec : currentDurSec);
    }

    function setActiveTrackClass(tracksArray, activeTrack) {
        var n;
        for (n = 0; n < tracksArray.length; n += 1) {
            tracksArray[n].classList.remove('activeTrack');
        }
        activeTrack.classList.add('activeTrack');
    }

    function clickToPlaySetter(tracksArray, player) {
        var currentTrack,
            currentTrackSource,
            currentTrackTitle,
            j;
        for (j = 0; j < tracksArray.length; j += 1) {
            currentTrack = tracks[j];
            tracks[j].index = j;
            currentTrack.onclick = function (e) {
                e.preventDefault();
                currentTrackSource = this.getAttribute('href');
                currentTrackTitle = this.getAttribute('data-title');
                player.setAttribute('src', currentTrackSource);
                currentTitle.innerHTML = currentTrackTitle;
                trackIndex = this.index;
                playPauseBtn.innerHTML = '[PAUSE]';
                setTimeRange(player);
                volIndicator.innerHTML = Math.round(audioPlayer.volume * 100) + '%';
                player.oncanplay = player.play();
                setActiveTrackClass(tracks, this);
            };
        }
    }
    clickToPlaySetter(tracks, audioPlayer);

    function playNext() {
        if (playPauseBtn.innerHTML == '[PAUSE]') {
            if (trackIndex < (tracks.length - 1)) {
                trackIndex += 1;
                audioPlayer.setAttribute('src', tracks[trackIndex].getAttribute('href'));
                currentTitle.innerHTML = tracks[trackIndex].getAttribute('data-title');
                setTimeRange(audioPlayer);
                if (playPauseBtn.innerHTML == '[PAUSE]') {
                    audioPlayer.oncanplay = audioPlayer.play();
                }
                setActiveTrackClass(tracks, tracks[trackIndex]);
            } else {
                trackIndex = 0;
                audioPlayer.setAttribute('src', tracks[trackIndex].getAttribute('href'));
                currentTitle.innerHTML = tracks[trackIndex].getAttribute('data-title');
                setTimeRange(audioPlayer);
                if (playPauseBtn.innerHTML == '[PAUSE]') {
                    audioPlayer.oncanplay = audioPlayer.play();
                }
                setActiveTrackClass(tracks, tracks[trackIndex]);
            }
        }
    }
    audioPlayer.onended = playNext;

    function updateTimeAndBar() {
        trackProgressBar.value = audioPlayer.currentTime * 1000;
        setCurrentDurationText(audioPlayer.currentTime, 1);
    }
    audioPlayer.ontimeupdate = updateTimeAndBar;

    playPauseBtn.onclick = function () {
        if (audioPlayer.currentSrc != "") {
            if (audioPlayer.paused) {
                audioPlayer.oncanplay = audioPlayer.play();
                playPauseBtn.innerHTML = '[PAUSE]';
            } else {
                audioPlayer.pause();
                playPauseBtn.innerHTML = '[PLAY]';
            }
        }
    };

    frwrdBtn.onclick = function () {
        audioPlayer.currentTime += 5;
        updateTimeAndBar();
    };

    rvrseBtn.onclick = function () {
        audioPlayer.currentTime -= 5;
        updateTimeAndBar();
    };

    volPlusBtn.onclick = function () {
        if (audioPlayer.volume < 1.0) {
            audioPlayer.volume += 0.05;
            audioPlayer.volume = Number((audioPlayer.volume).toFixed(2));
            volIndicator.innerHTML = Math.round(audioPlayer.volume * 100) + '%';
        }
    };

    volMinusBtn.onclick = function () {
        if (audioPlayer.volume > 0.0) {
            audioPlayer.volume -= 0.05;
            audioPlayer.volume = Number((audioPlayer.volume).toFixed(2));
            volIndicator.innerHTML = Math.round(audioPlayer.volume * 100) + '%';
        }
    };

    trackProgressBar.oninput = function () {
        audioPlayer.currentTime = trackProgressBar.value / 1000;
        setCurrentDurationText(trackProgressBar.value, 1000);
    };

    trackProgressBar.onmousedown = function () {
        audioPlayer.ontimeupdate = null;
        audioPlayer.onended = function () {
            audioPlayer.pause();
            playPauseBtn.innerHTML = '[PLAY]';
        };
    };

    trackProgressBar.onmouseup = function () {
        audioPlayer.ontimeupdate = updateTimeAndBar;
        audioPlayer.onended = playNext;
    };
};
