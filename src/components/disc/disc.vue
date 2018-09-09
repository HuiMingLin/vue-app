<!-- by LinHuiMing -->

<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import musicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { getSongList } from "api/recommend";
import { ERR_OK } from "api/config";
import { createSong, isValidMusic, processSongsUrl } from "common/js/Song";

export default {
  data() {
    return {
      songs: []
    };
  },

  props: {},

  computed: {
    title() {
      return this.disc.dissname;
    },
    bgImage() {
      return this.disc.imgurl;
    },
    ...mapGetters(["disc"])
  },

  created() {
    this._getSongList();
  },

  mounted() {},

  methods: {
    _getSongList() {
      const dissid = this.disc.dissid;
      if (!dissid) {
        this.$router.push({
          path: "/recommend"
        });
      }
      getSongList(this.disc.dissid).then(res => {
        console.log(res);
        if (res.code === ERR_OK) {
          // this.songs = this._normalizeSongs(res.cdlist[0].songlist);
          processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then(
            songs => {
              this.songs = songs;
            }
          );
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
        // let { musicData } = item;
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },

  components: {
    musicList
  }
};
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition all 0.3s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
    
</style>
