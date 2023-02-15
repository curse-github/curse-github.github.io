function fetchJson(url, callback) {
    fetch(url)
    .then((response) => response.json())
    .then(callback);
}
async function fetchJsonPromise(url) {
    return new Promise((resolve) => {
        fetchJson(url,(json) => {
            resolve(json);
        })
    });
}
function append(parent,type,content,attributes) {
	var thing;
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
var cardList = null;

function appendCard(parent) {
    var cardParent = append(parent,"cardParent","",{});
    var card   = append(cardParent,"gitCard","",{});
    var header = append(card,"header","",{});
    var inner  = append(card,"inner" ,"",{});
    var footer = append(card,"footer","",{});
    return [header,inner,footer];

}
function appendGitCard(json) {
    [header,inner,footer] = appendCard(cardList);
    var name = json.name.split("-").join(" ").replace("curse github","curse-github")
    append(header,"a",name,{
        style: "text-decoration: none;",
        href: json.html_url, target: "_blank"
    });

    inner.setAttribute("onclick","this.parentElement.setAttribute('show',this.parentElement.getAttribute('show') != 'true');")
    append(inner,"img","",{
        src: "https://raw.githubusercontent.com/" + json.full_name + "/" + json.default_branch + "/Preview.png",
        onerror: "setAltImg(this);", draggable: "false"
    });
    var hpLink = json.homepage;
    if (hpLink != null && hpLink != "") {
        var link = append(footer,"a","",{
            class:"link-homepage",
            href:hpLink, target: "_blank"
        }); append(link,"img","",{
            class:"link-homepage",
            src:"link.png", draggable:"false"
        }); link.innerHTML += hpLink.replace("https://","");
    }
    append(footer,"div",((json.description != null && json.description != "") ? "\"" + json.description + "\"" : ""),{});
    return [header,inner,footer];
}
function appendUserCard(json) {
    [header,inner,footer] = appendCard(cardList);
    append(header,"a",json.name,{
        style: "text-decoration: none;",
        href: json.html_url, target: "_blank"
    });

    inner.setAttribute("onclick","this.parentElement.setAttribute('show',this.parentElement.getAttribute('show') != 'true');")
    append(inner,"img","",{
        src: json.avatar_url, draggable: "false",
        onerror: "setAltImg(this);", alt:"pfPic"
    });
    var hpLink = json.homepage;
    if (json.blog != null && json.blog != "") {
        var link = append(footer,"a","",{
            class:"link-homepage",
            href:hpLink, target: "_blank"
        }); append(link,"img","",{
            class:"link-homepage",
            src:"link.png", draggable:"false"
        }); link.innerHTML += json.blog.replace("https://","");
    }
    //<a href = "mailto: abc@example.com">Send Email</a>
    append(footer,"div",((json.bio != null && json.bio != "") ? "\"" + json.bio + "\"" : ""),{});
    return [header,inner,footer];
}
async function run() {
    cardList = await document.querySelector("#cardList");
    appendUserCard(await fetchJsonPromise("https://api.github.com/users/" + USER));
    json = await fetchJsonPromise("https://api.github.com/users/" + USER + "/repos");
    for(var i = 0; i < json.length; i++) {
        appendGitCard(json[i]);
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
        if (entry.isIntersecting) { document.querySelector("letterContainer").setAttribute("animate",true ); }
        else {                      document.querySelector("letterContainer").setAttribute("animate",false); }
    });
});
//#endregion
window.onload = () => {
    run();
    observer.observe(document.querySelector("navbar"));
}