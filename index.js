/*
 * primary file for the API
 */

// Dependencies
const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./lib/config')
const fs = require('fs')
const handlers = require('./lib/handlers')
const helpers = require('./lib/helpers')

// TODO Get rid of this
helpers.sendTwilioSms('720599174', 'Hello! testing joy', function (err) {
  console.log('this was the error', err)
})

//  instantiate the http server
const httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res)
})
// Start the server
httpServer.listen(config.httpPort, function () {
  console.log(`The server is listening on port ${config.httpPort} in ${config.envName} mode`)
})

//  instantiate the http server
let httpsServerOption = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
}
const httpsServer = https.createServer(httpsServerOption, function (req, res) {
  unifiedServer(req, res)
})

// Start the server
httpsServer.listen(config.httpsPort, function () {
  console.log(`The server is listening on port ${config.httpsPort} in ${config.envName} mode`)
})

// server for both http and https
let unifiedServer = function (req, res) {
  // Get the url and parse it
  let parsedUrl = url.parse(req.url, true)
  // Get the path
  let path = parsedUrl.pathname
  let trimmedPath = path.replace(/^\/+|\/+$/g, '')

  // Get the query string as an object
  let queryStringObject = parsedUrl.query

  //  Get the http method
  let method = req.method.toLowerCase()

  // Get the header as an object
  let headers = req.headers
  // Get the payload, if any
  let decoder = new StringDecoder('utf-8')
  let buffer = ''
  req.on('data', function (data) {
    buffer += decoder.write(data)
  })
  req.on('end', function () {
    buffer += decoder.end()

    // choose the handler this request should go to:
    let chosenHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handlers.notFound

    // construct the data object to send to the handler
    let data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer),
    }

    // Route the request to the handler specified in the router
    chosenHandler(data, function (statusCode, payload) {
      // use status code callback by the handler
      statusCode = typeof statusCode == 'number' ? statusCode : 200
      // use the payload called back by the handler
      payload = typeof payload == 'object' ? payload : {}
      // convert the payload to a string
      let payloadString = JSON.stringify(payload)
      //  return the response
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)
      // log  the request path
      console.log('Returning this response:', statusCode, payloadString)
    })
  })
}

let router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
  checks: handlers.checks,
}
