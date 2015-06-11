/**
 * A simple page scrapper-to-API for rule34.paheal.net
 *
 * @license MIT
 * @author Jared Allard <jaredallard@outlook.com> (attach your public PGP key, please.)
 **/

var fs      = require('fs');
var jsdom   = require('jsdom');
var cors    = require('cors');
var express = require('express');

/* init the api */
var app     = express();

/* addons */
app.use(cors());

app.get('/jq', function(req, res) {
  if (req.ip !== "::ffff:127.0.0.1") {
    res.send({
      success: false,
      message: "Access Denied"
    })
    return false
  }

  /* hacky method to return jq */
  res.sendFile("jq.js", {
    root: "./"
  });
})

app.get('/search/:term/:page', function (req, res) {
  var term = req.params.term
  var page = req.params.page

  /* failsafe */
  if (term === undefined || term === '') {
    res.send({
      success: false,
      message: "No term given"
    });

    return false;
  }

  // define the images table.
  var images = [];
  jsdom.env(
    "http://rule34.paheal.net/post/list/"+term+"/"+page,
    ["http://127.0.0.1:3000/jq"],
    function(errors, window) {
      if (errors) {
        console.log(errors)
        res.send({
          success:false,
          message: "An error occured."
        })

        // return false
        return false;
      }

      window.$("a:contains('Image Only')").each(function(key, value) {
      	images.push(value.href);
      });

      // free the memory.
      window.close()

      /* send the table of images found */
      res.send({
        success:true,
        images: images
      })
    }
  )
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
