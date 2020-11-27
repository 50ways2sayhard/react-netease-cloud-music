function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1), min);
}

/**
 * 洗牌
 * @param {Array} arr
 * @returns {Array} 洗过牌的数组
 */
export function shuffle(arr) {
  const newArr = [];
  arr.forEach((i) => newArr.push(i));
  for (let i = 0; i < newArr.length; i++) {
    const j = getRandomInt(0, i);
    const t = newArr[i];
    newArr[i] = newArr[j];
    newArr[j] = t;
  }
  return newArr;
}

/**
 *
 * @param {Object} elem index to find with id
 * @param {Array} arr elem list
 */
export function findIndex(elem, arr) {
  return arr.findIndex((item) => elem.id === item.id);
}
