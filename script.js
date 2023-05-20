let last=0
var bsize = 20;
var score = 0;
var sBody = [];
var vX=0;
var vY=0;
var lifes = 5
var pause = false
var pTime = 120
var colors = ['orange','blue','cyan','red','brown',"violet"]
var food = []
var bX=0
var bY=0
var speed = 10

function setBuff(){
    bX = Math.floor(Math.random()*(bsize-4))+2
    bY = Math.floor(Math.random()*(bsize-4))+2
    let arr = [bX,bY]
    if (isInArray(arr,sBody) || isInArray(arr,food)){
        setBuff()
    }
}

function setTarget(){
    document.getElementById('target').innerHTML = ''
    for (let i = 0; i < colors.length ; i++){
        tile = document.createElement('div')
        tile.classList.add(colors[i])
        tile.classList.add('unEaten')
        document.getElementById('target').append(tile)
    }

}

function setFood(){
    for (let i=0;i<colors.length;i++){
        let fX = Math.floor(Math.random()*(bsize-4))+2
        let fY = Math.floor(Math.random()*(bsize-4))+2
        arr = [fX,fY]
        if (isInArray(arr,sBody) || isInArray(arr,food)){
            i--;
        }
        else{
            food.push([fX,fY])
        }
    }
}


function timer(){
    const timeEle = document.getElementById('timer')
    displayTime()
    countDown = setInterval(()=>{
        pTime --;
        displayTime()
        if (pTime==0){
            alert("GameOver")
            reset()
        }
    },1000)
    function displayTime(){
        let sec = pTime%60
        let min = Math.floor(pTime/60)
        timeEle.innerHTML = `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`
    }
}

function pausee() {
    if (!pause) {
        vX = 0
        vY = 0
        clearInterval(countDown)
        document.getElementById("pause").innerHTML = "Resume"
        pause = true
        document.removeEventListener('keydown',changeDirection)
        
    } 
    else if (pause) {
        document.addEventListener('keydown', changeDirection)
        document.getElementById("pause").innerHTML = "Pause"
        timer()
        pause = false
    }
}

function reset(){
    let hiscoreObj = localStorage.getItem("hiscore")
    let hiscoreval = JSON.parse(hiscoreObj)
    if (score > hiscoreval){
        localStorage.setItem("hiscore",JSON.stringify(score))
    }
    window.location.reload()

}

function dispHS(){
    let Obj = localStorage.getItem("hiscore")
    if (Obj == null){
        let Val = 0;
        localStorage.setItem("hiscore",JSON.stringify(Val))
    }
    else{
        let Val = JSON.parse(Obj)
        document.getElementById("highScore").innerHTML = 'High Score : ' + Val     
    }
}

function isInArray(value,arr){
    for(let i=0;i<arr.length;i++){
        if(arr[i][0]==value[0] && arr[i][1]==value[1]){
            return true
        }
    }
    return false
}


function startPosition(){
    let r1 = Math.floor(Math.random()*(bsize-4))+3
    let r2 = Math.floor(Math.random()*(bsize-4))+3
    let l = sBody.length
    for (let i=0;i<l;i++){
        sBody.shift()
    }
    sBody.push([r1,r2])
    sBody.push([r1-1,r2])
    sBody.push([r1-2,r2])
}

function setBoard(){
    element = document.getElementById('gbox')
    const style = getComputedStyle(element)
    let len = style.height
        for(let i=1;i<=bsize;i++){
            for(let j=1;j<=bsize;j++){
                let tile = document.createElement('div')
                tile.id  = j.toString()+'/'+i.toString()
                tile.classList.add("tile")
                if (vX == -1 && vY == 0) {
                    tile.classList.add("faceLeft")
                }
                else if (vX == 1 && vY == 0) {
                    tile.classList.add("faceRight")
                }
                else if (vX == 0 && vY == -1) {
                    tile.classList.add("faceTop")
                }
                else if (vX == 0 && vY == 1) {
                    tile.classList.add("faceBottom")
                }
                tile.style.height = (parseInt(len)/bsize).toString() + 'px'
                tile.style.width = (parseInt(len)/bsize).toString() + 'px'

                document.getElementById('gbox').append(tile)
            }
        }
    }

function dispHearts(){
    let heart = "❤️"
    let disp = heart.repeat(lifes)
    document.getElementById('hearts').innerHTML = disp
}
    
function ruleBreak(){
    vX=0
    vY=0
    lifes--;
    dispHearts()
    if (lifes==0){
        alert("GameOver")
        reset()
    }
    document.innerHTML=""
    setUp()
}

function changeDirection(e){
    if ((e.key=="ArrowLeft" || e.key == 'a') && vX!=1){
        vX = -1
        vY = 0
    }
    else if((e.key=="ArrowRight" || e.key == 'd') && vX!=-1){
        vX = 1
        vY = 0
    }
    else if((e.key=="ArrowUp" || e.key == 'w') && vY!=1){
        vX = 0
        vY = -1
    }
    else if((e.key=="ArrowDown" || e.key == 's') && vY!=-1){
        vX = 0
        vY = 1
    }
}

function otherlistener(e){
    if(e.key=="Escape" || e.code=='Space'){
        pausee()
    }
}

function letsmove(cur){
    window.requestAnimationFrame(letsmove)
    if((cur-last)/1000<(1/speed)){
        return
    }
    last=cur
    let hX = sBody[0][0] + vX
    let hY = sBody[0][1] + vY
    
    
    if(hX>bsize || hY>bsize || hX<1 || hY<1){
        ruleBreak() 
        return
    }
    else if (food.length == 0){
        setFood()
        setTarget()
        sBody.unshift([hX,hY])
        pTime+=15
    }
    else if (sBody.length == 0){
        ruleBreak() 
        return
    }
    else if (hX==food[0][0] && hY==food[0][1]){
        score+=1
        document.getElementById('score').innerHTML = "Score: "+score.toString()
        food.shift()
        let obj = document.getElementsByClassName('unEaten')
        arr = Array.from(obj)
        arr[0].classList.remove('unEaten') 
        arr[0].classList.add('Eaten') 
        if(isInArray([hX,hY],sBody)){
            ruleBreak() 
            return
        }
        for(let i=sBody.length-1;i>=1;i--){
            sBody[i] = {...sBody[i-1]} 
        }
        sBody[0][0] = hX
        sBody[0][1] = hY
        if ((score)%(2*colors.length)==0){
            if (bX==0 && bY==0){
                setBuff()
            }
        }

    }
    else if (hX==bX && hY==bY){
        sBody.pop()
        bX=0
        bY=0
    }
    else if (!(vX==0 && vY==0)){
        if(isInArray([hX,hY],sBody)){
            ruleBreak() 
            return
        }
        for(let i=sBody.length-1;i>=1;i--){
            sBody[i] = {...sBody[i-1]} 
        }
        sBody[0][0] = hX
        sBody[0][1] = hY
    }
        
    updateSnake()
}

function updateSnake() {
    document.getElementById('gbox').innerHTML = ''
    setBoard()
    if (bX!=0 && bY!=0){
        let buff = bX.toString() +'/'+ bY.toString();
        document.getElementById(buff).classList.add("buff");
    }
    for (let i = 0; i < food.length; i++) {
        a = food[food.length-1-i][0]
        b = food[food.length-1-i][1]
        if (!(isInArray([a,b],sBody))){
            let ele = food[food.length-1-i][0].toString() +'/'+ food[food.length-1-i][1].toString();
            document.getElementById(ele).classList.add(colors[colors.length-1-i]);
        }
    }
    
    let head = sBody[0][0].toString() +'/'+ sBody[0][1].toString();
    document.getElementById(head).classList.add("head");
    for (let i = 1; i < sBody.length; i++) {
            let ele = sBody[i][0].toString() +'/'+ sBody[i][1].toString();
            document.getElementById(ele).classList.add('tail');

    }   
}

const setUp = ()=>{
    startPosition()   
    updateSnake()
    dispHearts()
    dispHS()
    document.addEventListener('keydown',changeDirection)
    document.addEventListener('keydown',otherlistener)
    window.requestAnimationFrame(letsmove)
}

setBuff()  

window.onload = function () {
    setTarget()
    setUp()
    timer()
    setFood()
}