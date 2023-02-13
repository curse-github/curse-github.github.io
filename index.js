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
async function run() {
    var json = await fetchJsonPromise("https://api.github.com/users/curse-github/repos");
    for(var i = 0; i < json.length; i++) {
        var cardlist = append(document.getElementById("cardList"),"div","",{
            class:"cardParent",
            onclick:"var child = this.children[0]; child.setAttribute('show',child.getAttribute('show') != 'true');"
        })
        var card = append(cardlist,"card","",{});
        
        var header = append(card,"header","",{});
        append(header,"a",json[i].name.split("-").join(" ").replace("curse github","curse-github"),{
            target:"_blank",
            href:json[i].html_url,
            style:"text-decoration: none;"
        });

        var inner  = append(card,"inner" ,"",{});
        append(inner,"img","",{
            src:"https://raw.githubusercontent.com/" + json[i].full_name + "/" + json[i].default_branch + "/Preview.png",
            onerror:"setAltImg(this);",
            draggable:"false"
        });
        
        var footer = append(card,"footer","",{});
        if (json[i].homepage != null && json[i].homepage != "") {
            var link = append(footer,"a","",{
                class:"link-homepage",
                href:json[i].homepage
            }); append(link,"img","",{
                class:"link-homepage",
                src:"link.png", draggable:"false"
            }); link.innerHTML += json[i].homepage.replace("https://","");
        }
        append(footer,"div","\"" + json[i].description + "\"",{});
    }
}
run();
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
setTimeout(() => {  observer.observe(document.querySelector("navbar"));  }, 100);
//#endregion