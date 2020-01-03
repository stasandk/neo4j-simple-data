const subnode = (arr) => {
  if (typeof arr === 'string') return arr
  if (Array.isArray(arr)) return arr.map(val => val.properties)
  return arr.properties
}

export const normalize = (records) => {
  // Check if it's a Array (I think always it will be an array)
  if (!Array.isArray(records)) throw new Error('Records it is not an array')

  // Build a object
  records = records.map(record => {
    const keys = record.keys
    const fields = record._fields

    return fields.reduce((prev, node, index) => {
      return {
        ...prev,
        [keys[index]]: subnode(node)
      }
    }, {})
  })

  // Return object if it's only one row or Array if it's more
  return records.length === 1 ? records[0] : records
}
