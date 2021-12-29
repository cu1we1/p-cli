import "./index.css"
import "@/page/lego";
import img from '@/assets/img.jpeg';

console.log("cuiwei");
new Promise((resolve) => {
	resolve('sucess')
}).then(console.log)

document.querySelector('#img').src = img;