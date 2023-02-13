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
function appendCard(parent, name, html_url, imagelink, hpLink, description) {
    var card = append(parent,"div","",{
        class:"gitCard",
        onclick:"this.setAttribute('show',this.getAttribute('show') != 'true');"
    });
    
    var header = append(card,"header","",{});
    append(header,"a",name,{
        target:"_blank",
        href:html_url,
        style:"text-decoration: none;"
    });

    var inner  = append(card,"inner" ,"",{});
    append(inner,"img","",{
        src:imagelink,
        onerror:"setAltImg(this);",
        draggable:"false"
    });
    
    var footer = append(card,"footer","",{});
    if (hpLink != null && hpLink != "") {
        var link = append(footer,"a","",{
            class:"link-homepage",
            href:hpLink
        }); append(link,"img","",{
            class:"link-homepage",
            src:"link.png", draggable:"false"
        }); link.innerHTML += hpLink.replace("https://","");
    }
    append(footer,"div",((description != null && description != "") ? "\"" + description + "\"" : ""),{});
    return card;

}
//#region github cards
async function run() {
    const USER = "curse-github";
    const cardList = document.querySelector("#cardList");
    
    var cardParent = append(cardList,"cardParent","",{});
    var json = await fetchJsonPromise("https://api.github.com/users/" + USER);
    var card = {
        parent: cardParent,
        name: json.name,
        html_url: json.html_url,
        imagelink: json.avatar_url,
        hpLink: json.blog,
        description: json.bio
    };
    var cardElement = appendCard(card.parent,card.name,card.html_url,card.imagelink,card.hpLink,card.description);
    cardElement.children[1].children[0].setAttribute("alt","pfPic");
    json = null;

    json = await fetchJsonPromise("https://api.github.com/users/" + USER + "/repos");
    for(var i = 0; i < json.length; i++) {
        var cardParent = append(cardList,"cardParent","",{});
        var card = {
            parent: cardParent,
            name: json[i].name.split("-").join(" ").replace("curse github","curse-github"),
            html_url: json[i].html_url,
            imagelink: "https://raw.githubusercontent.com/" + json[i].full_name + "/" + json[i].default_branch + "/Preview.png",
            hpLink: json[i].homepage,
            description: json[i].description
        };
        appendCard(card.parent,card.name,card.html_url,card.imagelink,card.hpLink,card.description);
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