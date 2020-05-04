const isArray = (val) => {
  return typeof val === 'object' && val instanceof Array;
}

module.exports = isArray;
