import songsData from "../sounds/songs.js";

const $ = document.querySelector.bind(document);
const $S = document.querySelectorAll.bind(document);

const app = {
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
    handleEvents: function () {
        document.onscroll = function () {
            const cd = $(".cd");
            const cdWidth = cd.offsetWidth;
            document.onscroll = function () {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const newCdWidth = cdWidth - scrollTop;
                cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
                cd.style.opacity = newCdWidth / cdWidth;
            };
        };
    },
    start: function () {
        this.handleEvents();
        this.render();
    },
};

app.start();
