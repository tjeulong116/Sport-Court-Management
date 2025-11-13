const express = require("express")
const app = express()
const PORT = 8080

app.get("/", (req, res) => {
    res.send("Hello World nodemon")
})

app.get("/hoidanit", (req, res) => {
    res.send("Hello Hieu")
})

app.listen(PORT, () => {
    console.log("My app is running ok")
})