document.addEventListener('DOMContentLoaded', () => {
    const players = [
        {
            id: 'openings-player',
            playlist: [
                { title: 'Guren no Yumiya', src: 'Openings/Attack on Titan - Opening 1 Guren no Yumiya 4K  UHD Creditless  CC.mp3' },
                { title: 'Jiyuu no Tsubasa', src: 'Openings/Attack on Titan - Opening 2 Jiyuu no Tsubasa 4K  UHD Creditless  CC.mp3' },
                { title: 'Shinzou wo Sasageyo!', src: 'Openings/Attack on Titan - Opening 3 Shinzou wo Sasageyo! 4K  UHD Creditless  CC.mp3' },
                { title: 'Red Swan', src: 'Openings/Attack on Titan - Opening 4 Red Swan 4K  UHD Creditless  CC.mp3' },
                { title: 'Shoukei to Shikabane no Michi', src: 'Openings/Attack on Titan - Opening 5 Shoukei to Shikabane no Michi 4K  UHD Creditless  CC.mp3' },
                { title: 'Boku no Sensou', src: 'Openings/Attack on Titan - Opening 6 Boku no Sensou 4K  UHD Creditless  CC.mp3' },
                { title: 'The Rumbling', src: 'Openings/Attack on Titan - Opening 7 The Rumbling 4K  UHD Creditless  CC.mp3' },
                { title: 'Saigo no Kyojin', src: 'Openings/Attack on Titan - Opening 8 Saigo no Kyojin 4K  UHD Creditless  CC.mp3' },
            ],
            audio: new Audio(),
            currentTrack: 0,
            isShuffling: false,
            isRepeating: false,
        },
        {
            id: 'endings-player',
            playlist: [
                { title: 'Utsukushiki Zankoku na Sekai', src: 'Endings/Attack on Titan - Ending 1 Utsukushiki Zankoku na Sekai 4K  UHD Creditless  CC.mp3' },
                { title: 'great escape', src: 'Endings/Attack on Titan - Ending 2 v1 great escape 4K  UHD Creditless  CC.mp3' },
                { title: 'great escape v2', src: 'Endings/Attack on Titan - Ending 2 v2 great escape 4K  UHD Creditless  CC.mp3' },
                { title: 'Yuugure no Tori', src: 'Endings/Attack on Titan - Ending 3 【Yuugure no Tori】 4K _ UHD Creditless _ CC [qe6isMShLgs].mp3' },
                { title: 'Akatsuki no Chinkonka', src: 'Endings/Attack on Titan - Ending 4 - EP49Akatsuki no Chinkonka 4K  UHD Creditless  CC.mp3' },
                { title: 'Name of Love', src: 'Endings/Attack on Titan - Ending 5 Name of Love 4K  UHD Creditless  CC.mp3' },
                { title: 'Shougeki', src: 'Endings/Attack on Titan - Ending 6 Shougeki 4K  UHD Creditless  CC.mp3' },
                { title: 'Akuma no Ko', src: 'Endings/Attack on Titan - Ending 7 Akuma no Ko 4K  UHD Creditless  CC.mp3' },
                { title: 'Itterasshai', src: 'Endings/Attack on Titan - Ending 8 Itterasshai 4K  UHD Creditless  CC.mp3' },
            ],
            audio: new Audio(),
            currentTrack: 0,
            isShuffling: false,
            isRepeating: false,
        },
        {
            id: 'special-theme-player',
            playlist: [
                { title: 'UNDER THE TREE', src: 'Special Theme/Attack on Titan - The Final Season Part 3 - Special Theme UNDER THE TREE 4K  UHD  CC.mp3' },
            ],
            audio: new Audio(),
            currentTrack: 0,
            isShuffling: false,
            isRepeating: false,
        }
    ];

    players.forEach(playerData => {
        const playerElement = document.getElementById(playerData.id);
        const playPauseBtn = playerElement.querySelector('.play-pause-btn');
        const muteBtn = playerElement.querySelector('.mute-btn');
        const progressBar = playerElement.querySelector('.progress');
        const volumeSlider = playerElement.querySelector('.volume-slider');
        const shuffleBtn = playerElement.querySelector('.shuffle-btn');
        const repeatBtn = playerElement.querySelector('.repeat-btn');
        const downloadBtn = playerElement.querySelector('.download-btn');
        const canvas = playerElement.querySelector('.visualizer');
        const canvasCtx = canvas.getContext('2d');

        const playlistContainer = playerElement.parentElement.querySelector('.playlist-container');
        const playlistToggle = playlistContainer.querySelector('.playlist-toggle');
        const playlistElement = playlistContainer.querySelector('.playlist');

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaElementSource(playerData.audio);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function drawVisualizer() {
            requestAnimationFrame(drawVisualizer);
            analyser.getByteFrequencyData(dataArray);
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = 50;
            const barWidth = 2;
            let angle = 0;
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                const xEnd = centerX + (radius + barHeight) * Math.cos(angle);
                const yEnd = centerY + (radius + barHeight) * Math.sin(angle);
                canvasCtx.strokeStyle = `hsl(${i / bufferLength * 360}, 100%, 50%)`;
                canvasCtx.lineWidth = barWidth;
                canvasCtx.beginPath();
                canvasCtx.moveTo(x, y);
                canvasCtx.lineTo(xEnd, yEnd);
                canvasCtx.stroke();
                angle += (Math.PI * 2) / bufferLength;
            }
        }

        function loadTrack(trackIndex) {
            const track = playerData.playlist[trackIndex];
            playerData.audio.src = track.src;
        }

        function playTrack() {
            audioCtx.resume();
            playerData.audio.play();
            playPauseBtn.textContent = 'Pause';
            drawVisualizer();
        }

        function pauseTrack() {
            playerData.audio.pause();
            playPauseBtn.textContent = 'Play';
        }

        function nextTrack() {
            if (playerData.isRepeating) {
                // Replay the same track
            } else if (playerData.isShuffling) {
                playerData.currentTrack = Math.floor(Math.random() * playerData.playlist.length);
            } else {
                playerData.currentTrack = (playerData.currentTrack + 1) % playerData.playlist.length;
            }
            loadTrack(playerData.currentTrack);
            playTrack();
        }

        function populatePlaylist() {
            playlistElement.innerHTML = '';
            playerData.playlist.forEach((track, index) => {
                const li = document.createElement('li');
                li.textContent = track.title;
                li.dataset.index = index;
                playlistElement.appendChild(li);
            });
        }

        playPauseBtn.addEventListener('click', () => {
            if (playerData.audio.paused) {
                playTrack();
            } else {
                pauseTrack();
            }
        });

        muteBtn.addEventListener('click', () => {
            playerData.audio.muted = !playerData.audio.muted;
            muteBtn.textContent = playerData.audio.muted ? 'Unmute' : 'Mute';
        });

        shuffleBtn.addEventListener('click', () => {
            playerData.isShuffling = !playerData.isShuffling;
            shuffleBtn.style.color = playerData.isShuffling ? 'lightgreen' : 'white';
        });

        repeatBtn.addEventListener('click', () => {
            playerData.isRepeating = !playerData.isRepeating;
            repeatBtn.style.color = playerData.isRepeating ? 'lightgreen' : 'white';
        });

        downloadBtn.addEventListener('click', () => {
            const track = playerData.playlist[playerData.currentTrack];
            const link = document.createElement('a');
            link.href = track.src;
            link.download = track.title;
            link.click();
        });

        playlistToggle.addEventListener('click', () => {
            const isHidden = playlistElement.style.display === 'none';
            playlistElement.style.display = isHidden ? 'block' : 'none';
            playlistToggle.textContent = isHidden ? 'Hide Playlist' : 'Show Playlist';
        });

        playlistElement.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') {
                const trackIndex = parseInt(e.target.dataset.index, 10);
                playerData.currentTrack = trackIndex;
                loadTrack(trackIndex);
                playTrack();
            }
        });

        playerData.audio.addEventListener('timeupdate', () => {
            if (playerData.audio.duration) {
                const progressPercent = (playerData.audio.currentTime / playerData.audio.duration) * 100;
                progressBar.style.width = `${progressPercent}%`;
            }
        });

        playerData.audio.addEventListener('ended', nextTrack);

        volumeSlider.addEventListener('input', (e) => {
            playerData.audio.volume = e.target.value;
        });

        loadTrack(playerData.currentTrack);
        populatePlaylist();
    });

    const copyright = document.querySelector('.copyright');
    copyright.textContent = 'All audio files belong to their respective owners. No copyright infringement intended.';
});
