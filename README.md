## 思路
-   通过数据`selected`驱动轮播
-   当`touch`事件触发时，让此时的动画瞬间静止。 `timer消除，transition动画也消除`
-   让`touchmove`来接管，当图片的`left > (mediawidth / 2)`，即可切换，但是此时还不能切换
-   当touchend的时候，通过判断`left`决定`selected`，先更改数据，数据是一切的源头

