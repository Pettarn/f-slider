<template>
  <div class="swiper">
    <div
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
      class="viewport"
      data-power
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    timeout: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      currentSelected: "",
      names: [],
      length: null,
      timer: null,
      target: {
        left: null,
        self: null,
        right: null
      },
      targetDom: null,
      viewportWidth: null,
      touch: {
        x1: null,
        x2: null
      },
      accDistance: 0,
      totalDiff: 0
    };
  },
  computed: {},
  mounted() {
    let viewport = document.getElementsByClassName("viewport")[0];
    this.viewportWidth = viewport.clientWidth;
    let __this = this;
    window.onresize = function() {
      __this.viewportWidth = document.documentElement.clientWidth;
    };
    this.showChild();
    this.$children.forEach(child => {
      this.names.push(child.name);
    });
    this.length = this.names.length;
    if (this.autoplay) {
      this.run();
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  watch: {
    value() {
      this.showChild();
    }
  },
  methods: {
    showChild() {
      this.currentSelected = this.value || this.$children[0].name;
      this.$children.forEach(vm => {
        vm.selected = this.currentSelected;
      });
    },
    run() {
      this.timer = setInterval(() => {
        let curIndex = this.names.indexOf(this.currentSelected);
        let newIndex = (curIndex + 1) % this.length;
        this.$children.forEach(vm => {
          vm.direction = "left";
        });
        this.$emit("input", this.names[newIndex]);
      }, this.timeout);
    },
    touchstart(e) {
      if (e.target.children.length) {
        return;
      }
      clearInterval(this.timer);
      this.timer = null;
      let currentIndex = this.names.indexOf(this.currentSelected);
      let right = (currentIndex + 1 + this.length) % this.length;
      let left = (currentIndex - 1 + this.length) % this.length;
      this.$children.forEach(vm => {
        let vmIndex = this.names.indexOf(vm.name);
        if (vmIndex === right || vmIndex === left || vmIndex === currentIndex) {
          if (vmIndex === right) {
            this.target.right = vm;
          } else if (vmIndex === left) {
            this.target.left = vm;
          } else if (vmIndex === currentIndex) {
            this.target.self = vm;
            vm.direction = "";
            vm.flag = true;
          }
        }
      });
      this.targetDom = e.targetTouches[0].target;
      this.accDistance = this.targetDom.offsetLeft;
      this.touch.x1 = e.targetTouches[0].clientX;
    },
    touchmove(e) {
      if (this.targetDom == null) {
        return;
      }
      this.touch.x2 = e.targetTouches[0].clientX;
      this.totalDiff = this.touch.x2 - this.touch.x1;

      this.translate(this.targetDom, this.totalDiff + this.accDistance);
    },
    touchend(e) {
      //   console.log(parseInt(getComputedStyle(this.targetDom).left));
      //   console.log(this.accDistance)
      //   console.log(this.viewportWidth);
      if (this.targetDom == null) {
        return;
      }
      if (this.totalDiff > this.viewportWidth / 3) {
        this.translate(
          this.targetDom,
          this.viewportWidth,
          // this.viewportWidth,
          (this.viewportWidth - this.totalDiff) / this.viewportWidth,
          false
        );
        this.target.left.direction = "right";
        this.$emit("input", this.target.left.name);
      } else if (-this.totalDiff > this.viewportWidth / 3) {
        this.translate(
          this.targetDom,
          -this.viewportWidth + this.totalDiff,
          (this.viewportWidth + this.totalDiff) / this.viewportWidth,
          false
        );
        this.target.right.direction = "left";
        this.$emit("input", this.target.right.name);
      } else {
        this.translate(
          this.targetDom,
          0,
          (this.totalDiff > 0 ? this.totalDiff : -this.totalDiff) /
            this.viewportWidth,
          false
        );
        this.target.self.direction = 'left'
      }
      this.touch.x1 = this.touch.x2 = this.totalDiff = null;
      this.targetDom = null;
      if (!this.timer) {
        this.run();
      }
    },
    translate(elem, diff, durationTime, flag) {
      let name = this.target.self.name
      let __this = this;
      setTimeout(() => {
        if (flag === false) {
            if (__this.target.self.name !== name) {
                __this.target.left.flag = __this.target.right.flag = flag
            } else {
                __this.target.self.flag = flag;
            }
        }
      }, durationTime * 2000);
      let viewportWidth = this.viewportWidth;
      diff = diff > viewportWidth ? viewportWidth : diff;
      diff = -diff > viewportWidth ? -viewportWidth : diff;
      elem.style.left = diff + "px";
      elem.style.transitionProperty = "left";
      elem.style.transitionDuration = (durationTime || 0) * 2 + "s";
    }
  }
};
</script>

<style scoped>
.viewport {
  position: absolute;
  height: 100%;
  width: 100%;
  /* overflow: hidden; */
}

.dot {
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
}
.dot-item {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 1px solid red;
  background-color: green;
}
</style>
