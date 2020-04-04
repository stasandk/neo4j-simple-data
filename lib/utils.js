const value = (val) => {
  if (val.properties) {
    val.properties.id = val.identity
    return val.properties
  }
  return val
}

const transform = (nodes) => {
  return nodes.map(node => {
    return node.keys.reduce((acc, key, idx) => {
      acc[key] = value(node._fields[idx])
      return acc
    }, {})
  })
}

module.exports = transform
