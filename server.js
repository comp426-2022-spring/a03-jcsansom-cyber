const express = require('express');
const app = express();

const args = require("minimist")(process.argv.slice(2));
args["port"];
const port = args.port || process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',port))
});


app.get('/app/', (req, res) => {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.status(200);
  res.type('text/plain')
  res.send(res.statusCode + ' ' + res.statusMessage);
});

function coinFlip() {
    return Math.random() < 0.6 ? ("heads") : ("tails")
}

function countFlipsT(array) {
    let num_h = 0;
    let num_t = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] == "heads") {
        num_h += 1;
      }
      else {
        num_t += 1;
      }
    }
    return num_t
    /*if (num_h == 0) {
      return "{ tails: " + num_t + " }";
    }
    if (num_t == 0) {
      return "{ heads: " + num_h + " }";
    }
    return "{heads: " + num_h + ", tails: " + num_t + " }"*/
}

function countFlipsH(array) {
  let num_h = 0;
  let num_t = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] == "heads") {
      num_h += 1;
    }
    else {
      num_t += 1;
    }
  }
  return num_h
}

function flipACoin(call) {
    let flip = coinFlip();
    let ret = "";
    if (call == flip) {
      ret = "win";
    }
    else {
      ret = "lose";
    }
    return ret
  }

app.get('/app/flip/call/heads', (req, res) => {
    let call = coinFlip();
    let ret="";
    if (call == "heads") {
      ret = "win";
    }
    else {
      ret = "lose";
    }
    res.status(200);
    res.type("application/json")
    res.json({'call':'heads','flip':call,'result':ret});
});

app.get('/app/flip/call/tails', (req, res) => {
  let call = coinFlip();
  let ret="";
  if (call == "tails") {
    ret = "win";
  }
  else {
    ret = "lose";
  }
  res.status(200);
  res.type("application/json")
  res.json({'call':'tails','flip':call,'result':ret});
});

app.get('/app/flip/', (req, res) => {
    ret = coinFlip();
    res.status(200);
    res.type("application/json")
    res.json({'flip':ret});
});

app.get('/app/flips/:number', (req, res) => {
  const ret = [];
  for (let i = 0; i < req.params.number; i++) {
    ret[i] = coinFlip();
  }
  const num_t = countFlipsT(ret);
  const num_h = countFlipsH(ret);
  res.status(200);
  res.type("application/json")
  if (num_t == 0) {
    res.json({'raw': ret, 'summary': {'heads':num_h}});
  }
  else if (num_h == 0) {
    res.json({'raw': ret, 'summary': {'tails':num_t}});
  }
  else {
  res.json({'raw': ret, 'summary': {'tails':num_t, 'heads':num_h}});
  }
});

app.use(function(req, res){
    res.status(404).type("text/plain").send('404 NOT FOUND')
});