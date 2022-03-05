console.log('Cookies(UUID):', document.cookie);
console.log('ID:', myid);
console.log(`{ \"id\" : \"${myid}\" }`)

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

let composeBtn = document.getElementById('fileList');