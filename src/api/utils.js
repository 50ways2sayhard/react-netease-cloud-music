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

export const getName = (list) => {
  let str = "";
  list.forEach((item, idx) => {
    str += idx === 0 ? item.name : "/" + item.name;
  });
  return str;
};

const elementStyle = document.createElement("div").style;
const vendor = (() => {
  const transformNames = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    0: "0Transform",
    ms: "msTransform",
    standard: "Transform",
  };
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) return key;
  }
  return false;
})();

export function prefixStyle(style) {
  if (vendor === false) return false;
  if (vendor === "standard") return style;
  return vendor + style.charAt(0).toUpperCase() + style.substring(1);
}

export function getSongUrl(id) {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
}

export function formatPlayTime(interval) {
  const intv = interval | 0;
  const minute = (intv / 60) | 0;
  const second = (intv % 60).toString().padStart(2, "0");
  return `${minute}:${second}`;
}
