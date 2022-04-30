var server = "http://localhost/BladeEdge/"
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
            <p class='error'></p>
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
            <p></p>
            <a>`+locale.logininstead+`</a>
            <button>`+locale.register+`</button>
    `
    var welcomescreen = document.createElement("div")
    welcomescreen.classList.add("welcome")
    welcomescreen.innerHTML = "<form>" + login + "</form>"

    var news = document.createElement("div")
    news.classList.add("news")

    $.ajax({
        url: server + "app/news.php",
        success: function (response) {
            news.innerHTML = response
            app.appendChild(news)
        },
        error: function() {
            newsstuff = "Could not connect to server."
        }
    });

    var form
    function initForm(login, show){
        form = welcomescreen.getElementsByTagName("form")[0]
        form.innerHTML = login
        ButtonEvent(form.getElementsByTagName("a")[0], show)
    }

    function showLogin(){
        initForm(login, showRegister)
        var errorEl = form.getElementsByTagName("p")[0]
        var inputs = form.getElementsByTagName("input")
        errorEl.style.background = "initial"
        form.onsubmit = function(e){
            e.preventDefault()
            $.ajax({
                type : "post",
                data : {identity : inputs[0].value, password : inputs[1].value},
                url: server + "app/login.php",
                success: function (response) {
                    if(response!=201){
                        if(errorEl.style.background){
                            errorEl.style.removeProperty("background")
                        }
                        errorEl.innerHTML = response
                    }
                    else{
                        loadUser()
                    }
                },
                error: function() {
                    PushNotification("Cannot connect to server!")
                }
            });
        }
    }
    
    function showRegister(){
        initForm(register, showLogin)
        var errorEl = form.getElementsByTagName("p")[0]
        var inputs = form.getElementsByTagName("input")
        errorEl.style.background = "initial"
        form.onsubmit = function(e){
            e.preventDefault()
            $.ajax({
                type : "post",
                data : {email : inputs[0].value, username : inputs[1].value, password : inputs[2].value},
                url: server + "app/register.php",
                success: function (response) {
                    if(response!=201){
                        if(errorEl.style.background){
                            errorEl.style.removeProperty("background")
                        }
                        errorEl.innerHTML = response
                    }
                    else{
                        loadUser()
                    }
                },
                error: function() {
                    PushNotification("Cannot connect to server!")
                }
            });
        }
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