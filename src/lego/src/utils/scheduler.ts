/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import { kvType } from "../sdk/core";
const {
  requestAnimationFrame,
  cancelAnimationFrame,
  webkitRequestAnimationFrame,
  webkitCancelAnimationFrame
} = <kvType>window;
const RAF = requestAnimationFrame || webkitRequestAnimationFrame;
const CRAF = cancelAnimationFrame || webkitCancelAnimationFrame;
const MDate = performance || Date;

const highSL: any[] = [];
const lowSL: any[] = [];

let isRunning = false;
let start: any = null;

const step = () => {
  if (!highSL.length && !lowSL.length) {
    isRunning = false;
    return;
  }

  let now = MDate.now();
  if (now - start > 50) {
    start = now;
    RAF(step);
    isRunning = true;
    return;
  }

  const end = start + 50;

  while (end - now > 5) {
    if (!highSL.length && !lowSL.length) {
      isRunning = false;
      return;
    }
    const taskCb = highSL.length ? highSL.shift() : lowSL.shift();
    taskCb();
    now = MDate.now();
  }

  isRunning = true;
  RAF(step);
};

const addTask = (cb: Function, highLevel?: boolean) => {
  if (Object.prototype.toString.call(cb) !== "[object Function]") {
    return;
  }
  if (!start) {
    start = MDate.now();
  }

  highLevel ? highSL.push(cb) : lowSL.push(cb);
  if (!isRunning) {
    isRunning = true;
    RAF(step);
  }
};

export { addTask, RAF, CRAF };
