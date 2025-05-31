const { has } = require('lodash');

function deepFreeze(obj) {
  // First freeze the top-level object
  Object.freeze(obj);

  // Iterate through object's properties
  const objKeys = Object.keys(obj);
  for (let index = 0; index < objKeys.length; index += 1) {
    const key = objKeys[index];

    if (
      has(obj, key) &&
      typeof obj[key] === 'object' &&
      !Object.isFrozen(obj[key])
    ) {
      deepFreeze(obj[key]);
    }
  }

  return obj;
}

module.exports = deepFreeze;
