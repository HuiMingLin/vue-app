import axios from "axios";
import jsonp from "common/js/jsonp.js";
import { commonParams, commonOptions } from "./config.js";
import { Api, proxyApi } from "api/api.js";

export function getRecommend() {
  let url = Api.recommend;

  const data = Object.assign({}, commonParams, {
    platform: "h5",
    uin: 0,
    needNewCode: 1
  });

  const options = Object.assign({}, commonOptions, {
    // name: '',
  });

  return jsonp(url, data, options);
}

export function getDiscList() {
  let url = proxyApi.discList;

  const data = Object.assign({}, commonParams, {
    picmid: 1,
    rnd: Math.random(),
    loginUin: 0,
    hostUin: 0,
    platform: "yqq",
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29,
    format: "json"
  });

  // const options = Object.assign({}, commonOptions, {
  //   name: "getPlaylist"
  // });

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

export function getSongList(disstid) {
  let url = proxyApi.songList;

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: "yqq",
    loginUin: 0,
    hostUin: 0,
    needNewCode: 1
  });

  return axios({
    method: "get",
    url: url,
    params: data
  })
    .then(res => {
      let ret = res.data;
      if (typeof ret === "string") {
        var reg = /^\w+\(({.+})\)$/;
        var matches = ret.match(reg);
        if (matches) {
          ret = JSON.parse(matches[1]);
        }
      }
      return Promise.resolve(ret);
    })
    .catch(err => {
      return Promise.reject(err);
    });
}
