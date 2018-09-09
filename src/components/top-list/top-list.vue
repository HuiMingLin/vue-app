<!-- by LinHuiMing -->

<template>
  <transition name="slide">
    <music-list 
      :title="title" 
      :bgImage="bgImage" 
      :songs="songs"
      :rank="true"
    >
    </music-list>
  </transition>
</template>

<script>
import MusicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { getMusicList } from "api/rank";
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
      return this.topList.topTitle;
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image;
      }
      return this.topList.picUrl;
    },
    ...mapGetters(["topList"])
  },

  created() {
    this._getMusicList();
  },

  mounted() {},

  methods: {
    _getMusicList() {
      const id = this.topList.id;
      if (!id) {
        this.$router.push({
          path: "/recommend"
        });
      }
      getMusicList(id).then(res => {
        console.log(res);
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.songlist)).then(songs => {
            this.songs = songs;
          });
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        let { data: musicData } = item;
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },

  components: {
    MusicList
  }
};
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition all 0.3s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
    
</style>
