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
            const element = as[i].href.split("/songs/")[1]
            songs.push(element.split(".mp3")[0]);
        }
    }
    return songs;
}
async function main(){
    // List of all songs
    let songs = await getSongs();
    console.log(songs);

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

    
}
main();
