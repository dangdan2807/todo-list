import songsData from "../sounds/songList.js";

const $ = document.querySelector.bind(document);
const $S = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const progress = $("#progress");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: true,
    isRepeat: false,
    songs: songsData,
    render: function () {
        var htmls = this.songs.map((song) => {
            return `
            <div class="song">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        });
        $(".playlist").innerHTML = htmls.join("");
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // handle rotation cd
        const cdThumbAnimate = cdThumb.animate(
            [
                {
                    transform: "rotate(360deg)",
                },
            ],
            {
                duration: 10000, // 10 second
                iterations: Infinity,
            }
        );
        cdThumbAnimate.pause();

        // CD zoom in/out handling
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // handle click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // the song is playing
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };

        // the song on pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // song tempo changes
        audio.ontimeupdate = function () {
            if (this.duration) {
                const progressPercent = Math.floor((this.currentTime / this.duration) * 100);
                progress.value = progressPercent;
            }
        };

        // handle when rewinding songs
        progress.oninput = function (e) {
            const seekTime = (e.target.value * audio.duration) / 100;
            audio.currentTime = seekTime;
        };

        // handle next song button
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            _this.nextSong();
            audio.play();
        };

        // handle prev song button
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            _this.prevSong();
            audio.play();
        };

        // handle random song on/off button
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            this.classList.toggle("active", _this.isRandom);
        };

        // handle on/off song repeat button
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle("active", _this.isRepeat);
        };
    },
    loadCurrentSong: function () {
        heading.innerHTML = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex <= 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex = 0;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
    },
    // repeatSong: function () {
    //     this.currentIndex--;
    //     if (this.currentIndex <= 0) {
    //         this.currentIndex = this.songs.length - 1;
    //     }
    //     this.loadCurrentSong();
    // },
    start: function () {
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
    },
};

app.start();
