import { commonParams } from "./config.js";
import { proxyApi } from "api/api.js";
import axios from "axios";
import { getUid } from "common/js/uid";
import { ERR_OK } from "api/config";

export function getLyric(mid) {
  const url = proxyApi.lyric;

  const data = Object.assign({}, commonParams, {
    // callback: "MusicJsonCallback_lrc",
    pcachetime: +new Date(),
    songmid: mid,
    loginUin: 0,
    hostUin: 0,
    format: "json",
    platform: "yqq",
    needNewCode: 0
  });

  return axios({
    method: "get",
    url: url,
    params: data
  })
    .then(res => {
      var ret = res.data;
      if (typeof ret === "string") {
        const reg = /^\w+\(({[^()]+})\)$/;
        const matchs = ret.match(reg);
        if (matchs) {
          ret = JSON.parse(matchs[1]);
        }
      }
      return Promise.resolve(ret);
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

export function getSongsUrl(songs) {
  const url = "/cgi-bin/musicu.fcg";

  let mids = [];
  let types = [];

  songs.forEach(song => {
    mids.push(song.mid);
    types.push(0);
  });

  const urlMid = genUrlMid(mids, types);

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: "json",
    platform: "h5",
    needNewCode: 1,
    uin: 0
  });

  return new Promise((resolve, reject) => {
    let tryTime = 3;

    function request() {
      return axios
        .post(url, {
          comm: data,
          url_mid: urlMid
        })
        .then(response => {
          const res = response.data;
          if (res.code === ERR_OK) {
            let urlMid = res.url_mid;
            if (urlMid && urlMid.code === ERR_OK) {
              const info = urlMid.data.midurlinfo[0];
              if (info && info.purl) {
                resolve(res);
              } else {
                retry();
              }
            } else {
              retry();
            }
          } else {
            retry();
          }
        });
    }

    function retry() {
      if (--tryTime >= 0) {
        request();
      } else {
        reject(new Error("Can not get the songs url"));
      }
    }

    request();
  });
}

function genUrlMid(mids, types) {
  const guid = getUid();
  return {
    module: "vkey.GetVkeyServer",
    method: "CgiGetVkey",
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: "0",
      loginflag: 0,
      platform: "23"
    }
  };
}
