import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/";
import "./registerServiceWorker";
// import fastclick from "fastclick";
import VueLazyLoad from "vue-lazyload";

// import vConsole from "vconsole";

import loadImage from "common/images/loading.gif";

import "common/stylus/index.styl";

// new vConsole();

console.log("test");

// fastclick.attach(document.body);

Vue.config.productionTip = false;

Vue.use(VueLazyLoad, {
  loading: loadImage
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
