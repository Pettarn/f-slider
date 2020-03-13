import Swiper from '../components/Swiper.vue'
import SwiperItem from '../components/SwiperItem.vue'

Swiper.install = function (Vue) {
    Vue.component('swiper', Swiper)
    Vue.component('swiper-item', SwiperItem)
}

export default Swiper
