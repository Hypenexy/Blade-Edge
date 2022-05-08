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

    var loggedUser = false

    function loadUser(user){
        loggedUser = true

        welcomescreen.remove()

        news.style.width = "330px"
        news.style.top = "80px"
        news.style.height = "calc(100% - 110px)"

        var infoel = news.getElementsByClassName("info")[0]
        
        infoel.style.float = "initial"
        
        var articlesels = news.getElementsByClassName("article")

        for (let i = 0; i < articlesels.length; i++) {
            articlesels[i].style.width = "initial"   
        }

        var header = document.createElement("header")

        header.innerHTML = `
            <h1><i>BladeEdge</i></h1>
            <p><span class='m-i'>account_circle</span><a>`+user.username+`</a></p>
        `

        function removeProfile(profilemenu){
            profilemenubtn.classList.remove("pactive")
            profilemenu.remove()
        }
        function openProfile(button){
            button.classList.add("pactive")
            var oldprofilemenu = document.getElementsByClassName("profilemenu")[0]
            if(oldprofilemenu){
                removeProfile(oldprofilemenu)
            }
            else{
                var profilemenu = document.createElement("div")
                profilemenu.classList.add("profilemenu")
    
                var profilebtn = document.createElement("a")
                profilebtn.innerText = "Account"
                ButtonEvent(profilebtn, openmenumenu, profilebtn.innerText)
                profilemenu.appendChild(profilebtn)
    
                var friendbtn = document.createElement("a")
                friendbtn.innerText = "Friends"
                ButtonEvent(friendbtn, openmenumenu, friendbtn.innerText)
                profilemenu.appendChild(friendbtn)
    
                var settingsbtn = document.createElement("a")
                settingsbtn.innerText = "Settings"
                ButtonEvent(settingsbtn, openmenumenu, settingsbtn.innerText)
                profilemenu.appendChild(settingsbtn)
    
                header.appendChild(profilemenu)
                setTimeout(() => {
                    profilemenu.classList.add("profilemenuactive")
                }, 10);
            }
        }

        var profilemenubtn = header.getElementsByTagName("p")[0]

        ButtonEvent(profilemenubtn, openProfile, profilemenubtn)

        app.addEventListener("click", function(e){
            if(!e.composedPath().includes(profilemenubtn)){
                var profilemenu = document.getElementsByClassName("profilemenu")[0]
                if(profilemenu){
                    removeProfile(profilemenu)
                }
            }
        })

        app.appendChild(header)

        var menumenu = document.createElement("div")
        menumenu.classList.add("menumenu")
        app.appendChild(menumenu)

        function openmenumenu(option){
            function logout(){
                $.ajax({
                    url: server + "app/logout.php",
                    success: function (response) {
                        initApp()
                    },
                    error: function() {
                        alert("Could not logout!")
                    }
                });
            }
            menumenu.classList.add("menumenuactive")
            menumenu.innerHTML = "<h1>"+option+"</h1><span class='m-i x'>close</span>"
            if(option=="Account"){
                var logoutbtn = document.createElement("a")
                logoutbtn.classList.add("oaction")
                logoutbtn.innerHTML = "<ti>Logout</ti><co>Exit out of your profile</co>"
                menumenu.appendChild(logoutbtn)
                ButtonEvent(logoutbtn, logout)
            }
            ButtonEvent(menumenu.getElementsByClassName("x")[0], function(){menumenu.classList.remove("menumenuactive")})
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
    
    var formelement = document.createElement("form")
    formelement.innerHTML = login
    welcomescreen.appendChild(formelement)

    var news = document.createElement("div")
    news.classList.add("news")

    $.ajax({
        url: server + "app/startup.php",
        success: function (response) {
            response = JSON.parse(response)
            news.innerHTML = response.news
            if(response.user){
                loadUser(response.user)
            }
            app.appendChild(news)
        },
        error: function() {
            news.innerHTML = "Could not connect to server."
            app.appendChild(news)
        }
    });

    if(!loggedUser){
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
                        response = JSON.parse(response)
                        if(response.status!=201){
                            if(errorEl.style.background){
                                errorEl.style.removeProperty("background")
                            }
                            errorEl.innerHTML = response.status
                        }
                        else{
                            loadUser(response.user)
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
                        response = JSON.parse(response)
                        if(response.status!=201){
                            if(errorEl.style.background){
                                errorEl.style.removeProperty("background")
                            }
                            errorEl.innerHTML = response.status
                        }
                        else{
                            loadUser(response.user)
                        }
                    },
                    error: function() {
                        PushNotification("Cannot connect to server!")
                    }
                });
            }
        }
    }

    app.appendChild(welcomescreen)
    showLogin()


}

var song
var soundtrackAllowed = true
var lastsongi = 0
function soundtrack(){
    if(soundtrackAllowed){
        var i
        function randomSong(){
            i = getRandomInt(1, 4)
            if(lastsongi==i){
                randomSong()
            }
        }
        randomSong()
        lastsongi = i
        var randomsong = ""
        switch (i) {
            case 1:
                randomsong = "caml"
                break;
            case 2:
                randomsong = "arcade2"
                break;
            case 3:
                randomsong = "calmplace"
                break;
            case 4:
                randomsong = "mystery"
                break;
            default:
                break;
        }
        playTrack(randomsong)
        song.onload = new function(){
            setTimeout(() => {
                setTimeout(() => {
                    soundtrack()
                }, song.duration*1000)
            }, 100)
        }
        // setTimeout(() => {
        //     soundtrack()
        // }, duration);
    }
}

function playTrack(track){
    song = new Audio("img/soundtracks/" + track + '.mp3');
    song.volume = 0.1;
    song.play();

    var i = 10
    function fadeIn(){
        setTimeout(function(){
            i++
            song.volume = i/100;
            if(i<40){
                fadeIn()
            }
        }, 100)
    }
    fadeIn()

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