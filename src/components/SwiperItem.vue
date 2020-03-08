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
      return this.selected === this.name;
    }
  },
  data() {
    return {
      selected: '',
      direction: 'left'
    };
  },
  watch: {
      direction () {
        //   console.log(this.direction)
      }
  }
};
</script>

<style scoped>
.swiper-item {
    position: absolute;
    /* left: 20px; */
}
.left-enter-active,
.left-leave-active,
.right-leave-active,
.right-leave-active {
    transition: 1s all linear;
    position: absolute;
}
.left-enter, .right-leave-to {
    transform: translateX(100%);
}
.left-leave-to, .right-enter {
    transform: translateX(-100%);
}
</style>
