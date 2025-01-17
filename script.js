console.log("JavaScript Code!");

let currentSong = new Audio();
// let isPlaying = false;              // Global Variable to track global state

function formatSongDuration(seconds) {
    seconds = Math.max(0, Math.floor(seconds));
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    // Format with leading zeros if needed
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    // Return the formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(){
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for(let i=0; i<as.length; i++){
        const element = as[i];
        if(element.href.includes(".mp3")){
            const element = as[i].href.split("/songs/")[1]
            songs.push(element.split(".mp3")[0]);
        }
    }
    return songs;
}

const playMusic = (track, pause=false)=>{
    let formattedTrack = track.replaceAll(" ", "_")
    let encodedTrack = encodeURIComponent(formattedTrack + ".mp3");     // To handle spaces and special characters 
    // let audio = new Audio("/songs/" + encodedTrack)
    // audio.play()

    currentSong.src = "/songs/" + encodedTrack;
    
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

    // List of all songs
    let songs = await getSongs();
    console.log(songs);
    playMusic(songs[0].replaceAll("_", " "), true);

    // Show all the songs in the Library
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
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
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        })
    });

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
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${formatSongDuration(currentSong.currentTime)}/${formatSongDuration(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
}
main();
