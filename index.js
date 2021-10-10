/*
 * primary file for the API
 */

// Dependencies
const http = require('http')
const url = require('url')

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

  // Send the response
  res.end('Hello world\n')
  // log  the request path
  console.log('Request received with these header', headers)
})
// Start the server, and have it listen to port 3000
server.listen(3000, function () {
  console.log('The server is listing on 3000 now')
})
