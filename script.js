console.log("JavaScript Code!");

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
            songs.push(as[i].href.split("/songs/")[1]);
        }
    }
    return songs;
}
async function main(){
    // List of all songs
    let songs = await getSongs();
    console.log(songs);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> ${song.replaceAll("_", " ")} </li>`;
    }

    // Play the first song
    let audio = new Audio(songs[0]);
    try{
        // audio.play();
        console.log("Song Played!");
    }
    catch(error){
        console.log("Error: ", error);
    }
    
    audio.addEventListener("loadeddata", ()=>{
        let duration = audio.duration;
        console.log("Duration: ", duration);
        // The duration variable will hold the duration (in seconds) of the audio file.
    })
    
}
main();
