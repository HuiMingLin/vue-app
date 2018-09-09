import Vue from "vue";
import Router from "vue-router";
// import Recommend from "pages/recommend/recommend.vue";
// import Disc from "components/disc/disc";
// import Singer from "pages/singer/singer.vue";
// import SingerDetail from "components/singer-detail/singer-detail.vue";
// import Rank from "pages/rank/rank.vue";
// import TopList from "components/top-list/top-list";
// import Search from "pages/search/search.vue";
// import UserCenter from "components/user-center/user-center";

Vue.use(Router);

function loadView(page, view) {
  return () =>
    import(/* webpackChunkName: "view-[request]" */ `@/${page}/${view}/${view}.vue`);
}

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/recommend"
    },
    {
      path: "/recommend",
      component: loadView("pages", "recommend"),
      children: [
        {
          path: ":id",
          component: loadView("components", "disc")
        }
      ]
    },
    {
      path: "/singer",
      component: loadView("pages", "singer"),
      children: [
        {
          path: ":id",
          component: loadView("components", "singer-detail")
        }
      ]
    },
    {
      path: "/rank",
      component: loadView("pages", "rank"),
      children: [
        {
          path: ":id",
          component: loadView("components", "top-list")
        }
      ]
    },
    {
      path: "/search",
      component: loadView("pages", "search"),
      children: [
        {
          path: ":id",
          component: loadView("components", "singer-detail")
        }
      ]
    },
    {
      path: "/user",
      component: loadView("components", "user-center")
    }
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "./views/About.vue")
    // }
  ]
});
