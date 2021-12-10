/*
 * primary file for the API
 */

const server = require('./lib/server')
const workers = require('./lib/workers')

// Declare the app
let app = {}

// Init function
app.init = function () {
  // Start the server
  server.init()
  // start the workers
  // workers.init()
}

// Execute
app.init()

// Export the app

module.exports = app
