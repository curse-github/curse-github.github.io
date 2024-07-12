function fetchJson(url, callback) {
    fetch(url, {
        headers: {
            //Authorization: "Bearer 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"
        }
    })
    .then((response) => response.json())
    .then(callback);
}
async function fetchJsonPromise(url,input) {
    return new Promise((resolve) => {
        fetchJson(url,(json) => {
            resolve(json,input);
        })
    });
}
function append(parent,type,content,attributes) {
	let thing;
	if (type != null) { thing = document.createElement(type); } else { document.createElement("div"); }
	if (content != null) { thing.innerHTML = content; }
	Object.keys(attributes).forEach((i) => {
		thing.setAttribute(i, attributes[i]);
	});
	parent.appendChild(thing);
	return thing;
}

//#region github cards
const USER = "curse-github";
const adds = ["nekro-github/Syzygy"];
var cardList = null;

function appendCard(parent) {
    let card   = append(append(parent,"cardParent","",{}),"gitCard","",{});
    var header = append(card,"header","",{});
    var inner  = append(card,"inner" ,"",{});
    var footer = append(card,"footer","",{});
    return [header,inner,footer];
}
function appendGitCard(json) {
    [header,inner,footer] = appendCard(cardList);
    let name = json.name.split("-").join(" ").replace("curse github","curse-github").replace("nekro github","nekro-github")
    append(header,"a",name,{
        href: json.html_url, target: "_blank"
    });

    inner.setAttribute("onclick","this.parentElement.setAttribute('show',this.parentElement.getAttribute('show') != 'true');")
    append(inner,"img","",{
        src: "https://raw.githubusercontent.com/" + json.full_name + "/" + json.default_branch + "/Preview.png",
        onerror: "setAltImg(this);", draggable: "false"
    });
    let hpLink = json.homepage;
    if (hpLink != null && hpLink != "") {
        let link = append(footer,"a","",{
            class:"link-homepage",
            href:hpLink, target: "_blank"
        }); append(link,"img","",{
            src:"link.png", draggable:"false"
        }); link.innerHTML += hpLink.replace("https://","").replace("http://","").replace("/index.html","").replace("/index.php","");
    }
    if ((json.description != null && json.description != "")) { append(footer,"div","\"" + json.description + "\"",{}); }
    return [header,inner,footer];
}
function createUser(json) {
    let link1 =  append(document.querySelector(".profile > .pfPic"),"a","",{
        href: json.html_url, target: "_blank"
    });
    append(link1,"img","",{
        src: json.avatar_url, draggable: "false",
        onerror: "setAltImg(this);"
    });
    let hpLink = json.blog;
    if (json.blog != null && json.blog != "") {
        let link = append(document.querySelector(".profile > div > .links"),"a","",{
            href:"https://"+hpLink, target: "_blank"
        }); append(link,"img","",{
            src:"link.png", draggable:"false"
        }); link.innerHTML += json.blog.replace("https://","").replace("http://","").replace("/index.html","").replace("/index.php","");
    }
    if ((json.bio != null && json.bio != "")) { append(document.querySelector(".profile > div > .bio"),"div",json.bio,{}); }
}
async function run() {
    observer.observe(document.querySelector("navbar"));// navbar animation

    fetchJsonPromise("https://api.github.com/users/" + USER).then((usrJson) => { createUser(usrJson); });

    cardList = document.querySelector("#cardList");// repository cards
    let json = await fetchJsonPromise("https://api.github.com/users/" + USER + "/repos");
    
    await new Promise((resolve)=>{adds.forEach(async function(add) {
        let repo = await fetchJsonPromise("https://api.github.com/repos/"+add);
        repo.name = repo.full_name; json.push(repo); resolve();
    })
});
    
    var languages = {};
    for(var i = 0; i < json.length; i++) {
        appendGitCard(json[i]);
        var lang = json[i].language;
        if (lang != null && lang != undefined) {
            lang = lang.replace("Objective-C++","C++").replace("TypeScript","JavaScript");
            if (languages[lang] != null) { languages[lang]++; }
            else                         { languages[lang]=1; }
        }
    }
    if (languages != null && languages != undefined) {
        let entries = Object.entries(languages).sort((a,b)=>{ return b[1]-a[1]; });
        if (entries.length > 0) {
            var thing = (entry) => {
                if (entry[1] > 1) { return entry[1] + " of which are " + entry[0]; }
                else { return entry[1] + " is " + entry[0]; }
            };
            let bio = document.querySelector(".profile > div > .bio > div");
            bio.innerHTML += "<br>I have "  + json.length  + " public repositories. ";
            bio.innerHTML += thing(entries[0]) + ", ";
            bio.innerHTML += thing(entries[1]) + ", and ";
            bio.innerHTML += thing(entries[2]);
            entries.forEach((entry)=>{ console.log(entry[0] + ": " + Math.round(entry[1]/json.length*100) + "%"); });
        }
    }
}
function setAltImg(element) {
    element.src = "/github-logo.png"
    element.setAttribute("alt",true);
}
//#endregion

//#region letter animation
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        document.querySelector("letterContainer").setAttribute("animate",entry.isIntersecting);
    });
});
//#endregion
window.onload = () => {
    run();
}