var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var compiler = require("compilex");

var app = express();
app.use(bodyParser());

app.use(express.static(path.join(__dirname, "public")));

var option = { stats: true };
compiler.init(option);
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/compilecode", function (req, res) {
  var code = req.body.code;
  var input = req.body.input;
  var inputRadio = req.body.inputRadio;
  var lang = req.body.lang;
  if (lang === "C" || lang === "C++") {
    if (inputRadio === "true") {
      var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
      compiler.compileCPPWithInput(envData, code, input, function (data) {
        if (data.error) {
          res.send(`<p>${data.error}</p>`);
        } else {
          res.send(`<p>${data.output}</p>`);
        }
      });
    } else {
      var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
      compiler.compileCPP(envData, code, function (data) {
        if (data.error) {
          res.send(`<p>${data.error}</p>`);
        } else {
          res.send(`<p>${data.output}</p>`);
        }
        //data.error = error message
        //data.output = output value
      });
    }
  }
  if (lang === "Python") {
    if (inputRadio === "true") {
      var envData = { OS: "windows" };
      compiler.compilePythonWithInput(envData, code, input, function (data) {
        if (data.error) {
          res.send(`<p>${data.error}</p>`);
        } else {
          res.send(`<p>${data.output}</p>`);
        }
      });
    } else {
      var envData = { OS: "windows" };
      compiler.compilePython(envData, code, function (data) {
        if (data.error) {
          res.send(`<p>${data.error}</p>`);
        } else {
          res.send(`<p>${data.output}</p>`);
        }
      });
    }
  }
});

app.get("/fullStat", function (req, res) {
  compiler.fullStat(function (data) {
    res.send(data);
  });
});

app.listen(8080);

compiler.flush(function () {
  console.log("All temporary files flushed !");
});
