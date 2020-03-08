<template>
  <div class="swiper" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"  @mouseenter="mouseenter" @mouseleave="mouseleave">
    <div class="viewport">
      <slot></slot>
      <div class="dot">
          <span class="dot-item" v-for="(item, index) in length" :key="index">
              {{ item }}
          </span>
      </div>
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
        default: 3000
    }
  },
  data() {
    return {
      currentSelected: "",
      names: [],
      length: null,
      timer: null,
      shiftX: null,
      curX: null,
      left: null,
      target: null
    };
  },
  mounted() {
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
    mouseenter () {
        clearInterval(this.timer)
        this.timer = null
    },
    mouseleave () {
        if (!this.timer) {
            this.run()
        }
    },
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
        if (newIndex > curIndex) {
            this.$children.forEach((vm) => {
                vm.direction = 'left'
            })
            // console.log(this.$children.direction)
        } else {
            this.$children.forEach((vm) => {
                vm.direction = 'left'
            })
            // console.log(this.$children.direction)
        }
        this.$emit("input", this.names[newIndex]);
      }, this.timeout);
    },
    touchstart (e) {
        clearInterval(this.timer)
        this.timer = null
        this.target = e.targetTouches[0].target
        let {left} = this.target.getBoundingClientRect()
        this.left = left
        this.shiftX = e.targetTouches[0].clientX - this.left
    },
    touchmove (e) {
        // this.curX = e.targetTouches[0].clientX - this.left
        // if (this.curX > this.shiftX) {

        // }
        console.log(e.targetTouches[0].clientX - this.shiftX)
        this.target.style.left = e.targetTouches[0].clientX - this.shiftX + 'px'
    },
    touchend (e) {

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
