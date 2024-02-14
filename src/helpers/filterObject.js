export const removeNullKeys = obj => {
  Object.keys(obj).forEach(key => {
    if (obj[key] === null) {
      delete obj[key]
    }
  })

  return obj
}
