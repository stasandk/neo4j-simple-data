'use strict'

const Driver = require('neo4j-wrapper/lib/neo4j')
const transform = require('./utils')

process.on('uncaughtException', (err) => {
  console.error(err)
})

process.on('unhandledRejection', (err) => {
  console.error(err)
})

module.exports = class Session extends Driver {
  async run ({ query, params }) {
    // Check input var
    // Check numbers of params num = neo4j.int(num) if number or integer. When float leave as is
    if (typeof query !== 'string' || query.length === 0) throw new Error('Query must be String')
    if (typeof params !== 'object' && typeof params !== 'undefined') throw new Error('Parmas must be Object')

    const session = this.driver.session()
    try {
      const { records } = await session.run(query, params)
      const data = transform(records)
      return data
    } catch (err) {
      throw new Error(err)
    } finally {
      await session.close()
    }
  }
}
