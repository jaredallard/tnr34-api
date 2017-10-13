/**
 * A simple page scrapper-to-API for rule34.paheal.net
 *
 * @license MIT
 * @author Jared Allard <jaredallard@outlook.com> (attach your public PGP key, please.)
 **/

'use strict';

const fs      = require('fs');
const jsdom   = require("jsdom");
const cors    = require('cors');
const express = require('express');
const jquery  = require('jquery')
const debug   = require('debug')('tnr34')

/* init the api */
const app       = express();
const { JSDOM } = jsdom;

/* addons */
app.use(cors());

app.get('/search/:term/:page', (req, res) => {
  const term = req.params.term
  const page = req.params.page

  /* failsafe */
  if (!term || term == '' || term == ' ') {
    return res.send({
      success: false,
      message: "No term given"
    })
  }

  const url = `http://rule34.paheal.net/post/list/${term}/${page}`

  debug('get', url)

  // define the images table.
  const images = [];
  const dom = new JSDOM(``, {
    url: url,
    refferer: 'http://rule34.paheal.net',
    resources: 'usable',
    contentType: 'text/html',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
  })

  const window = dom.window
  const $ = jquery(window)

  console.log($('html').html())

  $("a:contains('Image Only')").each((k,v) => {
    debug('image-add', v.href)
    images.push(v.href);
  });

  // free the memory.
  window.close()

  /* send the table of images found */
  res.send({
    success:true,
    images: []
  })
});

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
