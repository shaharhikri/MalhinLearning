const data = { id: myid };

function getFileNamesPromise() {
    //get id from server -> document.cookie
    let p = fetch('/getFilenames', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        return response.json();
    }).then((jsonObject) => {
        return jsonObject;
    });
    return p;
}

let fileList = document.getElementById('fileList');
getFileNamesPromise().then((namesArr) => {
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


let filesChoice = document.getElementById('filesChoice');

async function uploadFile() {
    let formData = new FormData();  
    formData.append("field", myid);
    if(filesChoice.files.length > 0){
        formData.append("file", filesChoice.files[0]);
    }
    let res = await fetch('/upload/', {
      method: "POST", 
      body: formData
    });
    if(res.status==200){
        alert('The file has been uploaded successfully.');
        location.replace('/');
    }
    else if(res.status==403){
        alert('Please choose file to upload first.');
        location.replace('/');
    }
    else {
        let j = await res.json();
        alert(j.error);
        location.replace('/');
    }
}

let genresCombobox = document.getElementById('genres');
async function renderGenres(){
    let res = await fetch('/compose/getgenres', {
        method: 'GET',
    })
    if(res.status==200){
        let genres = (await res.json()).genres;
        for (n of genres) {
            item = document.createElement('option');
            item.value = n;
            item.innerHTML = n;
            genresCombobox.appendChild(item);
        }
    }
    else{
        console.log(res.status)
        console.log(res)
    }
}
renderGenres();

async function compose(){
    genre = genresCombobox.value
    console.log('compose genre: '+genre)
    let res = await fetch('/compose/', {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: myid,
            genre : genre
        })
      })

    if(res.status==200){
        alert('Composed successfully.');
        location.replace('/');
    }
    else if(res.status==400){
        alert('Upload file before.');
    }
    else{
        alert('Something went wrong.');
    }
    //TODO: Multiple files instead of 1
}

async function logout(){
    delCookie();
    location.replace('/login');
}

function delCookie()
{
    var new_date = new Date()
    new_date = new_date.toGMTString()
    var thecookie = document.cookie.split(";")
    for (var i = 0;i < thecookie.length;i++)
    {
        document.cookie = thecookie[i] + "; expires ="+ new_date
    }
}

async function deleteFile(filename){
    let res = await fetch(`/melodies/delete/${filename}`, {
        method: 'DELETE',
    })
    if(res.status==200){
        alert('File Deleted successfully.');
        location.replace('/');
    }
}

async function downloadFile(filename){
    let res = await fetch(`/melodies/download/${filename}`, {method: 'GET'})
    if(res.status==200){
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


async function renderListenDiv(filename){
    let listen_url = `/melodies/download/${filename}`;
    let midiPlayer = document.getElementById(`player_${filename}`);
    midiPlayer.setAttribute('src', listen_url);

    // midiPlayer.style.visibility = "visible";
    // transform: rotateY(180deg)
    // transition: transform 1s;
    // transform-style: preserve-3d;
    document.getElementById(`load_btn_${filename}`).style.transition = "transform 8s";
    document.getElementById(`load_btn_${filename}`).style.transform_style = "preserve-3d";
    document.getElementById(`load_btn_${filename}`).style.transform = "rotateY(1800deg)";
    setTimeout(() => {  
        document.getElementById(`load_btn_${filename}`).remove();
        midiPlayer.style.width = "50px";
        midiPlayer.style.marginLeft = "53px";
        midiPlayer.style.visibility = "visible";
        document.getElementById('listenRow').style.visibility = "visible";
        document.getElementById('visualizer').style.overflow = "hidden";
    }, 8000); // TODO change 7000
    // document.getElementById(`load_btn_${filename}`).remove();
}

async function listenFile(filename){
    renderListenDiv(filename)
    // let res = await fetch(`/melodies/download/${filename}`, {
    //     method: 'GET',
    // })
    // if(res.status==200){
    //     //make div
    // }
}


let melodiesList = document.getElementById('scroll_audios');
async function renderMelodies(){
    let res = await fetch('/melodies/getattachmentsnames', {
        method: 'GET',
    })
    if(res.status==200){
        let names = await res.json();
        for (n of names) {
            download_url = '/melodies/download/'+n;
            // delete_url = '/melodies/delete/'+n;
            listen_url = '/melodies/download/'+n;

            audio_row = document.createElement('div');
            audio_row.setAttribute('class', 'audio_row');

            filename_mid = document.createElement('label'); // 1
            filename_mid.setAttribute('class', 'filename_mid');
            // filename_mid.setAttribute('for', n);
            filename_mid.innerHTML = n;

            audio_player = document.createElement('midi-player'); // 2
            audio_player.setAttribute('class', 'audio_player');
            audio_player.setAttribute('id', `player_${n}`);
            // // audio_player.setAttribute('src', listen_url);
            // audio_player.setAttribute('src', `listenFile("${n}")`);
            audio_player.setAttribute('sound-font', "");
            // audio_player.setAttribute('visualizer', "#myPianoRollVisualizer");
            audio_player.setAttribute('visualizer', "#visualizer");
            audio_player.style.width = "0";
            audio_player.style.visibility = "hidden";

            
            // audio_player = document.createElement('audio'); // 2
            // audio_player.setAttribute('class', 'audio_player');
            // audio_player.setAttribute('id', n);
            // audio_player.setAttribute('controls', '');
            // audio_player.setAttribute('controlslist', 'nodownload');
            
            // source = document.createElement('source'); // 2.1
            // source.setAttribute('src', listen_url);
            // source.setAttribute('type', 'application/octet-stream');
            
            // audio_player.appendChild(source);
            // audio_player.appendChild(document.createTextNode("Your browser does not support the audio element"));
            
            audio_btns = document.createElement('div'); // 3
            audio_btns.setAttribute('class', 'audio_btns');

            audio_listen_btn = document.createElement('button'); // 3.0
            audio_listen_btn.setAttribute('class', 'audio_listen_btn');
            audio_listen_btn.setAttribute('type', 'button');
            audio_listen_btn.setAttribute('id', `load_btn_${n}`);
            audio_listen_btn.setAttribute('onclick', `listenFile("${n}")`);
            audio_listen_btn.innerHTML = 'Load Song';

            audio_download_btn = document.createElement('button'); // 3.1
            audio_download_btn.setAttribute('class', 'audio_download_btn');
            audio_download_btn.setAttribute('type', 'button');
            audio_download_btn.setAttribute('onclick', `downloadFile("${n}")`);
            audio_download_btn.innerHTML = 'Download';

            audio_delete_btn = document.createElement('button');  // 3.2
            audio_delete_btn.setAttribute('class', 'audio_delete_btn');
            audio_delete_btn.setAttribute('type', 'button');
            audio_delete_btn.setAttribute('onclick', `deleteFile("${n}")`);
            audio_delete_btn.innerHTML = 'Delete';

            audio_btns.appendChild(audio_listen_btn);
            audio_btns.appendChild(audio_download_btn);
            audio_btns.appendChild(audio_delete_btn);

            audio_row.appendChild(filename_mid);
            audio_row.appendChild(audio_player);
            audio_row.appendChild(audio_btns);



            melodiesList.appendChild(audio_row);
        }
        console.log(melodiesList)
    }
}


renderMelodies();

// console.log('COOKIES: ',document.cookie)