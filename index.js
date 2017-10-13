/**
 * A simple page scrapper-to-API for rule34.paheal.net
 *
 * @license MIT
 * @author Jared Allard <jaredallard@outlook.com> (attach your public PGP key, please.)
 **/

'use strict';

const fs      = require('fs');
const jsdom   = require('jsdom');
const cors    = require('cors');
const express = require('express');

/* init the api */
const app     = express();

/* addons */
app.use(cors());

app.get('/jq', (req, res) => {
  /* hacky method to return jq */
  res.sendFile("jq.js", {
    root: "./"
  });
})

app.get('/search/:term/:page', (req, res) => {
  const term = req.params.term
  const page = req.params.page

  /* failsafe */
  if (!term || term === '') {
    return res.send({
      success: false,
      message: "No term given"
    })
  }

  // define the images table.
  const images = [];
  jsdom.env(
    "http://rule34.paheal.net/post/list/"+term+"/"+page,
    ["http://127.0.0.1:3000/jq"],
    (errors, window) => {
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

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
