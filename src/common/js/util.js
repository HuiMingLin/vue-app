export function isDef(val) {
  return val != null || val !== "" || val !== "null";
}

export function getEN(start, end) {
  var arr = [];

  for (var i = start; i < end; i++) {
    arr.push(String.fromCharCode(i));
  }

  return arr;
}

export function getRange(start, end) {
  var arr = [];

  for (var i = start; i < end; i++) {
    arr.push(i);
  }

  return arr;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function shuffle(arr) {
  let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i);
    // console.log(i, j);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}

export function debounce(func, delay) {
  let timer;

  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
