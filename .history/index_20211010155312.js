/*
 * primary file for the API
 */

// Dependencies
const http = require('http')

const server = http.createServer(function (req, res) {
  res.end('Hello world\n')
})

server.listen(3000, function () {
  console.log('The server is listing on 3000 now')
})
