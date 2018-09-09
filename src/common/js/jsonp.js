import originJSONP from "jsonp";
import { isDef } from "common/js/util.js";

export default function(url, data, option) {
  url += (url.indexOf("?") < 0 ? "?" : "&") + param(data);

  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function param(data) {
  let url = "";
  for (let k in data) {
    let value = isDef(data[k]) ? data[k] : "";
    url += `&${k}=${encodeURIComponent(value)}`;
  }

  return url ? url.substring(1) : "";
}
