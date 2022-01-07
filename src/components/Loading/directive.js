import Vue from "vue";
import Loading from "./areaLoading.vue";

const hasClass = (el, className) => {
  let classPattern = new RegExp(`\\b${className}\\b`);
  return el.className.match(classPattern) ? true : false;
};

const addClass = (el, classes) => {
  if (!el || !classes) return;
  let classList = classes.split(" ");
  classList.forEach((className) => {
    if (!hasClass(el, className)) {
      el.className += ` ${className}`;
    }
  });
};

const removeClass = (el, classes) => {
  if (!el || !classes) return;
  let classList = classes.split(" ");
  classList.forEach((className) => {
    let classPattern = new RegExp(`\\b${className}\\b`);
    if (hasClass(el, className)) {
      el.className = el.className.replace(classPattern, "");
    }
  });
};
const LoadingConstructor = Vue.extend(Loading);

const initLoading = (el) => {
  if (!el.loadingInserted) {
    el.appendChild(el.loading.$el);
    el.loadingInserted = true;
  }
  if (el.originalPosition !== "absolute" && el.originalPosition !== "fixed") {
    addClass(el, "color-area-loading--parent-relative");
  }
  el.loading.visible = true;
};

const toggleLoading = (el, binding) => {
  if (binding.value) {
    el.originalPosition = getComputedStyle(el).position;
    initLoading(el, binding);
  } else {
    el.loading.$on("after-leave", () => {
      removeClass(el, "color-area-loading--parent-relative");
    });
    el.loading.visible = false;
  }
};

const loadingDirective = {
  bind: (el, binding) => {
    let text = el.getAttribute("loading-text");
    let background = el.getAttribute("loading-background");
    let color = el.getAttribute("loading-color");
    const loading = new LoadingConstructor({
      el: document.createElement("div"),
      propsData: {
        text,
        color,
        background,
      },
    });
    el.loading = loading;

    binding.value && toggleLoading(el, binding);
  },
  update: (el, binding) => {
    /* istanbul ignore else */
    if (binding.value !== binding.oldValue) {
      toggleLoading(el, binding);
    }
  },
};

export default loadingDirective;
