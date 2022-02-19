function getNewIdFromServer() {
    //get id from server -> document.cookie
    let p = fetch('/cookies/getNew', {
        method: 'get'
    }).then((response) => {
        return response.json();
    }).then((jsonObject) => {
        let d = new Date();
        d.setTime(d.getTime() + (31 * 24 * 60 * 60 * 1000)); //31 dayes
        let expDate = d.toGMTString();
        document.cookie = JSON.stringify(jsonObject) + "; expires=" + expDate + ";path=/";
    });
    return p;
}

if (document.cookie === undefined || document.cookie === '') {
    getNewIdFromServer();
}

console.log('Cookies(UUID):', document.cookie);

function getFileNamesPromise() {
    //get id from server -> document.cookie
    let p = fetch('/upload/getFilenames', {
        method: 'get'
    }).then((response) => {
        return response.json();
    }).then((jsonObject) => {
        return jsonObject;
    });
    return p;
}

let fileList = document.getElementById('fileList');
if (!(document.cookie === undefined || document.cookie === '')) {
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
}