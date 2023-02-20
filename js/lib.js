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
function map(input, inputStart,inputEnd, outputStart,outputEnd) {
    const output = outputStart + ((outputEnd - outputStart) / (inputEnd - inputStart)) * (input - inputStart);
    return output;
}
function appendRect(data) {
    var rect = data.parent.append("rect")
        .attr("width",data.width).attr("height",data.height)
        .attr("id",data.id).attr("fill",data.fill)
        .attr("x",data.x).attr("y",data.y)
    rect.append("svg:title").text(data.title);
    return rect;
}
function appendSquare(data) {
    return appendRect({
        parent:data.parent, id:data.id,
        width:data.size, height:data.size,
        fill:data.fill,
        x:data.x, y:data.y,
        title:data.title
    });
}