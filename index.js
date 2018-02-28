let request = require('request')

/**
 * Returns a client to connect to the GRAKN REST API. Exposes several endpoints and functions.
 * @param options {Object} - Object with options as:
 *   - keyspace {String} - Keyspace in the GRAKN DB to use, default to use in environment variable GRAKN_KEYSPACE or 'grakn'.
 *   - host {String} - Hostname where the GRAKN DB is allocated, default as env variable GRAKN_HOST or 'localhost'.
 *   - port {Number} - Port to connect to the GRAKN DB, default as env variable GRAKN_PORT or 4567.
 *   - protocol {String} - Protocol to use, could be 'http' or 'https'. Default depends on NODE_ENV: 'production': https, and anything else: http.
 */
module.exports = (options) => {
  /* Format options */
  if (!options || typeof options !== 'object') options = {}
  options.keyspace = options.keyspace || process.env.GRAKN_KEYSPACE || 'grakn'
  options.hostname = options.hostname || process.env.GRAKN_HOST || 'localhost'
  options.port = Number(options.port) || process.env.GRAKN_PORT || 4567
  options.protocol = (options.protocol === 'http' || options.protocol === 'https' ? options.protocol : (process.env.NODE_ENV === 'production' ? 'https' : 'http'))
  /* Create base request */
  request = request.defaults({
    baseUrl: `${options.protocol}://${options.hostname}:${options.port}/`,
    headers: {
      Accept: 'application/graql+json'
    }
  })
  /* Return object with endpoints of the API as functions */
  return {
    /**
     * Execute a GRAQL query on the grakn server.
     * @param query {String} - GRAQL query to be executed.
     */
    execute: (query) => {
      return new Promise((resolve, reject) => {
        request.post({
          url: `kb/${options.keyspace}/graql`,
          body: query
        }, (err, res) => {
          if (err) return reject(err)
          return resolve(JSON.parse(res.body))
        })
      })
    },
    /**
     * Returns all the keyspaces that are in the GRAKN DB with the routes and names. Something as:
     * [{
        'rules': '/kb/grakn/rule',
        'types': '/kb/grakn/type',
        'roles': '/kb/grakn/role',
        'graql': '/kb/grakn/graql',
        'name': 'grakn',
        '@id': '/kb/grakn'
     * }]
     */
    getKeyspaces: () => {
      return new Promise((resolve, reject) => {
        request.get({url: 'kb'}, (err, res) => {
          if (err) return reject(err)
          if (res.statusCode !== 200) return reject(new Error(`Code: ${res.statusCode}. Response body: ${res.body}`))
          return resolve(JSON.parse(res.body).keyspaces)
        })
      })
    },
    /**
     * Returns the json that the response has in the body fot the given url called with the GET method.
     * @param url {String}
     * @returns {Promise}
     */
    get: url => {
      return new Promise((resolve, reject) => {
        request.get({url}, (err, res) => {
          if (err) return reject(err)
          return resolve(JSON.parse(res.body))
        })
      })
    }
  }
}
