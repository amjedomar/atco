const isObj = (val) => {
  return typeof val === 'object' && !(val instanceof Array);
}

module.exports = isObj;
