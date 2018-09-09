import jsonp from "common/js/jsonp.js";
import { commonParams, commonOptions } from "./config.js";
import { Api } from "api/api.js";

export const jsonpNameList = [
  "getUCGI7477804473912686",
  "getUCGI30199979643548414",
  "getUCGI7285685989647392",
  "getUCGI6995130999680044",
  "getUCGI33384612406603686",
  "getUCGI7281630967648212",
  "getUCGI6243563233170457",
  "getUCGI5846049215447153",
  "getUCGI24917193462979648",
  "getUCGI6824092334619316",
  "getUCGI5182209166648009",
  "getUCGI7141754621637528",
  "getUCGI9423751905931936",
  "getUCGI7718373272048327",
  "getUCGI5154490161584675",
  "getUCGI6894328919365542",
  "getUCGI31332641314743825",
  "getUCGI20104437292476418",
  "getUCGI4187008501445615",
  "getUCGI6662395098350904",
  "getUCGI28674832970886355",
  "getUCGI891434217278265",
  "getUCGI8194925716113526",
  "getUCGI8992457053116127",
  "getUCGI08042614738291265",
  "getUCGI7752873145936368",
  "getUCGI11739703290534753"
];

// export function getSingerList(index, jsonpName) {
//   const url = Api.singerList;

//   const data = Object.assign({}, commonParams, {
//     callback: jsonpName,
//     loginUin: 0,
//     hostUin: 0,
//     platform: "yqq",
//     needNewCode: 0,
//     data: JSON.stringify({
//       comm: { ct: 24, cv: 10000 },
//       singerList: {
//         module: "Music.SingerListServer",
//         method: "get_singer_list",
//         param: {
//           area: -100,
//           sex: -100,
//           genre: -100,
//           index: index,
//           sin: 0,
//           cur_page: 1
//         }
//       }
//     })
//   });

//   const options = Object.assign({}, commonOptions, {
//     name: jsonpName
//   });

//   return jsonp(url, data, options);
// }

export function getSingerList() {
  const url = "https://c.y.qq.com/v8/fcg-bin/v8.fcg";

  const data = Object.assign({}, commonParams, {
    channel: "singer",
    page: "list",
    key: "all_all_all",
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: "yqq"
  });

  const options = Object.assign({}, commonOptions);

  return jsonp(url, data, options);
}

export function getSingerDetail(singerId) {
  let url = Api.singerDetail;

  const data = Object.assign({}, commonParams, {
    platform: "yqq",
    needNewCode: 0,
    singermid: singerId,
    order: "listen",
    begin: 0,
    num: 100,
    songstatus: 1
  });

  const options = Object.assign({}, commonOptions, {
    name: "MusicJsonCallbacksinger_track"
  });

  return jsonp(url, data, options);
}
