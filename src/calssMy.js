class myPromise {
  static PENDING = "pending";
  static FULFILLEd = "fulfilled";
  static REJECTED = "rejected";
  constructor(init) {
    this.state = myPromise.PENDING; // promise状态
    this.promiseRes = null; // promise返回值
    this.resolveCallback = []; //成功回调集合
    this.rejectCallback = []; //失败回调集合
    const resolve = result => {
      // 只有当状态为pending时才改变，保证状态一旦改变就不会再变
      if (this.state === myPromise.PENDING) {
        this.state = myPromise.FULFILLEd; //改变状态
        this.promiseRes = result; //返回值
        //依次调用成功回调
        this.resolveCallback.forEach(fn => fn());
      }
    };
    const reject = result => {
      // 只有当状态为pending时才改变，保证状态一旦改变就不会再变
      if (this.state === myPromise.PENDING) {
        this.state = myPromise.REJECTED; //改变状态
        this.promiseRes = result; //返回值
        // 依次调用失败回调
        this.rejectCallback.forEach(fn => fn());
      }
    };
    try {
      init(resolve, reject); // 注意this指向
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled, onRejected) {
    const { promiseRes, state } = this;
    let promise = new myPromise((reso, reje) => {
      const resolveMyPromise = promiseRes => {
        try {
          if (typeof onFulfilled !== "function") {
            // 如果then的第一个回调不是一个函数，直接忽略，返回一个新的promise
            reso(promiseRes);
          } else {
            // 获取第一个回调的执行结果
            const res = onFulfilled(promiseRes);
            // 看该执行结果是否是一个promise
            if (res instanceof myPromise) {
              // 是一个promise,等它状态改变后再改变then返回的promise状态
              res.then(reso, rej);
            } else {
              // 不是一个promise，将它作为新的promise的resolve
              reso(res);
            }
          }
        } catch (err) {
          //异常，直接将新的promise状态置为rejected
          reje(err);
        }
      };
      const rejectMyPromise = promiseRes => {
        try {
          if (typeof onRejected !== "function") {
            // 如果then的第二个回调不是一个函数，直接忽略，返回一个新的promise
            reje(promiseRes);
          } else {
            // 获取第二个回调的执行结果
            const res = onRejected(promiseRes);
            // 看该执行结果是否是一个promise
            if (res instanceof myPromise) {
              // 是一个promise,等它状态改变后再改变then返回的promise状态
              res.then(reso, rej);
            } else {
              // 不是一个promise，将它作为新的promise的resolve
              reje(res);
            }
          }
        } catch (err) {
          //异常，直接将新的promise状态置为rejected
          reje(err);
        }
      };
      if (state === myPromise.FULFILLEd) {
        resolveMyPromise(promiseRes);
      }
      if (state === myPromise.REJECTED) {
        rejectMyPromise(promiseRes);
      }
      if (state === myPromise.PENDING) {
        if (onFulfilled && typeof onFulfilled === "function") {
          this.resolveCallback.push(() =>
            // 这里我们用setTimeout来模拟实现then的微任务
            setTimeout(() => {
              resolveMyPromise(this.promiseRes);
            }, 0)
          );
        }
        if (onRejected && typeof onRejected === "function") {
          this.rejectCallback.push(() =>
            // 这里我们用setTimeout来模拟实现then的微任务
            setTimeout(() => {
              rejectMyPromise(this.promiseRes);
            }, 0)
          );
        }
      }
    });
    return promise;
  }
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
}

export default myPromise;
