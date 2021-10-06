const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
var cors = require('cors');
const port = 8082;

var app = express();

var server = http.createServer(app);

require("./sockets").connect(server);

let issueRouter = require("./routes/issue");

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.use("/issue", issueRouter);

console.log("Servidor iniciado")

server.listen(port)

