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
        for (name of namesArr) {
            let item = document.createElement('li')
            item.innerHTML = name;
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
    await fetch('/upload/', {
      method: "POST", 
      body: formData
    });    
    alert('The file has been uploaded successfully.');
}

async function compose(){
    await fetch('/compose/', {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });    
      alert('Composed successfully.');

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