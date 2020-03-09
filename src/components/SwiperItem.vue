<template>
  <transition :name="direction">
    <div class="swiper-item" v-if="isShow">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    isShow() {
      return this.selected === this.name || this.flag;
    }
  },
  data() {
    return {
      selected: "",
      direction: "onlyleave",
      flag: false
    };
  },
  watch: {
    direction() {
      //   console.log(this.direction)
    },
    flag () {
        this.$parent.viewportDom = document.querySelector('div[data-power]')
    }
  }
};
</script>

<style scoped>
.swiper-item {
  position: absolute;
  width: 100%;
}
.left-enter-active,
.left-leave-active,
.right-enter-active,
.right-leave-active,
.onlyleave-leave-active {
  transition: 1s all ease;
  position: absolute;
}
.left-enter,
.right-leave-to {
  transform: translateX(100%);
  /* left: 100%; */
}
.left-leave-to,
.right-enter,
.onlyleave-leave-to {
  transform: translateX(-100%);
  /* left: -100%; */
}
</style>
