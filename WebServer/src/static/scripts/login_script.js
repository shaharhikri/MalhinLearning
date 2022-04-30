let errorMessage = document.getElementById('errorMessage');
let emailInput = document.getElementById('emailInput');
let passwordInput = document.getElementById('passwordInput');
console.log('COOKIES: ',document.cookie)

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

async function login() { 
    let data = { email: emailInput.value, password: passwordInput.value}
    return await fetch('/login', {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response) => {
        return response.json();
    }).then((jsonObject) => {
        if(jsonObject.token){
            let d = new Date();
            d.setTime(d.getTime() + (31 * 24 * 60 * 60 * 1000)); //31 dayes
            let expDate = d.toGMTString();
            document.cookie = JSON.stringify(jsonObject) + "; expires=" + expDate + ";path=/";
            location.replace('/');
        }
        else if(jsonObject.error){
            console.log('error login!',jsonObject)
            errorMessage.innerHTML = jsonObject.error;
        }
    });
}

delCookie();