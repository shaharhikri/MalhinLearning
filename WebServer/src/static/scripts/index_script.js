const data = { id: myid };

let fileList = document.getElementById('fileList');
async function renderUploadedFiles() {
    await fetch('/getFilenames', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        return response.json();
    }).then((jsonObject) => {
        return jsonObject;
    })
        .then((namesArr) => {
            try {
                for (n of namesArr) {
                    // let item = document.createElement('li')
                    // item.innerHTML = n;
                    fileList.innerHTML = `${n}`;
                }
            } catch (err) {
                console.log(err);
                console.log('namesArr =', namesArr);
            }
        });
}



async function changeToLoading() {
    let upload_btn = document.getElementById('upload_btn');
    let filesChoice = document.getElementById('filesChoice');

    upload_btn.remove();
    filesChoice.style.visibility = "hidden";
}


let filesChoice = document.getElementById('filesChoice');

async function uploadFile() {
    let formData = new FormData();
    formData.append("field", myid);
    if (filesChoice.files.length > 0) {
        formData.append("file", filesChoice.files[0]);
        //changeToLoading()
    }
    let res = await fetch('/upload/', {
        method: "POST",
        body: formData
    });
    if (res.status == 200) {
        await renderUploadedFiles(); //location.replace('/');
        alert('The file has been uploaded successfully.');
    }
    else if (res.status == 403) {
        alert('Please choose file to upload first.');
        //location.replace('/');
    }
    else {
        let j = await res.json();
        alert(j.error);
        //location.replace('/');
    }
}

let genresCombobox = document.getElementById('genres');
async function renderGenres() {
    let res = await fetch('/compose/getgenres', {
        method: 'GET',
    })
    if (res.status == 200) {
        let genres = (await res.json()).genres;
        for (n of genres) {
            item = document.createElement('option');
            item.value = n;
            item.innerHTML = n;
            genresCombobox.appendChild(item);
        }
    }
    else {
        console.log(res.status)
        console.log(res)
    }
}
renderGenres();

// let compose_btn = document.getElementById('compose_btn');
// compose_btn.style.visibility = "visible"
// let composing_h2 = document.getElementById('composing_h2');
// composing_h2.style.visibility = "hidden"

let composing_container = document.getElementById('composing_container');

async function compose() {
    composing_container.innerHTML = "";
    let composing_loading = document.createElement('div');
    composing_loading.setAttribute('id', 'composing_h2');
    composing_loading.setAttribute('class', 'loader');
    // composing_loading.innerHTML = "composing...";
    
    composing_container.appendChild(composing_loading);


    genre = genresCombobox.value
    console.log('compose genre: ' + genre)
    let res = await fetch('/compose/', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: myid,
            genre: genre
        })
    });

    if (res.status == 200) {
        let melodyObj = await res.json();
        addMelodyUpdateUI(melodyObj.melody);
        alert('Composed successfully.');
    }
    else if (res.status == 400) {
        alert('Upload file before.');
    }
    else {
        alert('Something went wrong.');
    }

    composing_container.innerHTML = "";
    let composing_btn = document.createElement('button');
    composing_btn.setAttribute('type', 'button');
    composing_btn.setAttribute('id', 'compose_btn');
    composing_btn.setAttribute('onclick', 'compose()');
    composing_btn.innerHTML = "Compose";
    
    composing_container.appendChild(composing_btn);
}

async function logout() {
    delCookie();
    location.replace('/login');
}

function delCookie() {
    var new_date = new Date()
    new_date = new_date.toGMTString()
    var thecookie = document.cookie.split(";")
    for (var i = 0; i < thecookie.length; i++) {
        document.cookie = thecookie[i] + "; expires =" + new_date
    }
}

async function deleteMelody(filename) {
    let answer = window.confirm(`Delete ${filename}?`);
    if (answer) {
        let res = await fetch(`/melodies/delete/${filename}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (res.status == 200) {
            // await renderUploadedFiles(); //location.replace('/');
            deleteMelodUpdateUI(filename)
            alert('File Deleted successfully.');
        }
    }
}

async function downloadFile(filename) {
    let res = await fetch(`/melodies/download/${filename}`, { method: 'GET' })
    if (res.status == 200) {
        let blob = await res.blob()
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();  //afterwards we remove the element again
    }
}


async function listenFile(filename) {
    let listen_url = `/melodies/download/${filename}`;
    let midiPlayer = document.getElementById(`player_${filename}`);
    midiPlayer.setAttribute('src', listen_url);

    document.getElementById(`load_btn_${filename}`).onclick = null;
    document.getElementById(`load_btn_${filename}`).style.transition = "transform 8s";
    document.getElementById(`load_btn_${filename}`).style.transform_style = "preserve-3d";
    document.getElementById(`load_btn_${filename}`).style.transform = "rotateY(1800deg)";
    document.getElementById(`load_btn_${filename}`).innerHTML = "Loading...";
    setTimeout(() => {
        document.getElementById(`load_btn_${filename}`).remove();
        midiPlayer.style.width = "50px";
        midiPlayer.style.marginLeft = "53px";
        midiPlayer.style.visibility = "visible";
        document.getElementById('listenRow').style.visibility = "visible";
        // setTimeout(() => {
        //     document.getElementById('visualizer').style.overflowX = "hidden";
        // }, 5000)
    }, 8000);
}

let melodiesList = document.getElementById('scroll_audios');
async function renderMelodies() {
    //melodiesList.innerHTML="";
    let res = await fetch('/melodies/getattachmentsnames', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (res.status == 200) {
        let names = await res.json();
        for (n of names) {
            addMelodyUpdateUI(n);
        }
        console.log(melodiesList)
    }
}

async function addMelodyUpdateUI(n) {
    audio_row = document.createElement('div');
    audio_row.setAttribute('id', `audio_row_${n}`);
    audio_row.setAttribute('class', 'audio_row');

    filename_mid = document.createElement('label'); // 1
    filename_mid.setAttribute('class', 'filename_mid');
    filename_mid.innerHTML = n;

    audio_player = document.createElement('midi-player'); // 2
    audio_player.setAttribute('class', 'audio_player');
    audio_player.setAttribute('id', `player_${n}`);

    audio_player.setAttribute('sound-font', "");
    audio_player.setAttribute('visualizer', "#visualizer");
    audio_player.style.width = "0";
    audio_player.style.visibility = "hidden";

    audio_btns = document.createElement('div'); // 3
    audio_btns.setAttribute('class', 'audio_btns');

    audio_listen_btn = document.createElement('button'); // 3.0
    audio_listen_btn.setAttribute('class', 'audio_listen_btn');
    audio_listen_btn.setAttribute('type', 'button');
    audio_listen_btn.setAttribute('id', `load_btn_${n}`);
    audio_listen_btn.setAttribute('onclick', `listenFile("${n}")`);
    audio_listen_btn.innerHTML = 'Play';

    audio_download_btn = document.createElement('button'); // 3.1
    audio_download_btn.setAttribute('class', 'audio_download_btn');
    audio_download_btn.setAttribute('type', 'button');
    audio_download_btn.setAttribute('onclick', `downloadFile("${n}")`);
    audio_download_btn.innerHTML = 'Download';

    audio_delete_btn = document.createElement('button');  // 3.2
    audio_delete_btn.setAttribute('class', 'audio_delete_btn');
    audio_delete_btn.setAttribute('type', 'button');
    audio_delete_btn.setAttribute('onclick', `deleteMelody("${n}")`);
    audio_delete_btn.innerHTML = 'Delete';

    audio_btns.appendChild(audio_listen_btn);
    audio_btns.appendChild(audio_download_btn);
    audio_btns.appendChild(audio_delete_btn);

    audio_row.appendChild(filename_mid);
    audio_row.appendChild(audio_player);
    audio_row.appendChild(audio_btns);

    melodiesList.appendChild(audio_row);
}

async function deleteMelodUpdateUI(filename) {
    document.getElementById(`audio_row_${filename}`).remove();
}

renderMelodies();
renderUploadedFiles();
// console.log('COOKIES: ',document.cookie)