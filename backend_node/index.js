const app = require("express")();
const express = require("express");
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");
const io = require("socket.io")(server);
const port = 8082;

app.use(express.urlencoded({ extended: false }));

let issueRouter = require("./routes/issue");

app.use(bodyParser.json());
 
app.use(cors());

app.use("/issue", issueRouter);

console.log("hola buenas")


server.listen(port)


io.on('connection', (newSocket) => {
    console.log("nueva conexion: ",newSocket.id)

})


//module.exports = {io}