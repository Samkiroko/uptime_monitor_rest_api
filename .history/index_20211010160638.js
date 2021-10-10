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

  res.end('Hello world\n')
})
// Start the server, and have it listen to port 3000
server.listen(3000, function () {
  console.log('The server is listing on 3000 now')
})
