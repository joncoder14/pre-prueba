
const form = document.getElementById("form");
const container = document.getElementById("container");
const countentContainer = container.innerHTML;

form.addEventListener("submit", (e) => {
    e.preventDefault()
    const {email,password} = Object.fromEntries(new FormData(form));
    const users = getUsers();
    console.log(users);
    // const foundUser = users.find((user) => {
    //     return user.email === email && user.password === password
    // })
    // if(foundUser) {
    //     alert("login correcto")
    // } else {
    //     alert("incorrecto")
    // }

    

})

async function getUsers() {
    try{
        const response = await fetch("http://localhost:3000/users");
        const data = await response.json()
        return data
    } catch(error) {
        console.log("error:",error)
    }
}

