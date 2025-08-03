let play = document.getElementById("play");
let pause = document.getElementById("pause");

// audio elememnt global vairables
let audio = new Audio();
let audioFolder = ["romantic","old_is_gold","english","rap"]
let songCardIndex;
let currentPlay;
let currentPause;

// audio array global vairables
let oneDArray;

// global vairables
let currentPlaylistName;
let oldPlaylistIndex;
// global vairables
let lastsongname;
let lastSongIndex;

play.addEventListener("click", () => {
   if(lastsongname.length !==0)
   {
        console.log("play...")
        play.style.display = 'none';
        pause.style.display = 'block';
        audio.play();
        currentPause[songCardIndex].style.visibility = 'visible';
        currentPlay[songCardIndex].style.visibility = 'hidden';
   }
});
pause.addEventListener("click", () => {
    console.log("pause...")
    pause.style.display = 'none';
    play.style.display = 'block';
    audio.pause();
    currentPlay[songCardIndex].style.visibility = 'visible';
    currentPause[songCardIndex].style.visibility = 'hidden';
});

let playlists = Array.from(document.getElementsByClassName("playlists"));
let jsonFileName = ["romantic.json", "old_is_gold.json", "english.json", "rap.json"];


playlists.forEach((card, index) => {
    card.addEventListener("click", async () => {

        if(index != oldPlaylistIndex)
        {
            audio.pause();
            oldPlaylistIndex = index;
            pause.style.display = 'none';
            play.style.display = 'block';
        }
        try {
            let response = await fetch(`songs/${jsonFileName[index]}`);
            if (!response.ok) throw new Error("Failed to load " + jsonFileName[index]);

            let data = await response.json();
            let values = Object.values(data);
            oneDArray = values.flat();
            currentPlaylistName = audioFolder[index];
            let name = document.getElementById("playlist-name");
            name.innerHTML = String(currentPlaylistName).toUpperCase();
            displaySongs(oneDArray);
        } catch (err) {
            console.error(err);
        }
    });
});

function displaySongs(songs) {
    let mainDiv = document.getElementById("song-container");
    mainDiv.className = "song-container";
    mainDiv.innerHTML = "";

    songs.forEach((song) => {
        let newDiv = document.createElement("div");
        newDiv.className = "song";

        let newImg = document.createElement("img");
        newImg.src = "assets/lavender.png";

        let i1 = document.createElement("i");
        i1.className = "fas fa-2x fa-play play";

        let i2 = document.createElement("i");
        i2.className = "fas fa-2x fa-pause pause";
        i2.style.visibility = "hidden";

        let para = document.createElement("p");
        para.innerHTML = song;

        newDiv.appendChild(newImg);
        newDiv.appendChild(i1);
        newDiv.appendChild(i2);
        newDiv.appendChild(para);
        mainDiv.appendChild(newDiv);
    });

    attachPlayPauseListeners(songs);
}

function attachPlayPauseListeners(songs) {
    let play1 = Array.from(document.getElementsByClassName("play"));
    let pause1 = Array.from(document.getElementsByClassName("pause"));

    currentPlay = play1;
    currentPause = pause1;

    function pauseOthers(index) {
        for (let i = 0; i < play1.length; i++) {
            if (i === index) continue;
            pause1[i].style.visibility = 'hidden';
            play1[i].style.visibility = 'visible';
        }
    }

    play1.forEach((playBtn, index) => {
        playBtn.addEventListener("click", () => {
            playBtn.style.visibility = 'hidden';
            pause1[index].style.visibility = 'visible';
            pauseOthers(index);
            play.style.display = 'none';
            pause.style.display = 'block';
            playAudio(songs, index);
            
            songCardIndex = index;
        });
    });

    pause1.forEach((pauseBtn, index) => {
        pauseBtn.addEventListener("click", () => {
            pauseBtn.style.visibility = 'hidden';
            play1[index].style.visibility = 'visible';
            pause.style.display = 'none';
            play.style.display = 'block';
            audio.pause();
        });
    });
}

function playAudio(songs, index)
{
    if(lastsongname != songs[index])
    {
        let songName = songs[index];
        audio.src = `songs/${currentPlaylistName}/${songName}`; 
        lastsongname = songName; 
        lastSongIndex = index;
        setAudioDuration(audio);  
    }
    audio.play();
}

let nextButton = document.getElementById("next");
nextButton.addEventListener("click",()=>
{
    currentPlay[lastSongIndex].style.visibility = 'visible';
    currentPause[lastSongIndex].style.visibility = 'hidden';

    currentPlay[lastSongIndex+1].style.visibility = 'hidden';
    currentPause[lastSongIndex+1].style.visibility = 'visible';
    playAudio(oneDArray,lastSongIndex+1);
    songCardIndex +=1;

    play.style.display = 'none';
    pause.style.display = 'block';
})

let previousButton = document.getElementById("previous");
previousButton.addEventListener("click",()=>
{
    currentPlay[lastSongIndex].style.visibility = 'visible';
    currentPause[lastSongIndex].style.visibility = 'hidden';

    currentPlay[lastSongIndex-1].style.visibility = 'hidden';
    currentPause[lastSongIndex-1].style.visibility = 'visible';
    playAudio(oneDArray,lastSongIndex-1);
    songCardIndex -=1;

    play.style.display = 'none';
    pause.style.display = 'block';
})

function setAudioDuration(audio)
{
    let totalDuration;
    audio.addEventListener("loadedmetadata", () => 
    {
        totalDuration = Math.floor(audio.duration);

        let min = Math.floor(totalDuration/60);
        let sec = Math.floor(totalDuration%60);
        let totalTime = document.getElementById("total-time")
        totalTime.innerHTML = `${min}:${sec}`;
        setProgressBar(totalDuration);
    })
}

function setProgressBar(totalDuration)
{
    audio.addEventListener("timeupdate",()=>
    {
        let currentTime = audio.currentTime;
        let progressPercent = (currentTime / totalDuration) * 100;

        let realtime = document.getElementById("real-time");
        let min =  Math.floor(currentTime/60);
        let sec = Math.floor(currentTime%60);
        realtime.innerHTML = `${min}:${sec}`;
        let progressBar = document.getElementById("song-progress-bar");
        progressBar.value = progressPercent;
    })
}

let progressBar = document.getElementById("song-progress-bar");
progressBar.addEventListener("input", () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

let volumeSlider = document.getElementById("audio-bar");

volumeSlider.addEventListener("input", () => {
  const volumeValue = volumeSlider.value / 100; // Convert 0–100 to 0.0–1.0
  console.log(volumeSlider.value);
  audio.volume = volumeValue;

  const icon = document.getElementById("volume-icon");
  if(volumeSlider.value>=75)
  {
    icon.src = "assets/volume_full.png";
  }
  else if(volumeSlider.value>=25 && volumeSlider.value<75)
  {
    icon.src = "assets/medium_volume.png";
  }
  else if(volumeSlider.value>=1 && volumeSlider.value<25)
  {
    icon.src = "assets/low_volume.png";
  }
  else
  {
    icon.src = "assets/mute.png";
  }
});
