<!-- by LinHuiMing -->

<template>
  <div class="player" v-show="playList.length">
    <transition 
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img 
            width="100%" 
            height="100%" 
            :src="currentSong.image"
            :alt="currentSong.name"
          >
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.name"></h2>
        </div>
        <div class="middle" 
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdClass">
                <img :alt="currentSong.name" :src="currentSong.image" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric" v-html="playingLyric"></div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList"> 
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p 
                  ref="lyricLine" 
                  class="text" 
                  :class="{'current': currentLineNum === index}"
                  v-for="(line, index) in currentLyric.lines"
                  :key="line.time"
                  v-html="line.txt"
                >
                  <!-- {{line.txt}} -->
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar @precentChange="onPrecentChange" :precent="precent"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableClass">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableClass">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" @click="open" v-show="!fullScreen">
        <div class="icon">
          <div class="imgWrapper">
            <img 
              width="40" 
              height="40" 
              :src="currentSong.image" 
              :alt="currentSong.name"
              :class="cdClass"
            >
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :precent="precent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio 
      ref="audio" 
      :src="currentSong.url"
      @play="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    >
    </audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "common/js/dom";
import ProgressBar from "base/progress-bar/progress-bar";
import ProgressCircle from "base/progress-circle/progress-circle";
import { playMode } from "common/js/config";
import Lyric from "lyric-parser";
import Scroll from "base/scroll/scroll";
import Playlist from "components/playlist/playlist";
import { playerMixin } from "common/js/mixin";

const TRANSFORM = prefixStyle("transform");
const TRANSITION_DRUATION = prefixStyle("transitionDuration");
const OPACITY = prefixStyle("opacity");

export default {
  mixins: [playerMixin],
  data() {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: "cd",
      playingLyric: ""
    };
  },

  props: {},

  computed: {
    cdClass() {
      return this.playing ? "play" : "play pause";
    },
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    disableClass() {
      return this.songReady ? "" : "disable";
    },
    precent() {
      return this.currentTime / this.currentSong.duration;
    },
    ...mapGetters(["fullScreen", "playing", "currentIndex"])
  },

  created() {
    this.touch = {};
  },

  mounted() {},

  methods: {
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      animations.registerAnimation({
        name: "move",
        // the actual array of animation changes
        animation: {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        },
        // optional presets for when actually running the animation
        presets: {
          duration: 400,
          easing: "linear"
        }
      });

      // then run it
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "0.4s all";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[
        TRANSFORM
      ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.translate = "";
      this.$refs.cdWrapper.style[TRANSFORM] = "";
    },
    togglePlaying() {
      if (!this.songReady) return;
      this.setPlayingState(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    prev() {
      if (!this.songReady) return;
      if (this.playing.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex - 1;
        if (index < 0) {
          index = this.playList.length - 1;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
        this.$refs.audio.currentTime = 0;
        this.songReady = false;
      }
    },
    next() {
      if (!this.songReady) return;
      if (this.playing.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playList.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
        this.$refs.audio.currentTime = 0;
        this.songReady = false;
      }
    },
    ready() {
      this.songReady = true;
      this.savePlayHistory(this.currentSong);
    },
    error() {
      this.songReady = true;
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    onPrecentChange(precent) {
      const currentTime = this.currentSong.duration * precent;
      this.$refs.audio.currentTime = currentTime;
      if (!this.playing) {
        this.togglePlaying();
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    getLyric() {
      this.currentSong
        ._getLyric()
        .then(lyric => {
          if (this.currentSong.lyric !== lyric) return;
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
          // console.log(lyric);
          // console.log(this.currentLyric);
        })
        .catch(err => {
          console.log("获取歌词失败!", err);
          this.currentLyric = null;
          this.playingLyric = "";
          this.currentLineNum = 0;
        });
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    onTouchStart(e) {
      console.log("touchstart", e);
      const touch = e.touches[0];
      this.touch.initiated = true;
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    onTouchMove(e) {
      console.log("touchmove", e);
      if (!this.touch.initiated) return;
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      const winWidth = window.innerWidth;

      if (Math.abs(deltaY) > Math.abs(deltaX)) return;

      const left = this.currentShow === "cd" ? 0 : -winWidth;
      const offsetWidth = Math.min(0, Math.max(-winWidth, left + deltaX));

      this.touch.precent = Math.abs(offsetWidth) / Math.abs(winWidth);
      this.$refs.lyricList.$el.style[
        TRANSFORM
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs.lyricList.$el.style[TRANSITION_DRUATION] = "0ms";
      this.$refs.middleL.style[OPACITY] = 1 - this.touch.precent;
      this.$refs.middleL.style[TRANSITION_DRUATION] = `0ms`;
    },
    onTouchEnd(e) {
      console.log("touchend", e);
      if (!this.touch.precent) return;
      const precent = this.touch.precent;
      let opacity;
      let offsetWidth;
      const winWidth = window.innerWidth;
      this.touch.initiated = false;

      if (this.currentShow === "cd") {
        if (precent > 0.1) {
          offsetWidth = -winWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (precent < 0.9) {
          offsetWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offsetWidth = -winWidth;
        }
      }
      const time = 300;
      this.$refs.lyricList.$el.style[
        TRANSFORM
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs.lyricList.$el.style[TRANSITION_DRUATION] = `${time}ms`;
      this.$refs.middleL.style[OPACITY] = opacity;
      this.$refs.middleL.style[TRANSITION_DRUATION] = `${time}ms`;
      delete this.touch.precent;

      // this.$refs.middleL.style[TRANSITION_DRUATION] = `0ms`;
    },
    showPlaylist() {
      this.$refs.playlist.show();
    },
    format(interval) {
      // 秒
      interval = interval | 0;
      const minute = (interval / 60) | 0;
      const second = this._pad(interval % 60);
      return `${minute}:${second}`;
    },
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const targetPaddingTop = 80;
      const targetPaddingLeft = 40;
      const targetPaddingBottom = 30;
      const winWidth = window.innerWidth;
      const winHeight = window.innerHeight;
      const cdWrapperWidth = winWidth * 0.8;
      const scale = targetWidth / cdWrapperWidth;
      const x = -(winWidth / 2 - targetPaddingLeft);
      const y =
        winHeight - targetPaddingTop - cdWrapperWidth / 2 - targetPaddingBottom;
      return {
        x: x,
        y: y,
        scale: scale
      };
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN"
    }),
    ...mapActions(["savePlayHistory"])
  },

  watch: {
    currentSong(newVal, oldVal) {
      if (!newVal.id) return;
      if (newVal.id === oldVal.id) return;
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$refs.audio.play();
        this.getLyric();
      }, 1000);
    },
    playing(newVal) {
      this.$nextTick(() => {
        const audio = this.$refs.audio;
        newVal ? audio.play() : audio.pause();
      });
    }
  },

  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;

      .imgWrapper {
        height: 100%;
        width: 100%;

        img {
          border-radius: 50%;

          &.play {
            animation: rotate 10s linear infinite;
          }

          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
