import { commonParams } from "./config.js";
import { proxyApi } from "./api.js";
import axios from "axios";

export function getHotKey() {
  const url = proxyApi.hotKey;

  const data = Object.assign({}, commonParams, {
    uin: "3495470973",
    format: "json",
    platform: "h5",
    needNewCode: 1
  });

  return axios({
    method: "get",
    url: url,
    params: data
  })
    .then(res => {
      return Promise.resolve(res.data);
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

export function search(query, page, zhida, perpage) {
  const url = proxyApi.search;

  const data = Object.assign({}, commonParams, {
    g_tk: 1767563654,
    uin: 3495470973,
    format: "json",
    platform: "h5",
    needNewCode: 1,
    w: query,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: "utf-8",
    sem: 1,
    aggr: 0,
    perpage: perpage,
    n: 20,
    p: page,
    remoteplace: "txt.mqq.all"
  });

  return axios({
    method: "get",
    url: url,
    params: data
  })
    .then(res => {
      return Promise.resolve(res.data);
    })
    .catch(err => {
      return Promise.reject(err);
    });
}
