const express = require("express")
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 8080

//config view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get("/", (req, res) => {
    res.render("home.ejs");
})

app.get("/hoidanit", (req, res) => {
    res.send("Hello Hieu")
})

app.get("/abc", (req, res) => {
    res.send("Hello abc")
})

app.listen(process.env.PORT, () => {
    console.log("My app is running ok")
    console.log(`env port: ${process.env.PORT}`)
})