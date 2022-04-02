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
            let item = document.createElement('li')
            item.innerHTML = n;
            fileList.appendChild(item);
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

async function compose(){
    let res = await fetch('/compose/', {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: myid,
            genre : 'waltzes'
        })
      })

    if(res.status==200){
        alert('Composed successfully.');
        location.replace('/');
    }
    else if(res.status==400){
        alert('Upload file before.');
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

console.log('COOKIES: ',document.cookie)

let melodiesList = document.getElementById('melodiesList');
async function renderMelodies(){
    let res = await fetch('/melodies/getattachmentsnames', {
        method: 'GET',
    })
    if(res.status==200){
        let names = await res.json();
        for (n of names) {
            item = document.createElement('li');
            link  = document.createElement('a');
            text = document.createTextNode(n);

            link.href = '/melodies/download/'+n;
            link.setAttribute("class", "some-class-name");
            link.appendChild(text);
            item.appendChild(link);
            melodiesList.appendChild(item);
        }
    }
}

renderMelodies();