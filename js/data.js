
var resolves = [];
var finished = false;
function onfinish() {
    if (finished) { return new Promise((resolve)=>{resolve();return;}); }
    else { return new Promise((resolve)=>{resolves.push(resolve)}); }
}
function finish() {
    finished = true;
    resolves.forEach((resolve) => { resolve(); }); resolves = [];
}

var layout = [];
var data = [];
var highSale = 0;
var lowestLoss = 0;
var firstDay = 0;var frstDyStr = "";
var lastDay = 0;var lstDyStr = "";

fetchJsonPromise("http://localhost/Machine-reports.json").then((reports) => {
    var prevLoc = "";
    for(var i = 0; i < reports.length; i++) {
        const location = reports[i][5];
        if (location == prevLoc) continue;
        prevLoc = location;
        const locSplt = location.split("-");
        //if (locSplt[0].startsWith("C") && Number(locSplt[0].split("")[1]) < 5) {
        if(true) {
            const pos = [Number(locSplt[1]) - 1,Number(locSplt[2])-1];
            layout.push({
                id:reports[i][1],
                pos:pos,
                title:"id: " + reports[i][1] + "\npos: " + pos.join(", ") + "\nprofit: "
            });
        }
    }
    reportsByDay = [];
    for(var i = 0; i < reports.length; i++) {
        //add all data to "reportsByDay" array
        const date = reports[i][0];
        if (reportsByDay[date] == null) reportsByDay[date] = [];
        reportsByDay[date].push(reports[i]);
        //find first and last day in data set
        const parsed = Date.parse(reports[i][0]);
        if (firstDay == 0 || parsed < firstDay) { firstDay = parsed; frstDyStr = date; }
        if (parsed > lastDay                  ) { lastDay  = parsed; lstDyStr = date; }
        //find days with highest and lowerst profit
        const profit = sale = Number(reports[i][11].replace("\"","-"));
        if (profit > highSale) { highSale = profit; console.log(profit + ", " + date + ", " + reports[i][5])}
        if (profit < 0 && profit < lowestLoss) {lowestLoss = profit;}
    }
    Object.entries(reportsByDay).forEach(([day,reportsonDay]) => {
        if (reportsonDay == null) return;
        for (let i = 0; i < reportsonDay.length; i++) {
            //put all data in "data" array
            const profit = Number(reportsonDay[i][11].replace("\"","-"));
            if (data[reportsonDay[i][1]] == null) data[reportsonDay[i][1]] = [];
            data[reportsonDay[i][1]][day] = profit;
        }
    })
    finish();
});