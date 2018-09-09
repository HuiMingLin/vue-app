import { commonParams } from "./config.js";
import { proxyApi } from "api/api.js";
import axios from "axios";

export function getTopList() {
  const url = proxyApi.topList;

  const data = Object.assign({}, commonParams, {
    platform: "h5",
    needNewCode: 1,
    format: "json"
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

export function getMusicList(topid) {
  const url = proxyApi.musicList;

  const data = Object.assign({}, commonParams, {
    platform: "h5",
    needNewCode: 1,
    format: "json",
    tpl: 3,
    page: "detail",
    type: "top",
    topid: topid
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
