<!-- by LinHuiMing -->

<template>
  <scroll 
    ref="suggest" 
    class="suggest" 
    :data="result" 
    :pullup="pullup" 
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉, 暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import { search } from "api/search";
import { ERR_OK } from "api/config";
import { createSong, isValidMusic, processSongsUrl } from "common/js/Song";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import Singer from "common/js/Singer";
import { mapMutations, mapActions } from "vuex";
import NoResult from "base/no-result/no-result";

const TYPE_SINGER = "singer";
const PER_PAGE = 20;

export default {
  data() {
    return {
      page: 1,
      result: [],
      beforeScroll: true,
      pullup: true,
      hasMore: true
    };
  },

  props: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },

  computed: {},

  created() {},

  mounted() {},

  methods: {
    selectItem(item) {
      console.log(item);
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          name: item.singername,
          id: item.singermid
        });
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
      this.$emit("select");
    },
    searchMore() {
      if (!this.hasMore) return;
      this.page++;

      search(this.query, this.page, this.showSinger, PER_PAGE)
        .then(res => {
          if (res.code === ERR_OK) {
            this._getResult(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getIconClass(item) {
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    refresh() {
      this.$refs.suggest.refresh();
    },
    listScroll() {
      this.$emit("listScroll");
    },
    _search() {
      if (!this.query) return;
      this.page = 1;
      this.hasMore = true;
      this.$refs.suggest.scrollTo(0, 0);
      this.result = [];
      search(this.query, this.page, this.showSinger, PER_PAGE)
        .then(res => {
          if (res.code === ERR_OK) {
            // this.result =
            this.result = [];
            this._getResult(res.data);
            // this._checkMore(res.data.song);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _checkMore(song) {
      if (
        !song.list.length ||
        song.curnum + song.curpage * PER_PAGE >= song.totalnum
      ) {
        this.hasMore = false;
      }
    },
    _getResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, type: TYPE_SINGER });
      }
      if (data.song) {
        processSongsUrl(this._normalizeSongs(data.song.list)).then(songs => {
          ret = ret.concat(songs);
          this.result = this.result.concat(ret);
          this._checkMore(data.song);
        });
      } else {
        this.result = ret;
        this._checkMore(data.song);
      }
    },
    _normalizeSongs(list) {
      const ret = [];
      list.forEach(musicData => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions(["insertSong"])
  },

  watch: {
    query() {
      this._search();
    }
  },

  components: {
    Scroll,
    Loading,
    NoResult
  }
};
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
