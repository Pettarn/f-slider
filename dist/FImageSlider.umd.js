(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.FImageSlider = factory());
}(this, (function () { 'use strict';

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script = {
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

    computed: {// accDistance() {
      //   return (
      //     this.targetDom.getBoundingClientRect().left -
      //     this.targetDom.offsetParent.getBoundingClientRect().left
      //   );
      // }
    },

    mounted() {
      var viewport = document.getElementsByClassName("viewport")[0];
      this.viewportWidth = viewport.clientWidth;

      var __this = this;

      window.onresize = function () {
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
          var curIndex = this.names.indexOf(this.currentSelected);
          var newIndex = (curIndex + 1) % this.length;
          this.$children.forEach(vm => {
            vm.direction = "left";

            if (vm.name === 'item2') {
              console.log(vm.fromSup);
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
        this.targetDom = e.targetTouches[0].target; //   this.accDistance =
        //     this.targetDom.getBoundingClientRect().left -
        //     this.targetDom.offsetParent.getBoundingClientRect().left;

        this.touch.x1 = e.targetTouches[0].clientX;
        var currentIndex = this.names.indexOf(this.currentSelected);
        var right = (currentIndex + 1 + this.length) % this.length;
        var left = (currentIndex - 1 + this.length) % this.length;
        this.$children.forEach(vm => {
          var vmIndex = this.names.indexOf(vm.name);

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
        this.totalDiff = this.touch.x2 - this.touch.x1; //   this.translate(this.targetDom, this.totalDiff + this.accDistance);

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
          this.translate(this.targetDom, this.viewportWidth, // this.viewportWidth,
          (this.viewportWidth - this.totalDiff) / this.viewportWidth, false); // this.target.left.direction = "right";

          this.$emit("input", this.target.left.name);
        } else if (-this.totalDiff > this.viewportWidth / 2) {
          this.translate(this.targetDom, -this.viewportWidth + this.totalDiff, (this.viewportWidth + this.totalDiff) / this.viewportWidth, false); // this.target.right.direction = "left";

          this.$emit("input", this.target.right.name);
        } else {
          this.translate(this.targetDom, 0, (this.totalDiff > 0 ? this.totalDiff : -this.totalDiff) / this.viewportWidth, false); // this.$emit("input", this.target.self.name);

          this.target.self.direction = "onlyleft";
          console.log(this.currentSelected);
        }
      },

      translate(elem, diff, durationTime, flag) {
        var name = this.target.self.name;

        var __this = this;

        setTimeout(() => {
          if (flag === false) {
            __this.target.self.flag = __this.target.left.flag = __this.target.right.flag = flag;
            __this.target.self.fromSup = __this.target.left.fromSup = __this.target.right.fromSup = {};
            __this.target.self.zIndex = 0;
            __this.target.self.direction = __this.target.left.direction = __this.target.right.direction = "left";
            this.touch.x1 = this.touch.x2 = this.totalDiff = null; //   this.target.left.direction = this.target.self.direction = this.target.right.direction = 'left'

            this.targetDom = null; //   this.target.left = this.target.right = this.target.self = null

            if (!this.timer) {
              this.run();
            }
          }
        }, durationTime * 300);
        var viewportWidth = this.viewportWidth;
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

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    const options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    let hook;

    if (moduleIdentifier) {
      // server build
      hook = function (context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function (context) {
        style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        const originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        const existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  const isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

  function createInjector(context) {
    return (id, style) => addStyle(id, style);
  }

  let HEAD;
  const styles = {};

  function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = {
      ids: new Set(),
      styles: []
    });

    if (!style.ids.has(id)) {
      style.ids.add(id);
      let code = css.source;

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (!style.element) {
        style.element = document.createElement('style');
        style.element.type = 'text/css';
        if (css.media) style.element.setAttribute('media', css.media);

        if (HEAD === undefined) {
          HEAD = document.head || document.getElementsByTagName('head')[0];
        }

        HEAD.appendChild(style.element);
      }

      if ('styleSheet' in style.element) {
        style.styles.push(code);
        style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
      } else {
        const index = style.ids.size - 1;
        const textNode = document.createTextNode(code);
        const nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  }

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "swiper" }, [
      _c(
        "div",
        {
          staticClass: "viewport",
          attrs: { "data-power": "" },
          on: {
            touchstart: _vm.touchstart,
            touchmove: _vm.touchmove,
            touchend: _vm.touchend
          }
        },
        [_vm._t("default")],
        2
      )
    ])
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-0665d032_0", { source: "\n.viewport[data-v-0665d032] {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  /* overflow: hidden; */\n}\n.dot[data-v-0665d032] {\n  position: absolute;\n  left: 50%;\n  top: 100%;\n  transform: translateX(-50%);\n}\n.dot-item[data-v-0665d032] {\n  position: absolute;\n  width: 30px;\n  height: 30px;\n  border: 1px solid red;\n  background-color: green;\n}\n", map: {"version":3,"sources":["C:\\Node.js\\myPlugins\\f-image-slider\\f-image-slider\\src\\components\\Swiper.vue"],"names":[],"mappings":";AAqOA;EACA,kBAAA;EACA,YAAA;EACA,WAAA;EACA,sBAAA;AACA;AAEA;EACA,kBAAA;EACA,SAAA;EACA,SAAA;EACA,2BAAA;AACA;AACA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;EACA,qBAAA;EACA,uBAAA;AACA","file":"Swiper.vue","sourcesContent":["<template>\n  <div class=\"swiper\">\n    <div\n      @touchstart=\"touchstart\"\n      @touchmove=\"touchmove\"\n      @touchend=\"touchend\"\n      class=\"viewport\"\n      data-power\n    >\n      <slot></slot>\n    </div>\n  </div>\n</template>\n\n<script>\nexport default {\n  props: {\n    value: {\n      type: String,\n      default: \"\"\n    },\n    autoplay: {\n      type: Boolean,\n      default: false\n    },\n    timeout: {\n      type: Number,\n      default: 2000\n    }\n  },\n  data() {\n    return {\n      currentSelected: \"\",\n      names: [],\n      length: null,\n      timer: null,\n      target: {\n        left: null,\n        self: null,\n        right: null\n      },\n      targetDom: null,\n      viewportWidth: null,\n      touch: {\n        x1: null,\n        x2: null\n      },\n      accDistance: 0,\n      totalDiff: 0\n    };\n  },\n  computed: {\n    // accDistance() {\n    //   return (\n    //     this.targetDom.getBoundingClientRect().left -\n    //     this.targetDom.offsetParent.getBoundingClientRect().left\n    //   );\n    // }\n  },\n  mounted() {\n    let viewport = document.getElementsByClassName(\"viewport\")[0];\n    this.viewportWidth = viewport.clientWidth;\n    let __this = this;\n    window.onresize = function() {\n      __this.viewportWidth = viewport.clientWidth;\n    };\n    this.showChild();\n    this.$children.forEach(child => {\n      this.names.push(child.name);\n    });\n    this.length = this.names.length;\n    if (this.autoplay) {\n      this.run();\n    }\n  },\n  beforeDestroy() {\n    clearInterval(this.timer);\n  },\n  watch: {\n    value() {\n      this.showChild();\n    }\n  },\n  methods: {\n    showChild() {\n      this.currentSelected = this.value || this.$children[0].name;\n      this.$children.forEach(vm => {\n        vm.selected = this.currentSelected;\n      });\n    },\n    run() {\n      this.timer = setInterval(() => {\n        let curIndex = this.names.indexOf(this.currentSelected);\n        let newIndex = (curIndex + 1) % this.length;\n        this.$children.forEach(vm => {\n          vm.direction = \"left\";\n          if (vm.name === 'item2') {\n              console.log(vm.fromSup)\n          }\n        });\n        this.$emit(\"input\", this.names[newIndex]);\n      }, this.timeout);\n    },\n    touchstart(e) {\n      if (e.target.children.length) {\n        return;\n      }\n      clearInterval(this.timer);\n      this.timer = null;\n      this.targetDom = e.targetTouches[0].target;\n      //   this.accDistance =\n      //     this.targetDom.getBoundingClientRect().left -\n      //     this.targetDom.offsetParent.getBoundingClientRect().left;\n      this.touch.x1 = e.targetTouches[0].clientX;\n      let currentIndex = this.names.indexOf(this.currentSelected);\n      let right = (currentIndex + 1 + this.length) % this.length;\n      let left = (currentIndex - 1 + this.length) % this.length;\n      this.$children.forEach(vm => {\n        let vmIndex = this.names.indexOf(vm.name);\n        if (vmIndex === right || vmIndex === left || vmIndex === currentIndex) {\n          if (vmIndex === right) {\n            vm.direction = \"\";\n            vm.flag = true;\n            this.target.right = vm;\n          } else if (vmIndex === left) {\n            vm.direction = \"\";\n            vm.flag = true;\n            this.target.left = vm;\n          } else if (vmIndex === currentIndex) {\n            vm.direction = \"\";\n            vm.flag = true;\n            this.target.self = vm;\n          }\n        }\n      });\n      this.translate(this.targetDom, 0);\n    },\n    touchmove(e) {\n      if (this.targetDom == null) {\n        return;\n      }\n      this.touch.x2 = e.targetTouches[0].clientX;\n      this.totalDiff = this.touch.x2 - this.touch.x1;\n\n      //   this.translate(this.targetDom, this.totalDiff + this.accDistance);\n      this.translate(this.targetDom, this.totalDiff);\n    },\n    touchend(e) {\n      //   console.log(parseInt(getComputedStyle(this.targetDom).left));\n      //   console.log(this.accDistance)\n      //   console.log(this.viewportWidth);\n      if (this.targetDom == null) {\n        return;\n      }\n      if (this.totalDiff > this.viewportWidth / 2) {\n        this.translate(\n          this.targetDom,\n          this.viewportWidth,\n          // this.viewportWidth,\n          (this.viewportWidth - this.totalDiff) / this.viewportWidth,\n          false\n        );\n        // this.target.left.direction = \"right\";\n        this.$emit(\"input\", this.target.left.name);\n      } else if (-this.totalDiff > this.viewportWidth / 2) {\n        this.translate(\n          this.targetDom,\n          -this.viewportWidth + this.totalDiff,\n          (this.viewportWidth + this.totalDiff) / this.viewportWidth,\n          false\n        );\n        // this.target.right.direction = \"left\";\n        this.$emit(\"input\", this.target.right.name);\n      } else {\n        this.translate(\n          this.targetDom,\n          0,\n          (this.totalDiff > 0 ? this.totalDiff : -this.totalDiff) /\n            this.viewportWidth,\n          false\n        );\n        // this.$emit(\"input\", this.target.self.name);\n        this.target.self.direction = \"onlyleft\";\n        console.log(this.currentSelected)\n      }\n    },\n    translate(elem, diff, durationTime, flag) {\n      let name = this.target.self.name;\n      let __this = this;\n      setTimeout(() => {\n        if (flag === false) {\n          __this.target.self.flag = __this.target.left.flag = __this.target.right.flag = flag;\n          __this.target.self.fromSup = __this.target.left.fromSup = __this.target.right.fromSup = {}\n          __this.target.self.zIndex = 0;\n          __this.target.self.direction = __this.target.left.direction = __this.target.right.direction =\n            \"left\";\n          this.touch.x1 = this.touch.x2 = this.totalDiff = null;\n          //   this.target.left.direction = this.target.self.direction = this.target.right.direction = 'left'\n          this.targetDom = null;\n          //   this.target.left = this.target.right = this.target.self = null\n\n          if (!this.timer) {\n            this.run();\n          }\n        }\n      }, durationTime * 300);\n      let viewportWidth = this.viewportWidth;\n      diff = diff > viewportWidth ? viewportWidth : diff;\n      diff = -diff > viewportWidth ? -viewportWidth : diff;\n      this.target.left.fromSup = {\n        left: diff - this.viewportWidth + \"px\",\n        transitionProperty: \"left\",\n        transitionDuration: (durationTime || 0) * 0.3 + \"s\"\n      };\n      this.target.right.fromSup = {\n        left: diff + this.viewportWidth + \"px\",\n        transitionProperty: \"left\",\n        transitionDuration: (durationTime || 0) * 0.3 + \"s\"\n      };\n      elem.style.left = diff + \"px\";\n      elem.style.zIndex = 1;\n      elem.style.transitionProperty = \"left\";\n      elem.style.transitionDuration = (durationTime || 0) * 0.3 + \"s\";\n    }\n  }\n};\n</script>\n\n<style scoped>\n.viewport {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  /* overflow: hidden; */\n}\n\n.dot {\n  position: absolute;\n  left: 50%;\n  top: 100%;\n  transform: translateX(-50%);\n}\n.dot-item {\n  position: absolute;\n  width: 30px;\n  height: 30px;\n  border: 1px solid red;\n  background-color: green;\n}\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = "data-v-0665d032";
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__ = normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      createInjector,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  var script$1 = {
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
        flag: false,
        fromSup: {}
      };
    },

    watch: {
      direction() {//   console.log(this.direction)
      },

      flag() {
        this.$parent.viewportDom = document.querySelector('div[data-power]');
      }

    }
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("transition", { attrs: { name: _vm.direction } }, [
      _vm.isShow
        ? _c(
            "div",
            { staticClass: "swiper-item", style: _vm.fromSup },
            [_vm._t("default")],
            2
          )
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-eb2a2f64_0", { source: "\n.swiper-item[data-v-eb2a2f64] {\n  position: absolute;\n  width: 100%;\n}\n.left-enter-active[data-v-eb2a2f64],\n.left-leave-active[data-v-eb2a2f64],\n.right-enter-active[data-v-eb2a2f64],\n.right-leave-active[data-v-eb2a2f64],\n.onlyleave-leave-active[data-v-eb2a2f64] {\n  transition: .3s all ease;\n  position: absolute;\n}\n.left-enter[data-v-eb2a2f64],\n.right-leave-to[data-v-eb2a2f64] {\n  transform: translateX(100%);\n  /* left: 100%; */\n}\n.left-leave-to[data-v-eb2a2f64],\n.right-enter[data-v-eb2a2f64],\n.onlyleave-leave-to[data-v-eb2a2f64] {\n  transform: translateX(-100%);\n  /* left: -100%; */\n}\n", map: {"version":3,"sources":["C:\\Node.js\\myPlugins\\f-image-slider\\f-image-slider\\src\\components\\SwiperItem.vue"],"names":[],"mappings":";AA2CA;EACA,kBAAA;EACA,WAAA;AACA;AACA;;;;;EAKA,wBAAA;EACA,kBAAA;AACA;AACA;;EAEA,2BAAA;EACA,gBAAA;AACA;AACA;;;EAGA,4BAAA;EACA,iBAAA;AACA","file":"SwiperItem.vue","sourcesContent":["<template>\n  <transition :name=\"direction\">\n    <div class=\"swiper-item\" v-if=\"isShow\" :style=\"fromSup\">\n      <slot></slot>\n    </div>\n  </transition>\n</template>\n\n<script>\nexport default {\n  props: {\n    name: {\n      type: String,\n      required: true\n    }\n  },\n  computed: {\n    isShow() {\n      return this.selected === this.name || this.flag;\n    }\n  },\n  data() {\n    return {\n      selected: \"\",\n      direction: \"onlyleave\",\n      flag: false,\n      fromSup: {\n\n      }\n    };\n  },\n  watch: {\n    direction() {\n      //   console.log(this.direction)\n    },\n    flag () {\n        this.$parent.viewportDom = document.querySelector('div[data-power]')\n    }\n  }\n};\n</script>\n\n<style scoped>\n.swiper-item {\n  position: absolute;\n  width: 100%;\n}\n.left-enter-active,\n.left-leave-active,\n.right-enter-active,\n.right-leave-active,\n.onlyleave-leave-active {\n  transition: .3s all ease;\n  position: absolute;\n}\n.left-enter,\n.right-leave-to {\n  transform: translateX(100%);\n  /* left: 100%; */\n}\n.left-leave-to,\n.right-enter,\n.onlyleave-leave-to {\n  transform: translateX(-100%);\n  /* left: -100%; */\n}\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$1 = "data-v-eb2a2f64";
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$1 = normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      createInjector,
      undefined,
      undefined
    );

  __vue_component__.install = function (Vue) {
    Vue.component('swiper', __vue_component__);
    Vue.component('swiper-item', __vue_component__$1);
  };

  return __vue_component__;

})));
//# sourceMappingURL=FImageSlider.umd.js.map
