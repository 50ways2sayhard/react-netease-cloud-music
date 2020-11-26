export const getName = (list) => {
  let str = "";
  list.forEach((item, idx) => {
    str += idx === 0 ? item.name : "/" + item.name;
  });
  return str;
};
