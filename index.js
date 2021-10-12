/*
 * primary file for the API
 */

// Dependencies
const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

//  The sever should respond to all request with a string
const server = http.createServer(function (req, res) {
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
      payload: buffer,
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
})
// Start the server, and have it listen to port 3000
server.listen(3000, function () {
  console.log('The server is listing on 3000 now')
})

// Define a request router
let handlers = {}

// Sample handler
handlers.sample = function (data, callback) {
  // callback a http status code, and payload object
  callback(406, { name: 'sample handler' })
}

//  not found handler
handlers.notFound = function (data, callback) {
  callback(404)
}

let router = {
  sample: handlers.sample,
}
