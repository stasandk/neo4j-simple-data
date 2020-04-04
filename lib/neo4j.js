'use strict'

const neo4j = require('neo4j-driver')

// Default connection values
const defaultConnection = {
  host: '127.0.0.1',
  user: 'neo4j',
  password: 'password',
  port: 7687
}

const defaultOptions = {
  disableLosslessIntegers: false,
  maxConnectionLifetime: 1 * 60 * 10 * 1000, // 1 hour
  maxConnectionPoolSize: 100,
  connectionAcquisitionTimeout: 1 * 60 * 1000, // 60 seconds
  connectionTimeout: 20 * 1000, // 20 seconds
  maxTransactionRetryTime: 15 * 1000 // 15 seconds
}

module.exports = class Driver {
  constructor ({ connection, options }) {
    // Neo4j connection
    this.connection = connection || defaultConnection

    // Neo4j Options
    this.options = options || defaultOptions

    this.connect()

    this.driver.verifyConnectivity().catch(() => {
      throw new Error('Neo4j connection error')
    })
  }

  connect () {
    this.driver = neo4j.driver(
      `neo4j://${this.connection.host}:${this.connection.port}`,
      neo4j.auth.basic(this.connection.user, this.connection.password),
      this.options
    )
  }
}
