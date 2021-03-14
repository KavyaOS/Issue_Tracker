/* eslint linebreak-style: ["error","windows"] */
/* global db print */
/* eslint no-restricted-globals: "off" */
const express = require('express')
const app = express();
require('dotenv').config();

const proxy = require('http-proxy-middleware');

app.use(express.static('public'));

const apiProxyTarget = process.env.API_PROXY_TARGET;
if(apiProxyTarget) {
    app.use('/graphql', proxy({ target: apiProxyTarget}))
}

const UI_API_ENDPOINT = process.env.UI_API_ENDPOINT || 'http://localhost:3001/graphql';
const env = { UI_API_ENDPOINT };

app.get('/env.js', function(req, res) {
    res.send(`window.ENV = ${JSON.stringify(env)}`)
})

const port = process.env.UI_SERVER_PORT || 8001;
app.listen(port,function(){
    console.log(`UI started on port ${port}`);
});