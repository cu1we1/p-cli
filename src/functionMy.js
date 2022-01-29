function MyPromise(fn) {
  this.PromiseState = "pending";
  this.PromiseResult = undefined;
  this._thenCallBack;
  this._catchCallBack;
  const resolve = value => {
    if (this.PromiseState === "pending") {
      this.PromiseState = "fulfilled";
      this.PromiseResult = value;
      if (value instanceof MyPromise) {
        console.log(11);
      } else {
        setTimeout(() => {
          if (
            this.PromiseState === "fulfilled" &&
            this._thenCallBack &&
            typeof this._thenCallBack === "function"
          ) {
            this._thenCallBack(value);
          } else if (
            this.PromiseState === "rejected" &&
            this._catchCallBack &&
            typeof this._catchCallBack === "function"
          ) {
            this._catchCallBack(error);
          }
        });
      }
    }
  };

  const reject = error => {
    if (this.PromiseState === "pending") {
      this.PromiseState = "rejected";
      this.PromiseResult = error;
      setTimeout(() => {
        if (
          this.PromiseState === "fulfilled" &&
          this._thenCallBack &&
          typeof this._thenCallBack === "function"
        ) {
          this._thenCallBack(value);
        } else if (
          this.PromiseState === "rejected" &&
          this._catchCallBack &&
          typeof this._catchCallBack === "function"
        ) {
          this._catchCallBack(error);
        }
      });
    }
  };

  if (fn && typeof fn === "function") {
    fn(resolve, reject);
  } else {
    throw "必须传入执行器函数！";
  }
}

MyPromise.prototype.then = function (callBack) {
  return new MyPromise((resolve, reject) => {
    if (callBack && typeof callBack === "function") {
      console.log("1111", this.PromiseState);
      this._thenCallBack = value => {
        const res = callBack(value);
        if (this.PromiseState === "fulfilled") {
          resolve(res);
        } else if (this.PromiseState === "rejected") {
          resolve(
            new MyPromise((resolve, reject) => {
              reject(res);
            })
          );
        }
      };
      // if (_this.PromiseState === "fulfilled") {
      // } else if (_this.PromiseState === "rejected") {
      //   _this._catchCallBack = err => {
      //     reject(err);
      //   };
      // }
    }
  });
};
MyPromise.prototype.catch = function (callBack) {
  return new MyPromise((resolve, reject) => {
    if (callBack && typeof callBack === "function") {
      this._catchCallBack = err => {
        const res = callBack(err);
        console.log(222, this.PromiseState);
        resolve(res);
      };
    }
  });
};

export default MyPromise;
