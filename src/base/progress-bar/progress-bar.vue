<!-- by LinHuiMing -->

<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div 
        class="progress-btn-wrapper" 
        ref="progressBtn"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from "common/js/dom";
const TRANSFORM = prefixStyle("transform");
const PROGRESS_BTN_WIDHT = 16;
export default {
  data() {
    return {};
  },

  props: {
    precent: {
      type: Number,
      default: 0
    }
  },

  computed: {},

  created() {
    this.touch = {};
  },

  mounted() {},

  methods: {
    onTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    onTouchMove(e) {
      if (!this.touch.initiated) return;
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth,
        Math.max(0, this.touch.left + deltaX)
      );
      this._offset(offsetWidth);
    },
    onTouchEnd() {
      this.touch.initiated = false;
      this._triggerPrecent();
    },
    progressClick(e) {
      let rect = this.$refs.progressBar.getBoundingClientRect();
      let offsetWidth = e.pageX - rect.left;
      this._offset(offsetWidth);
      // 当我点击 progressBtn 的时候，e.offsetX 获取不对
      // this._offset(e.offsetX);
      this._triggerPrecent();
    },
    _triggerPrecent() {
      const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDHT;
      const precent = this.$refs.progress.clientWidth / barWidth;
      this.$emit("precentChange", precent);
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[
        TRANSFORM
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
    }
  },

  watch: {
    precent(newVal) {
      if (newVal >= 0 && !this.touch.initiated) {
        const barWidth =
          this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDHT;
        const offsetWidth = newVal * barWidth;
        this._offset(offsetWidth);
      }
    }
  },

  components: {}
};
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
