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
        var card = append(append(document.getElementById("cardList"),"div","",{class:"cardParent"}),"card","",{});
        
        var header = append(card,"header","",{});
        append(header,"a",json[i].name,{
            target:"_blank",
            href:json[i].html_url,
            style:"text-decoration: none;"
        });

        var inner  = append(card,"inner" ,"",{});
        append(inner,"img","",{
            src:"https://raw.githubusercontent.com/" + json[i].full_name + "/" + json[i].default_branch + "/Preview.png",
            alt:"github-logo.png"
        });
        
        var footer = append(card,"footer","",{});
        append(footer,"input","",{
            type:"button",
            value:"v",
            onclick:"var parent = this.parentNode.parentNode; parent.setAttribute('show',parent.getAttribute('show') != 'true'); this.value = ((this.value == 'v') ? '^' : 'v');",
        });
        append(footer,"hide",json[i].description,{});
    }
}
run();
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