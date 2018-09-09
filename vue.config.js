const path = require("path");

const resolve = dir => {
  return path.resolve(__dirname, dir);
};

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        api: resolve("./src/api"),
        common: resolve("./src/common"),
        base: resolve("./src/base"),
        components: resolve("./src/components"),
        pages: resolve("./src/pages")
      }
    },
    devServer: {
      proxy: {
        "/splcloud": {
          target: "https://c.y.qq.com",
          ws: true,
          changeOrigin: true,
          headers: {
            referer: "https://y.qq.com/"
          }
        },
        "/lyric": {
          target: "https://c.y.qq.com",
          ws: true,
          changeOrigin: true,
          headers: {
            referer: "https://y.qq.com/"
          }
        },
        "/qzone": {
          target: "https://c.y.qq.com",
          ws: true,
          changeOrigin: true,
          headers: {
            referer: "https://y.qq.com/"
          }
        },
        "/cgi-bin": {
          target: "https://u.y.qq.com",
          ws: true,
          changeOrigin: true,
          headers: {
            referer: "https://y.qq.com/"
          }
        },
        "/v8": {
          target: "https://c.y.qq.com",
          ws: true,
          changeOrigin: true,
          headers: {
            referer: "https://y.qq.com/"
          }
        },
        "/soso": {
          target: "https://c.y.qq.com",
          ws: true,
          changeOrigin: true,
          headers: {
            referer: "https://y.qq.com/"
          }
        }
      }
    }
  }
};
