export const getCount = (count) => {
  if (count < 0) return;
  if (count < 10000) return count;
  else if (Math.floor(count / 10000) < 10000)
    return Math.floor(count / 1000) / 10 + "万";
  else return Math.floor(count / 10000000) / 10 + "亿";
};

/**
 *
 * @param {Function} fn - function to execute
 * @param {Number} wait - time to wait, in seconds
 * @returns {Function} debounced function
 */
export function debounce(fn, wait) {
  let timmer = null;
  return function (...args) {
    let context = this;
    if (timmer) clearTimeout(timmer);
    timmer = setTimeout(function () {
      fn.apply(context, args);
    }, wait * 1000);
  };
}

export const isEmptyObject = (obj) => !obj || Object.keys(obj).length === 0;
