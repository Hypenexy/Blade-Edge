var settings = {}
try {
    settings = JSON.parse(localStorage.getItem("settings"))
} catch (e) {}
if(!settings){
    settings = {}
}
if(settings.difficulty){
    document.getElementsByClassName("splash")[0].remove()
}
function saveSettings(){
    localStorage.setItem("settings", JSON.stringify(settings))
}

var app = document.getElementsByTagName("app")[0]
function initApp(){
    app.innerHTML = ""

    var splash = document.getElementById("splash")
    if(splash){
        splash.onended = function(){
            setTimeout(() => {
                splash.remove()
            }, 1000);
        }
    }

    var login = `
            <h1>`+locale.heyslayer+`</h1>
            <label>
            `+locale.usernameemail+`
                <input id='loginidentity'>
            </label>
            <label>
            `+locale.password+`
                <input type='password' id='loginpassword'>
            </label>
            <a>`+locale.registerinstead+`</a>
            <button>`+locale.login+`</button>
    `

    var register = `
            <h1>`+locale.welcomeslayer+`</h1>
            <label>
            `+locale.email+`
                <input id='loginemail'>
            </label>
            <label>
            `+locale.username+`
                <input id='loginusername'>
            </label>
            <label>
            `+locale.password+`
                <input type='password' id='loginpassword'>
            </label>
            <a>`+locale.logininstead+`</a>
            <button>`+locale.register+`</button>
    `
    var welcomescreen = document.createElement("div")
    welcomescreen.classList.add("welcome")
    welcomescreen.innerHTML = "<form>" + login + "</form>"

    function initForm(login, show){
        welcomescreen.getElementsByTagName("form")[0].innerHTML = login
        ButtonEvent(app.getElementsByTagName("a")[0], show)
    }

    //TODO: create restrictions like length and shit
    
    function showLogin(){
        initForm(login, showRegister)
    }

    function showRegister(){
        initForm(register, showLogin)
    }

    // var welcomescreen = `
    // <div class='welcome'>
    //     <form>
    //     </form>
    // </div>
    // `


    app.appendChild(welcomescreen)
    showLogin()


}

function playTrack(track){
    //open file track.mp3
    var music = document.createElement("div")
    music.id = "music"
    music.innerHTML = "<p>Now playing <b>"+track+"</b></p>"
    music.style.opacity = 0
    music.style.transform = "translateY(-20px)"
    app.appendChild(music)
    setTimeout(() => {
        music.style = ''
    }, 30);
    setTimeout(() => {
        music.style.opacity = 0
        music.style.transform = "translateY(-20px)"
        setTimeout(() => {
            music.remove()
        }, 500);
    }, 3000);
}

function setLanguage(language){
    if(document.getElementById("locale")){
        document.getElementById("locale").remove()
    }
    settings.language = language
    saveSettings()
    var src = "img/locales/" + language + ".js"
    
    loadScript(src, "locale", initApp)
}

window.onload = function(){
    if(settings.language){
        setLanguage(settings.language)
    }
    else{
        setLanguage("en")
    }
}