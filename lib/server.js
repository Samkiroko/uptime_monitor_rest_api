/**
 * Server-related tasks
 * */
// Dependencies
const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./config')
const fs = require('fs')
const handlers = require('./handlers')
const helpers = require('./helpers')
const path = require('path')

// Instantiate the server module object
let server = {}

//  instantiate the http server
server.httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res)
})

//  instantiate the http server
server.httpsServerOption = {
  key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
}
server.httpsServer = https.createServer(
  server.httpsServerOption,
  function (req, res) {
    server.unifiedServer(req, res)
  }
)

// server for both http and https
server.unifiedServer = function (req, res) {
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
    let chosenHandler =
      typeof server.router[trimmedPath] !== 'undefined'
        ? server.router[trimmedPath]
        : handlers.notFound

    // construct the data object to send to the handler
    let data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer)
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

server.router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
  checks: handlers.checks
}

// Init script
server.init = function () {
  // start the http server

  server.httpServer.listen(config.httpPort, function () {
    console.log(`The server is listening on port ${config.httpPort}`)
  })
  // Start the Http sever
  server.httpsServer.listen(config.httpsPort, function () {
    console.log(`The server is listening on port ${config.httpsPort} `)
  })
}

// Export the module
module.exports = server
