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
  computed: {
    // accDistance() {
    //   return (
    //     this.targetDom.getBoundingClientRect().left -
    //     this.targetDom.offsetParent.getBoundingClientRect().left
    //   );
    // }
  },
  mounted() {
    let viewport = document.getElementsByClassName("viewport")[0];
    this.viewportWidth = viewport.clientWidth;
    let __this = this;
    window.onresize = function() {
      __this.viewportWidth = viewport.clientWidth;
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
          if (vm.name === 'item2') {
              console.log(vm.fromSup)
          }
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
      this.targetDom = e.targetTouches[0].target;
      //   this.accDistance =
      //     this.targetDom.getBoundingClientRect().left -
      //     this.targetDom.offsetParent.getBoundingClientRect().left;
      this.touch.x1 = e.targetTouches[0].clientX;
      let currentIndex = this.names.indexOf(this.currentSelected);
      let right = (currentIndex + 1 + this.length) % this.length;
      let left = (currentIndex - 1 + this.length) % this.length;
      this.$children.forEach(vm => {
        let vmIndex = this.names.indexOf(vm.name);
        if (vmIndex === right || vmIndex === left || vmIndex === currentIndex) {
          if (vmIndex === right) {
            vm.direction = "";
            vm.flag = true;
            this.target.right = vm;
          } else if (vmIndex === left) {
            vm.direction = "";
            vm.flag = true;
            this.target.left = vm;
          } else if (vmIndex === currentIndex) {
            vm.direction = "";
            vm.flag = true;
            this.target.self = vm;
          }
        }
      });
      this.translate(this.targetDom, 0);
    },
    touchmove(e) {
      if (this.targetDom == null) {
        return;
      }
      this.touch.x2 = e.targetTouches[0].clientX;
      this.totalDiff = this.touch.x2 - this.touch.x1;

      //   this.translate(this.targetDom, this.totalDiff + this.accDistance);
      this.translate(this.targetDom, this.totalDiff);
    },
    touchend(e) {
      //   console.log(parseInt(getComputedStyle(this.targetDom).left));
      //   console.log(this.accDistance)
      //   console.log(this.viewportWidth);
      if (this.targetDom == null) {
        return;
      }
      if (this.totalDiff > this.viewportWidth / 2) {
        this.translate(
          this.targetDom,
          this.viewportWidth,
          // this.viewportWidth,
          (this.viewportWidth - this.totalDiff) / this.viewportWidth,
          false
        );
        // this.target.left.direction = "right";
        this.$emit("input", this.target.left.name);
      } else if (-this.totalDiff > this.viewportWidth / 2) {
        this.translate(
          this.targetDom,
          -this.viewportWidth + this.totalDiff,
          (this.viewportWidth + this.totalDiff) / this.viewportWidth,
          false
        );
        // this.target.right.direction = "left";
        this.$emit("input", this.target.right.name);
      } else {
        this.translate(
          this.targetDom,
          0,
          (this.totalDiff > 0 ? this.totalDiff : -this.totalDiff) /
            this.viewportWidth,
          false
        );
        // this.$emit("input", this.target.self.name);
        this.target.self.direction = "onlyleft";
        console.log(this.currentSelected)
      }
    },
    translate(elem, diff, durationTime, flag) {
      let name = this.target.self.name;
      let __this = this;
      setTimeout(() => {
        if (flag === false) {
          __this.target.self.flag = __this.target.left.flag = __this.target.right.flag = flag;
          __this.target.self.fromSup = __this.target.left.fromSup = __this.target.right.fromSup = {}
          __this.target.self.zIndex = 0;
          __this.target.self.direction = __this.target.left.direction = __this.target.right.direction =
            "left";
          this.touch.x1 = this.touch.x2 = this.totalDiff = null;
          //   this.target.left.direction = this.target.self.direction = this.target.right.direction = 'left'
          this.targetDom = null;
          //   this.target.left = this.target.right = this.target.self = null

          if (!this.timer) {
            this.run();
          }
        }
      }, durationTime * 300);
      let viewportWidth = this.viewportWidth;
      diff = diff > viewportWidth ? viewportWidth : diff;
      diff = -diff > viewportWidth ? -viewportWidth : diff;
      this.target.left.fromSup = {
        left: diff - this.viewportWidth + "px",
        transitionProperty: "left",
        transitionDuration: (durationTime || 0) * 0.3 + "s"
      };
      this.target.right.fromSup = {
        left: diff + this.viewportWidth + "px",
        transitionProperty: "left",
        transitionDuration: (durationTime || 0) * 0.3 + "s"
      };
      elem.style.left = diff + "px";
      elem.style.zIndex = 1;
      elem.style.transitionProperty = "left";
      elem.style.transitionDuration = (durationTime || 0) * 0.3 + "s";
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
