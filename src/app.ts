const express = require("express")
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 8080

app.get("/", (req, res) => {
    res.send("Hello World nodemon")
})

app.get("/hoidanit", (req, res) => {
    res.send("Hello Hieu")
})

app.listen(process.env.PORT, () => {
    console.log("My app is running ok")
    console.log(`env port: + ${process.env.PORT}`)
})