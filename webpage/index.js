const gridSize = [67,29];
const innerSize = 15;
const border = 3;
const margin = 2;
const fontSize = 15;

const outerSize = innerSize+2*border;

function getColorPair(d,day) {
    if (data[d.id] == null) { return [[0,0,0],[0,0,0]]; }
    const profit = data[d.id][day]
    if (profit == null) { return [[0,0,0],[0,0,0]]; }
    if (profit >= 0) {
        var dat = map(profit/highSale,0,1,32,251);
        return [ [dat/3, dat, dat/3], [dat/6, dat/2, dat/6] ]
    } else {
        var dat = map(profit/lowestLoss,0,1,32,251);
        return [ [dat, dat/3, dat/3], [dat/2, dat/6, dat/6] ]
    }
}
function getProfitStr(id,day) {
    if (data[id] == null || data[id][day] == null) { return "$0"; }
    return ((data[id][day] < 0)?("-$"+Math.abs(data[id][day])):("$"+data[id][day]));
}
startDay = firstDay+(1000*60*60*24)*28;//28 days after the first day
var curDay = startDay;
async function update(day) {
    curDay = day;
    var dtSplt=new Date(day).toISOString().slice(0,10).split("-");
    var dayStr = Number(dtSplt[1]) + "/" + Number(dtSplt[2]) + "/" + Number(dtSplt[0])%100
    document.querySelector("svg").innerHTML = "";
    var svg = d3.select("svg");
    var selectRect = svg.selectAll("rect").data(layout).enter();
    appendSquare({
        parent:selectRect, id:(d)=>{return d.id;},
        size:innerSize+border, fill:(d)=>{return "rgb(" + getColorPair(d,dayStr)[1].join(",") + ")"},
        x:(d)=> d.pos[0]*(outerSize+margin)+margin,
        y:(d)=> d.pos[1]*(outerSize+margin)+margin,
        text:(d)=> d.id
    });
    appendSquare({
        parent:selectRect, id:(d)=> d.id,
        size:innerSize, fill:(d)=> "rgb(" + getColorPair(d,dayStr)[0].join(",") + ")",
        x:(d)=> d.pos[0]*(outerSize+margin)+margin+(border/2),
        y:(d)=> d.pos[1]*(outerSize+margin)+margin+(border/2),
        title:(d)=> d.title + getProfitStr(d.id,dayStr)
    });
    document.querySelector("#day").innerHTML = dayStr;
}
window.onload = async function f(){
    await onfinish();
    svg = d3.select("#container").append("svg")
        .attr("width",gridSize[0]*outerSize + (gridSize[0]+1)*margin)
        .attr("height",gridSize[1]*outerSize + (gridSize[1]+1)*margin);
    d3.select("#container").append("input")
        .attr("type","range")
        .attr("min",firstDay)
        .attr("max",lastDay+dayStep)
        .attr("step",1000*60*60*24)// one day
        .attr("value",curDay)
        .on("input",(d,i)=>update(Number(this.value)))
        .style("width",(gridSize[0]*outerSize + (gridSize[0]+1)*margin) + "px");
    d3.select("#container").append("div")
        .attr("id","frstDy")
        .style("color","white")
        .text(frstDyStr);
    d3.select("#container").append("input")
        .attr("type","button")
        .attr("value","<")
        .on("click",(d,i)=>update(curDay-1000*60*60*24))
    var dtSplt=new Date(curDay).toISOString().slice(0,10).split("-");
    d3.select("#container").append("div")
        .attr("id","day")
        .style("color","white")
        .text(Number(dtSplt[1]) + "/" + Number(dtSplt[2]) + "/" + Number(dtSplt[0])%100);
    d3.select("#container").append("input")
        .attr("type","button")
        .attr("value",">")
        .on("click",(d,i)=>update(curDay+1000*60*60*24))
    d3.select("#container").append("div")
        .attr("id","lstDy")
        .style("color","white")
        .text(lstDyStr);
        
    update(curDay);
}