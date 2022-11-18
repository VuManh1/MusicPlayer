const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const heading = $('header h2');

const cdThumb = $('.cd-thumb');
const cdThumbAnimate = cdThumb.animate([
    { transform: 'rotate(360deg)'}
], {
    duration: 10000, // 10 seconds
    iterations: Infinity
});
cdThumbAnimate.pause();

const audio = $('#audio');

const playBtn = $('.btn-toggle-play');

const progressBar = $('#progress');
var isHover = false;

const searchBtn = $('.search');
const searchBar = $('.search-bar');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    songs: [
        {
            name: "Gravity Falls Opening",
            singer: "Brad Breeck",
            path: "./assets/music/GravityFallsOpening.mp3",
            image: "./assets/img/GravityFallsSong.jpg"
        },
        {
            name: "2 Phút Hơn",
            singer: "Pháo",
            path: "./assets/music/2PhútHơn.mp3",
            image: "./assets/img/2PhutHonSong.jpg"
        },
        {
            name: "TheFatRat Envelope DOTA 2",
            singer: "TheFatRat",
            path: "./assets/music/TheFatRat_EnvelopeDOTA2.mp3",
            image: "./assets/img/EnvelopeSong.jpg"
        },
        {
            name: "Close To The Sun",
            singer: "TheFatRat",
            path: "./assets/music/CloseToTheSun.mp3",
            image: "./assets/img/CloseToTheSun.jpg"
        }, 
        {
            name: "Umbrella",
            singer: "Ember Island",
            path: "./assets/music/UmbrellaEmberIsland.mp3",
            image: "./assets/img/UmbrellaSong.jpg"
        },   
        {
            name: "I Really Want To Stay At Your House",
            singer: "Rosa Walton",
            path: "./assets/music/IReallyWantToStayAtYourHouse.mp3",
            image: "./assets/img/IReallyWantToStayAtYourHouseSong.jpg"
        },   
    ],
    renderSongs: function() {
        let playlist = $('.playlist');

        this.songs.forEach((song, index) => {
            let songHtml = document.createElement('div');
            songHtml.classList.add('song');
            songHtml.setAttribute('data-index', index);
            if(index == 0) songHtml.classList.add('active');

            songHtml.innerHTML = `
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>`;
    
            playlist.appendChild(songHtml);

            // songHtml.onclick = function() {
            //     if(app.currentIndex === index) return;

            //     app.currentIndex = index;
            //     app.loadCurrentSong();
            //     audio.play();
            // }
        });        
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function() {
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;

        // cd width change when scroll
        document.onscroll = function() {
            const scrollY = window.scrollY || document.documentElement.scrollTop; 

            const newCdWidth = cdWidth - scrollY;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // search event :
        searchBar.oninput = function() {
            app.search(searchBar.value);
        }

        // Button click event :
        searchBtn.onclick = function() {
            searchBar.classList.toggle('active');
        }
        playBtn.onclick = function() {
            app.isPlaying ? audio.pause() : audio.play();
        }
        document.querySelector('.btn-repeat').onclick = function() {
            app.isRepeat = !app.isRepeat;
            this.classList.toggle('active', app.isRepeat);
        }
        document.querySelector('.btn-prev').onclick = function() {
            app.currentIndex --;
            if(app.currentIndex < 0) app.currentIndex = app.songs.length - 1;
            app.loadCurrentSong();
            audio.play();
        }
        document.querySelector('.btn-next').onclick = function() {
            app.currentIndex ++;
            if(app.currentIndex >= app.songs.length) app.currentIndex = 0;
            app.loadCurrentSong();
            audio.play();
        }
        document.querySelector('.btn-random').onclick = function() {
            this.classList.toggle('active');
        }

        // click playlist to change song :
        let playlist = $('.playlist');
        playlist.onclick = function(e) {
            let songNode = e.target.closest('.song:not(.active)');
            
            if(songNode && !e.target.closest('.option')) {
                app.currentIndex = songNode.getAttribute('data-index');
                app.loadCurrentSong();
                audio.play();
            } else if(e.target.closest('.option')) {
                console.log('...');
            }
        }

        // video playing event :
        audio.ontimeupdate = function() {
            if(!isHover && audio.duration) progressBar.value = audio.currentTime / audio.duration * 100;
        }
        audio.onended = function() {
            if(app.isRepeat) {
                cdThumbAnimate.cancel();
                audio.play();
            } else {
                document.querySelector('.btn-next').click();
            }
        }
        audio.onplay = function() {
            app.isPlaying = true;  
            player.classList.add('playing');    
            cdThumbAnimate.play();         
        }
        audio.onpause = function() {
            app.isPlaying = false;  
            player.classList.remove('playing');  
            cdThumbAnimate.pause();         
        }

        progressBar.onchange = function() {
            isHover = false;
            audio.currentTime = progressBar.value / 100 * audio.duration;
        }
        progressBar.oninput = () => { isHover = true; }
    },
    scrollToActiveSong: function() {
      setTimeout(() => {
        $('.song.active').scrollIntoView({
            behaviour: 'smooth',
            block: 'center'
        });
      }, 200);  
    },
    search: function(songName) {
        if(songName === " " || !songName) return;
        
        let length = app.songs.length;
        for(let i = 0; i < length; i++)
        {
            if(app.songs[i].name.indexOf(songName) != -1) {
                let foundSong = $$('.song')[i];
                setTimeout(() => {
                    foundSong.scrollIntoView({
                        behaviour: 'smooth',
                        block: 'center'
                    });

                }, 100);    

                foundSong.classList.add('highlight');
                setTimeout(() => {
                    foundSong.classList.remove('highlight');
                }, 2000);

                break;
            }
        }
    },
    loadCurrentSong: function() {
        audio.src = this.currentSong.path;
        heading.innerText = this.currentSong.name;
        cdThumb.style = `background-image: url('${this.currentSong.image}'`;
        
        $('.song.active').classList.remove('active');
        $$('.song')[this.currentIndex].classList.add('active');
        this.scrollToActiveSong();
        cdThumbAnimate.cancel();
    },
    start: function() {
        this.renderSongs();
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
    }
}

app.start();