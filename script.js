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

async function main(){

    // Display all the Albums on the Page

    // List of all songs
    await getSongs("songs/Bhajan/");
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

    // Load the Playlist whenever the card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",  async item=>{
            // console.log(item.currentTarget, item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}/`);
        })
    })
    
}
main();
