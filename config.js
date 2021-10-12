/**
 * Create and export configuration variables
 */

// Container for all the environments
const environments = {}

// Staging (default ) environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging',
}

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
}

//  Determine which environment was pass as a command-line argument
let currentEnvironment = typeof process.env.NODE_ENV == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

// check that the current environment is one of the environment above, if not default to staging
let environmentToExport =
  typeof environments[currentEnvironment] == 'object' ? environments[currentEnvironment] : environments.staging

// Export the module

module.exports = environmentToExport
