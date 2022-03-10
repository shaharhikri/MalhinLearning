let errorMessage = document.getElementById('errorMessage');
let nameInput = document.getElementById('nameInput');
let emailInput = document.getElementById('emailInput');
let passwordInput = document.getElementById('passwordInput');

async function register() { 
    let data = { email: emailInput.value, name: nameInput.value, password: passwordInput.value}
    return await fetch('/register', {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response) => {
        return response.json();
    }).then((jsonObject) => {
        console.log('jsonObject ',jsonObject)
        if(jsonObject.error){
            console.log('error register!',jsonObject)
            errorMessage.innerHTML = jsonObject.error;
        }
        else if(jsonObject.succeeded){
            console.log('register succeeded!',jsonObject)
            location.replace('/');
        }  
    });
}

console.log('COOKIES: ',document.cookie)
