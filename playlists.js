let play = document.getElementById("play");
let pause = document.getElementById("pause");

play.addEventListener("click", () => {
    play.style.display = 'none';
    pause.style.display = 'block';
});
pause.addEventListener("click", () => {
    pause.style.display = 'none';
    play.style.display = 'block';
});

let playlists = Array.from(document.getElementsByClassName("playlists"));
let jsonFileName = ["romantic.json", "old_is_gold.json", "english.json", "rap.json"];

playlists.forEach((card, index) => {
    card.addEventListener("click", async () => {
        try {
            let response = await fetch(`songs/${jsonFileName[index]}`);
            if (!response.ok) throw new Error("Failed to load " + jsonFileName[index]);

            let data = await response.json();
            let values = Object.values(data);
            let oneDArray = values.flat();
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

    attachPlayPauseListeners();
}

function attachPlayPauseListeners() {
    let play1 = Array.from(document.getElementsByClassName("play"));
    let pause1 = Array.from(document.getElementsByClassName("pause"));

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
        });
    });

    pause1.forEach((pauseBtn, index) => {
        pauseBtn.addEventListener("click", () => {
            pauseBtn.style.visibility = 'hidden';
            play1[index].style.visibility = 'visible';
            pause.style.display = 'none';
            play.style.display = 'block';
        });
    });
}
