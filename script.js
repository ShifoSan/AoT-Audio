document.addEventListener('DOMContentLoaded', () => {
    const playlists = {
        openings: [
            { title: 'Guren no Yumiya', artist: 'Linked Horizon', src: 'Openings/Attack on Titan - Opening 1 Guren no Yumiya 4K  UHD Creditless  CC.mp3' },
            { title: 'Jiyuu no Tsubasa', artist: 'Linked Horizon', src: 'Openings/Attack on Titan - Opening 2 Jiyuu no Tsubasa 4K  UHD Creditless  CC.mp3' },
            { title: 'Shinzou wo Sasageyo!', artist: 'Linked Horizon', src: 'Openings/Attack on Titan - Opening 3 Shinzou wo Sasageyo! 4K  UHD Creditless  CC.mp3' },
            { title: 'Red Swan', artist: 'Yoshiki ft. Hyde', src: 'Openings/Attack on Titan - Opening 4 Red Swan 4K  UHD Creditless  CC.mp3' },
            { title: 'Shoukei to Shikabane no Michi', artist: 'Linked Horizon', src: 'Openings/Attack on Titan - Opening 5 Shoukei to Shikabane no Michi 4K  UHD Creditless  CC.mp3' },
            { title: 'Boku no Sensou', artist: 'Shinsei Kamattechan', src: 'Openings/Attack on Titan - Opening 6 Boku no Sensou 4K  UHD Creditless  CC.mp3' },
            { title: 'The Rumbling', artist: 'SiM', src: 'Openings/Attack on Titan - Opening 7 The Rumbling 4K  UHD Creditless  CC.mp3' },
            { title: 'Saigo no Kyojin', artist: 'Linked Horizon', src: 'Openings/Attack on Titan - Opening 8 Saigo no Kyojin 4K  UHD Creditless  CC.mp3' },
        ],
        endings: [
            { title: 'Utsukushiki Zankoku na Sekai', artist: 'Yoko Hikasa', src: 'Endings/Attack on Titan - Ending 1 Utsukushiki Zankoku na Sekai 4K  UHD Creditless  CC.mp3' },
            { title: 'great escape', artist: 'Cinema Staff', src: 'Endings/Attack on Titan - Ending 2 v1 great escape 4K  UHD Creditless  CC.mp3' },
            { title: 'great escape v2', artist: 'Cinema Staff', src: 'Endings/Attack on Titan - Ending 2 v2 great escape 4K  UHD Creditless  CC.mp3' },
            { title: 'Yuugure no Tori', artist: 'Shinsei Kamattechan', src: 'Endings/Attack on Titan - Ending 3 【Yuugure no Tori】 4K _ UHD Creditless _ CC [qe6isMShLgs].mp3' },
            { title: 'Akatsuki no Chinkonka', artist: 'Linked Horizon', src: 'Endings/Attack on Titan - Ending 4 - EP49Akatsuki no Chinkonka 4K  UHD Creditless  CC.mp3' },
            { title: 'Name of Love', artist: 'Cinema Staff', src: 'Endings/Attack on Titan - Ending 5 Name of Love 4K  UHD Creditless  CC.mp3' },
            { title: 'Shougeki', artist: 'Yuko Ando', src: 'Endings/Attack on Titan - Ending 6 Shougeki 4K  UHD Creditless  CC.mp3' },
            { title: 'Akuma no Ko', artist: 'Ai Higuchi', src: 'Endings/Attack on Titan - Ending 7 Akuma no Ko 4K  UHD Creditless  CC.mp3' },
            { title: 'Itterasshai', artist: 'Ai Higuchi', src: 'Endings/Attack on Titan - Ending 8 Itterasshai 4K  UHD Creditless  CC.mp3' },
        ],
        'special-theme': [
            { title: 'UNDER THE TREE', artist: 'SiM', src: 'Special Theme/Attack on Titan - The Final Season Part 3 - Special Theme UNDER THE TREE 4K  UHD  CC.mp3' },
        ]
    };

    const player = {
        audio: new Audio(),
        currentPlaylist: 'openings',
        currentTrack: 0,
        isPlaying: false,
    };

    const playPauseBtn = document.querySelector('.play-pause-btn');
    const muteBtn = document.querySelector('.mute-btn');
    const volumeBtn = document.querySelector('.volume-btn');
    const downloadBtn = document.querySelector('.download-btn');
    const infoBtn = document.querySelector('.info-btn');
    const playlistMenuBtn = document.querySelector('.playlist-menu-btn');
    const progressRing = document.querySelector('.progress-ring__fg');

    const volumeModal = document.getElementById('volume-modal');
    const creditsModal = document.getElementById('credits-modal');
    const playlistModal = document.getElementById('playlist-modal');
    const volumeSlider = document.querySelector('.volume-slider');

    const perimeter = progressRing.getTotalLength();
    progressRing.style.strokeDasharray = perimeter;
    progressRing.style.strokeDashoffset = perimeter;

    function loadTrack(playlistName, trackIndex) {
        const playlist = playlists[playlistName];
        if (!playlist || trackIndex < 0 || trackIndex >= playlist.length) return;

        player.currentPlaylist = playlistName;
        player.currentTrack = trackIndex;
        const track = playlist[trackIndex];
        player.audio.src = track.src;
        updateCredits(track.title, track.artist);
    }

    function playTrack() {
        player.audio.play();
        player.isPlaying = true;
        playPauseBtn.innerHTML = '&#10074;&#10074;'; // Pause icon
    }

    function pauseTrack() {
        player.audio.pause();
        player.isPlaying = false;
        playPauseBtn.innerHTML = '&#9658;'; // Play icon
    }

    function nextTrack() {
        const playlist = playlists[player.currentPlaylist];
        player.currentTrack = (player.currentTrack + 1) % playlist.length;
        loadTrack(player.currentPlaylist, player.currentTrack);
        playTrack();
    }

    function updateProgress() {
        const progress = player.audio.currentTime / player.audio.duration;
        const offset = perimeter - (progress * perimeter);
        progressRing.style.strokeDashoffset = offset;
    }

    function updateCredits(title, artist) {
        creditsModal.querySelector('.track-title').textContent = title;
        creditsModal.querySelector('.track-artist').textContent = artist;
    }

    function toggleModal(modal) {
        const isVisible = modal.style.display === 'block';
        modal.style.display = isVisible ? 'none' : 'block';
    }

    playPauseBtn.addEventListener('click', () => {
        if (player.isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    });

    muteBtn.addEventListener('click', () => {
        player.audio.muted = !player.audio.muted;
        muteBtn.style.opacity = player.audio.muted ? 0.5 : 1;
    });

    volumeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleModal(volumeModal);
        const rect = volumeBtn.getBoundingClientRect();
        volumeModal.style.left = `${rect.left + (rect.width / 2) - (volumeModal.offsetWidth / 2)}px`;
        volumeModal.style.top = `${rect.top - volumeModal.offsetHeight - 10}px`;
    });

    infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleModal(creditsModal);
        const rect = infoBtn.getBoundingClientRect();
        creditsModal.style.left = `${rect.left + (rect.width / 2) - (creditsModal.offsetWidth / 2)}px`;
        creditsModal.style.top = `${rect.top - creditsModal.offsetHeight - 10}px`;
    });

    playlistMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleModal(playlistModal);
        const rect = playlistMenuBtn.getBoundingClientRect();
        playlistModal.style.left = `${rect.left + (rect.width / 2) - (playlistModal.offsetWidth / 2)}px`;
        playlistModal.style.top = `${rect.top - playlistModal.offsetHeight - 10}px`;
    });

    playlistModal.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const newPlaylist = e.target.dataset.playlist;
            loadTrack(newPlaylist, 0);
            playTrack();
            toggleModal(playlistModal);
        }
    });

    downloadBtn.addEventListener('click', () => {
        const track = playlists[player.currentPlaylist][player.currentTrack];
        const link = document.createElement('a');
        link.href = track.src;
        link.download = track.title;
        link.click();
    });

    volumeSlider.addEventListener('input', (e) => {
        player.audio.volume = e.target.value;
    });

    player.audio.addEventListener('timeupdate', updateProgress);
    player.audio.addEventListener('ended', nextTrack);

    // Hide modals if clicked outside
    document.addEventListener('click', (e) => {
        if (!volumeModal.contains(e.target) && e.target !== volumeBtn) {
            volumeModal.style.display = 'none';
        }
        if (!creditsModal.contains(e.target) && e.target !== infoBtn) {
            creditsModal.style.display = 'none';
        }
        if (!playlistModal.contains(e.target) && e.target !== playlistMenuBtn) {
            playlistModal.style.display = 'none';
        }
    });

    loadTrack(player.currentPlaylist, player.currentTrack);
    const copyright = document.querySelector('.copyright');
    copyright.textContent = 'All audio files belong to their respective owners. No copyright infringement intended.';
});
