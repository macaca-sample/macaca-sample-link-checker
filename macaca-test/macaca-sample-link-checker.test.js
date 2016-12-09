'use strict';

const url = require('url');
const ipv4 = require('ipv4');
const urllib = require('urllib');
const _ = require('macaca-utils');

const wd = require('webdriver-client')({
  platformName: 'desktop',
  browserName: 'electron' || 'chrome'
});

describe('macaca desktop sample', function() {
  this.timeout(5 * 60 * 1000);

  const driver = wd.initPromiseChain();
  const initialURL = `file://${__dirname}/test.html`;
  const serverURL = `http://${ipv4}:5678`;

  console.log(initialURL)

  before(() => {
    return driver
      .initDriver()
      .maximize()
      .setWindowSize(1280, 800);
  });

  it('deadlink check', function() {
    return driver
      .get(initialURL)
      .source()
      .then(html => {
        var anchors = html.match(/href=\"(.+)\"/g);
        var queue = [];

        anchors.map(anchor => {
          var _url = url.resolve(`${serverURL}/macaca-test/`, anchor.split('"')[1]);
          var p = new Promise(resolve => {
            urllib.request(_url, (err, data, res) => {
              if (err) {
                throw err; // you need to handle error
              }
              resolve({
                statusCode: res.statusCode,
                anchor: anchor
              });
            });
          });
          queue.push(p);
        });
        return Promise.all(queue)
          .then(res => {
            console.log('Links number: %s', res.length);
            var d = _.filter(res, d => {
              return d.statusCode === 200;
            });
            console.log('Bad links number: %s', res.length - d.length);
          });
      });
  });

  after(() => {
    return driver
      .quit();
  });
});
