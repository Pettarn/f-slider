<template>
  <div id="app">
    <swiper class="swiper" v-model="selected" autoplay>
      <swiper-item class="swiper-item" name="item1">
        <div class="content" style="background-color: red">内容一</div>
      </swiper-item>
      <swiper-item class="swiper-item" name="item2">
        <div class="content" style="background-color: orange">内容二</div>
      </swiper-item>
      <swiper-item class="swiper-item" name="item3">
        <div class="content" style="background-color: yellow">内容三</div>
      </swiper-item>
      <swiper-item class="swiper-item" name="item4">
        <div class="content" style="background-color: green">内容四</div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
// import Swiper from "./components/Swiper";
// import SwiperItem from "./components/SwiperItem";

export default {
  name: "app",
  data() {
    return {
      selected: ""
    };
  },
  mounted() {}
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  width: 25%;
  /* height: 150px; */
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  /* overflow: hidden; */
}
.swiper {
  width: 100%;
  height: 150px;
  background-color: black;
}

.swiper-item {
  width: 100%;
  height: 100%;
}
.content {
  position: absolute;
  width: 100%;
  height: 150px;
}
</style>
