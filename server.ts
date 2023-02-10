const express = require("express");
import * as fs from "fs";

var app:any = express();
var pages:{[key:string]:any} = {
    "/index.html":(req:any, res:any, send:any) => {send();},
    "/index.css":(req:any, res:any, send:any) => {send();},
    "/index.js":(req:any, res:any, send:any) => {send();},
    "/letterAnim.css":(req:any, res:any, send:any) => {send();}
}
Object.keys(pages).forEach((i) => {
    app.get(i, (req:any, res:any) => {
        pages[i](req, res, () => { res.sendFile(__dirname + i, "utf8"); });
    });
});
["/favicon.ico"].forEach((i) => { app.get(i, (req:any, res:any) => { res.sendFile(__dirname + i, "utf8"); }); });
app.get("*", (req:any, res:any) => { res.redirect("/index.html"); });
var server:any = app.listen(80, function () {
    var host:string = server.address().address;
    var port:number = server.address().port;
    console.clear();
    console.log("Public web execution page is running at http://localhost:" + port);
});