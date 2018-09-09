<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content">
    <!-- <scroll ref="scroll" class="recommend-content" :data="discList"> -->
      <!-- better-scroll 父子级，第一个子元素才会滚动。 -->
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider class="slider-content">
            <div v-for="item in recommends" :key="item.picUrl">
              <a :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">
            热门歌单推荐
          </h1>
          <ul>
            <li @click="selectItem(item)" class="item" v-for="item in discList" :key="item.imgurl">
              <div class="icon">
                <img 
                  width="60" 
                  height="60" 
                  v-lazy="item.imgurl" 
                  :alt="item.dissname"
                >
              </div>
              <div class="text">
                <!-- <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p> -->
                <h2 class="name">{{ item.creator.name }}</h2>
                <p class="desc">{{ item.dissname }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Slider from "base/slider/slider.vue";
import Scroll from "base/scroll/scroll.vue";
import Loading from "base/loading/loading.vue";
import { getRecommend, getDiscList } from "api/recommend";
import { ERR_OK } from "api/config";
import { playListMixin } from "common/js/mixin";
import { mapMutations } from "vuex";

export default {
  mixins: [playListMixin],
  data() {
    return {
      recommends: [],
      discList: [],
      checkLoaded: false
    };
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? "60px" : "";
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      });
      this.setDisc(item);
    },
    _getRecommend() {
      getRecommend().then(res => {
        // console.log(res);
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        // console.log(res);
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    },
    ...mapMutations({
      setDisc: "SET_DISC"
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
};
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        height: 0
        padding-top: 40%
        overflow: hidden
        .slider-content
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
