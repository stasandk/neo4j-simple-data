import Driver from './services/neo4j'
import { normalize } from './utils'

process.on('uncaughtException', (err) => {
  console.error(err)
})

process.on('unhandledRejection', (err) => {
  console.error(err)
})

export class Session extends Driver {
  async run ({ query, params }) {
    // Check input var
    // Check numbers of params num = neo4j.int(num) if number or integer. When float leave as is
    if (typeof query !== 'string' || query.length === 0) throw new Error('Query must be String')
    if (typeof params !== 'object' && typeof params !== 'undefined') throw new Error('Parmas must be Object')

    const session = this.driver.session()
    try {
      const resp = await session.run(query, params)
      const data = normalize(resp.records)
      return data
    } catch (err) {
      throw new Error(err)
    } finally {
      await session.close()
    }
  }
}
