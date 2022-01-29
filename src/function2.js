const pending = "pending",
  fulfilled = "fulfilled",
  rejected = "rejected";

function MyPromise(fn) {
  const _this = this;
  this.state = pending;
  this.value;
  this.reason;
  this.onFulfilled = [];
  this.onRejected = [];
  function resolve(value) {
    if (_this.state === pending) {
      _this.state = fulfilled;
      _this.value = value;
      _this.onFulfilled.forEach(item => item(value));
    }
  }
  function reject(reason) {
    if (_this.state === pending) {
      _this.state = rejected;
      _this.reason = reason;
      _this.onRejected.forEach(item => item(reason));
    }
  }
  try {
    fn(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new TypeError("Chaining cycle"));
  }
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    let used;
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          y => {
            if (used) return;
            resolve(y);
            resolvePromise(promise2, y, resolve, reject);
          },
          r => {
            if (used) return;
            used = true;
            reject(r);
          }
        );
      } else {
        if (used) return;
        used = true;
        resolve(x);
      }
    } catch (error) {
      if (used) return;
      used = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  const _this = this;
  const thenOnFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : value => value;
  const thenOnRejected =
    typeof onRejected === "function"
      ? onRejected
      : reason => {
          throw reason;
        };
  let promiseThen = new MyPromise((resolve, reject) => {
    if (_this.state === fulfilled) {
      setTimeout(() => {
        try {
          let x = thenOnFulfilled(_this.value);
          resolvePromise(promiseThen, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    } else if (_this.state === rejected) {
      setTimeout(() => {
        try {
          let x = thenOnRejected(_this.reason);
          resolvePromise(promiseThen, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    } else if (_this.state === pending) {
      _this.onFulfilled.push(() => {
        setTimeout(() => {
          try {
            let x = thenOnFulfilled(_this.value);
            resolvePromise(promiseThen, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
      _this.onRejected.push(() => {
        setTimeout(() => {
          try {
            let x = thenOnRejected(_this.reason);
            resolvePromise(promiseThen, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
    }
  });
  return promiseThen;
};

export default MyPromise;
