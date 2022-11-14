

async function init(){
    model = await tf.loadLayersModel('./models/model.json');
    console.log('load model...');
}

function submit(){
    const seclectFile = document.getElementById('input').files[0];
    console.log(seclectFile);
    let reader = new FileReader();
    reader.onload = e=>{
        let img = document.createElement('img');
        img.src = e.target.result;
        img.width=144;
        img.height=144;
        img.onload = ()=>{
            const showImage = document.getElementById('showImage');
            showImage.innerHTML = '';
            showImage.appendChild(img);
            predict(img);
        }
    }
    reader.readAsDataURL(seclectFile);
}
function findMaxIndex(a){
    const arr = Array.from(a);
    let max = 0;
    let index = 0;
    for(let i=0; i<arr.length; i++){
        if(arr[i] > max){
            max = arr[i];
            index = i;
        }
    }
    return {predNum: index, predProb: max};
}
function predict(imgElement){
    const tfImg = tf.browser.fromPixels(imgElement, 1);
    const smallImg = tf.image.resizeBilinear(tfImg, [28, 28]);
    let tensor = smallImg.reshape([1, -1]);
    tensor = tensor.div(255);
    const pred = model.predict(tensor);
    const result = pred.dataSync();
    const {predNum, predProb} = findMaxIndex(result);
    console.log(predNum, predProb);
    document.getElementById('resultValue').innerHTML = predNum;
}