import MyPromise from "./function2";
var p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(4);
  }, 0);
});
p.then(res => {
  //4 res
  console.log(res, "res");
  return "12";
}).then(res => {
  console.log(res);
});
