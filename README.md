# neo4j-simple-data

Neo4j simple wrapper that returns normalized data.

## Install

```
$ npm install neo4j-simple-data
```

## Usage
```js
const { Session } = require('neo4j-simple-data')

const connection = {
  host: '127.0.0.1',
  user: 'neo4j',
  password: 'neo4j',
  port: 7687
}

const options = {
  maxConnectionLifetime: 1 * 60 * 10 * 1000, // 1 hour
  maxConnectionPoolSize: 100,
  connectionAcquisitionTimeout: 1 * 60 * 1000, // 60 seconds
  connectionTimeout: 20 * 1000, // 20 seconds
  maxTransactionRetryTime: 15 * 1000 // 15 seconds
}

const session = new Session({ connection, options })

// Export session to run queries outside this file
module.exports = session

// Or run query in the same file
async function run () {
  try {
    await session.run({ query: 'CREATE (n:Car {name: $name, model: $model})', params: { name: 'Audi', model: 'A3'} })
    const data = await session.run({ query: 'MATCH (c:Car) RETURN c AS car' })
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}

run()
```

## Options
- **maxConnectionLifetime:** Pooled connections older than this threshold will be closed and removed from the pool. The actual removal happens during connection acquisition so that the new session returned is never backed by an old connection. Setting this option to a low value will cause a high connection churn, and can result in a performance drop. It is recommended to pick a value smaller than the maximum lifetime exposed by the surrounding system infrastructure (such as operating system, router, load balancer, proxy and firewall). Negative values result in lifetime not being checked. ***Default value: 1 hour.***

- **maxConnectionPoolSize:** This setting defines the maximum total number of connections allowed, per host, to be managed by the connection pool. In other words, for a direct driver, this sets the maximum number of connections towards a single database server. For a routing driver this sets the maximum amount of connections per cluster member. If a session or transaction tries to acquire a connection at a time when the pool size is at its full capacity, it must wait until a free connection is available in the pool or the request to acquire a new connection times out. The connection acquiring timeout is configured via ConnectionAcquisitionTimeout. ***Default value: This is different for different drivers, but is a number in the order of 100.***

- **connectionAcquisitionTimeout:** This setting limits the amount of time a session or transaction can spend waiting for a free connection to appear in the pool before throwing an exception. The exception thrown in this case is ClientException. Timeout only applies when connection pool is at its max capacity. ***Default value: 60 seconds.***

- **connectionTimeout:** To configure the maximum time allowed to establish a connection, pass a duration value to the driver configuration. ***Default value: 20 seconds.***

- **maxTransactionRetryTime:** To configure retry behavior, supply a value for the maximum time in which to keep attempting retries of transaction functions. ***Default value: 15 seconds.***