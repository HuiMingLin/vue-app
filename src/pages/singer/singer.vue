<template>
  <div class="singer" ref="singer">
    <list-view 
      v-if="singers" 
      :data="singers"
      @select="selectSinger"
      ref="listView"
    >
    </list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from "api/singer";
// import { getSingerList, jsonpNameList } from "api/singer";
import { ERR_OK } from "api/config";
// import { getEN, getRange } from "common/js/util";
import ListView from "base/listview/listview.vue";
import Singer from "common/js/Singer.js";
import { mapMutations } from "vuex";
import { playListMixin } from "common/js/mixin";

const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;
// const HOT_ID = -100;
// const SINGER_LEN = 10;

export default {
  mixins: [playListMixin],
  data() {
    return {
      singers: []
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? "60px" : "";
      this.$refs.singer.style.bottom = bottom;
      this.$refs.listView.refresh();
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      this.setSinger(singer);
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list);
        }
      });
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            })
          );
        }
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          })
        );
      });
      // 为了得到有序列表，我们需要处理 map
      let ret = [];
      let hot = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    // _getSingerList() {
    //   const indexList = getRange(1, 27);
    //   let count = 0;
    //   indexList.unshift(HOT_ID);
    //   const arr = [];

    //   indexList.forEach((val, index) => {
    //     const jsonpName = jsonpNameList[index];
    //     getSingerList(val, jsonpName)
    //       .then(res => {
    //         // console.log(res);
    //         if (res.code === ERR_OK) {
    //           ++count;

    //           this._normalizeSinger(
    //             arr,
    //             res.singerList.data.singerlist || [],
    //             index
    //           );

    //           if (count === indexList.length) {
    //             // 为了得到有序列表，需要拍下序
    //             const hot = [];
    //             const ret = [];

    //             arr.forEach(o => {
    //               const title = o.title;
    //               if (title === HOT_NAME) {
    //                 hot.push(o);
    //               } else if (title.match(/[a-zA-Z]/)) {
    //                 ret.push(o);
    //               }
    //             });

    //             ret.sort((a, b) => {
    //               return a.title.charCodeAt(0) - b.title.charCodeAt(0);
    //             });
    //             this.singers = hot.concat(ret);
    //             // console.log(this.singers);
    //           }
    //         }
    //       })
    //       .catch(err => {
    //         console.log(err);
    //       });
    //   });
    // },
    // _normalizeSinger(arr, list, index) {
    //   list = list.slice(0, SINGER_LEN);
    //   const map = getEN(65, 91);
    //   map.unshift(HOT_NAME);
    //   let items = [];
    //   list.forEach(o => {
    //     items.push(
    //       new Singer({
    //         id: o.singer_mid,
    //         name: o.singer_name
    //       })
    //     );
    //   });
    //   arr.push({
    //     title: map[index],
    //     items: items
    //   });
    // },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  },
  components: {
    ListView
  }
};
</script>

<style lang="stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width 100%
</style>
