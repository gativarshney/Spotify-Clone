console.log("JavaScript Code!");

// Global Variable to track global state 
let currentSong = new Audio();
let songs;
let currFolder;

function formatSongDuration(seconds) {
    seconds = Math.max(0, Math.floor(seconds));
    if(isNaN(seconds) || seconds<0){
        return "00:00"
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    // Format with leading zeros if needed
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    // Return the formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    currFolder = folder;
    
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for(let i=0; i<as.length; i++){
        const element = as[i];
        if(element.href.includes(".mp3")){
            const element = as[i].href.split(`${folder}`)[1].split(".mp3")[0].replaceAll("_", " ");
            songs.push(element)
        }
    }
    // Show all the songs in the Library
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                <img class="invert" src="images/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("_", " ")}</div>
                    <div>Gati</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="images/play.svg" alt="">
                </div> 
            </li>`;
    }

    // Attach an event listener to each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        })
    });
    return songs;
}

const playMusic = (track, pause=false)=>{
    let formattedTrack = track.replaceAll(" ", "_")
    let encodedTrack = encodeURIComponent(formattedTrack + ".mp3");     // To handle spaces and special characters 
    // let audio = new Audio("/songs/" + encodedTrack)
    // audio.play()

    currentSong.src = `/${currFolder}/` + encodedTrack;
    
    if(!pause){
        currentSong.play()
        play.src = "/images/pause.svg"
    }
    else{
        currentSong.pause()
        play.src = "/images/play.svg"
    }

    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00" 
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")


    let array = Array.from(anchors)
    for (let i = 0; i < array.length; i++) {
        const e = array[i];
        
        if(e.href.includes("/songs/")){
            let folder = e.href.split("/songs/")[1].replaceAll("/", "")

            // Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `
                    <div data-folder="${folder}" class="card">
                                <div class="play">
                                    <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512">
                                        <circle fill="#01A437" cx="256" cy="256" r="256"/>
                                        <path fill="#42C76E" d="M256 9.28c136.12 0 246.46 110.35 246.46 246.46 0 3.22-.08 6.42-.21 9.62C497.2 133.7 388.89 28.51 256 28.51S14.8 133.7 9.75 265.36c-.13-3.2-.21-6.4-.21-9.62C9.54 119.63 119.88 9.28 256 9.28z"/>
                                        <path fill="#000" d="M351.74 275.46c17.09-11.03 17.04-23.32 0-33.09l-133.52-97.7c-13.92-8.73-28.44-3.6-28.05 14.57l.54 191.94c1.2 19.71 12.44 25.12 29.04 16l131.99-91.72z"/>
                                    </svg>
                                </div>
                                <img src="/songs/${folder}/cover.jpg" alt="image">
                                <h2>${response.title}</h2>
                                <p>${response.description}</p>
                            </div>`
        }
    }

    // Load the Playlist whenever the card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",  async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}/`);
        })
    })
}

async function main(){

    // Display all the Albums on the Page
    displayAlbums()

    // List of all songs
    await getSongs("songs/Bollywood_Song/");
    playMusic(songs[0].replaceAll("_", " "), true);

    // Attach an Event Listener to play, next and previous

    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "/images/pause.svg"
        }
        else{
            currentSong.pause();
            play.src = "/images/play.svg"
        }
    })

    // Listen for Time Update Event
    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${formatSongDuration(currentSong.currentTime)} / ${formatSongDuration(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an Event Listener to Seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100    // in --> %
        
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration) * percent/100;
        
        // target --> Seekbar &  getBoundingClientRect() --> gives info about size and position of an element
    })

    // Add an Event Listener for Hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
    })

    // Event Listener for Close Button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an Event Listener at previous
    previous.addEventListener("click", ()=>{
        console.log("Previous is clicked!");
        let currentMusic = currentSong.src.split("/songs/")[1].split(".mp3")[0].replaceAll("_", " ");
        let index = songs.indexOf(currentMusic);

        if((index-1) >= 0){
            playMusic(songs[index-1]);
        }
    })
    // Add an Event Listener at next
    next.addEventListener("click", ()=>{
        console.log("Next is clicked!");

        let currentMusic = currentSong.src.split("/songs/")[1].split(".mp3")[0].replaceAll("_", " ");
        let index = songs.indexOf(currentMusic);

        if((index+1) < songs.length){
            playMusic(songs[index+1]);
        }
    })

    // Add an Event Listener to Volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("Setting Volume to " + e.target.value + "/100")
        currentSong.volume = parseInt(e.target.value) / 100;
        // 1.0 means highest volume (100%, default) & 0.0 means silent (mute)
    })

    // Event Listener to Mute the Volume
    document.querySelector(".volume>img").addEventListener("click", e =>{
        if(e.target.src.includes("images/volume.svg")){
            e.target.src = "images/mute.svg"
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = "images/volume.svg"
            currentSong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })
    
}
main();
