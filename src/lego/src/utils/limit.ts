function limit(func: Function, wait: number, isDebounce: boolean): Function {
  let timeout: number | undefined;
  return function _limit(this: any, ...args: any[]) {
    const context = this;
    // 封装函数,用于延迟调用
    function throttler() {
      // 只是节流函数的时候,对其timeout进行赋值为null,这样可以设置下一次的setTimtout
      timeout = undefined;
      func.apply(context, args);
    }
    // 如果debouce是true的话,前一个函数的调用timeout会被清空,不会被执行
    if (isDebounce) {
      clearTimeout(timeout);
    }
    // 如果debouce是 true 或者 timeout 为空的情况下,设置setTimeout
    if (isDebounce || !timeout) {
      timeout = window.setTimeout(throttler, wait);
    }
  };
}

// 截流
export function throttle(func: Function, wait: number): Function {
  return limit(func, wait, false);
}

// 防抖
export function debounce(func: Function, wait: number): Function {
  return limit(func, wait, true);
}
