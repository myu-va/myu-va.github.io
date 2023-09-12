let quizHead = document.querySelector(".quiz-head");

let quizNum = document.querySelector(".quiz-num");
let quizarea = document.querySelector(".quiz");

let judge = document.querySelector(".judge");
judge.textContent ="";

let answers = document.querySelectorAll(".answer");
let ans1 = answers[1];
let ans2 = answers[0];

let scoreB = document.querySelector(".score");
let score = 0;
scoreB.textContent = `スコア: ${score}`

let start = document.querySelector(".start");
let startp = document.querySelector(".startp");
let startp2 = document.querySelector(".startp2");
let restart = document.querySelector(".restart");
let qonly = document.querySelector(".quizonly");
let num,q,qq,r;
start.onclick = () => {
    // startp = "";
    start.style.opacity = "0";
    // start.style.display = "none";
    start.style.height = "0";
    qonly.style.display = "block";
}
restart.style.display = "none";
restart.onclick = ()=> {
    restart.style.backgroundColor = "white";
    location.reload();
}



// json読み込み準備
async function quizer() {
    const requestURL = "quiz.json";
    const request = new Request(requestURL);

    const response = await fetch(request);
    const quizzes = await response.json();

    questions(quizzes);
}

function questions(obj) {
    num = 0;
    q = obj.cook;
    quizHead.textContent = `料理のクイズ 全${q.length}問`;
    qq = q.length;
    tick();
}

function tick() {
    if(num !== 0) {
            clearInterval(timerId);
            count=0;
            timerId = setInterval(normal, 400);
    } 
    judge.textContent ="";
    r = random(q.length);
    num++;
    quizNum.textContent = `問題${num}`;
    quizarea.textContent = q[r].quiz;
    let anss = [q[r].miss,q[r].answer];
    let r2 = random(anss.length);
    ans1.textContent = `1： ${anss[r2]}`;
    if(r2 == 1) {
    ans2.textContent = `2： ${anss[0]}`;
    } else {
    ans2.textContent = `2： ${anss[1]}`;
    }

    ans1.onclick = () => {
        check(ans1);
    }
    ans2.onclick = () => {
        check(ans2);
    }    
}

function test(ans,ticks) {
    judge.textContent = ans;
    q.splice(r, 1);
    clearInterval(timerId);
    count=0;
    timerId = setInterval(ticks,160);

    if(q.length === 0) {
        startp.textContent = "";

        setTimeout(function() {
            // start.style.display = "block";
            start.style.transition = "height .5s step-end, opacity .5s ease";
            start.style.opacity = "1";
            start.style.height = "100%";
            
            clearInterval(timerId);
            setTimeout(function(){
                startp.style.paddingLeft = "0.7em";
                startp2.style.paddingLeft = "0.7em";
                startp.textContent = "お疲れ様です。";
                startp2.textContent = `結果は${score}点でした。`
                // console.log("ll" + qq);
                if(score==qq*10) {
                    startp2.textContent += "満点だ。やったね";
                } else if(score<=qq/2*10) {
                    startp2.textContent += "もう少しがんばって";
                } else if(score == 0) {
                    startp2.textContent += "いっそ奇跡的ですね";
                }
                ctx.clearRect(0,0,width,height);
                canvas.style.zIndex = "3";
                canvas.style.right = "0";
                canvas.style.top = "300px";
                canvas.style.left = "41%";
                anime(0,1);
                restart.style.display = "block";
                start.onclick = () => {
                    return;
                }
            },500);
            
    }, 800)
    }else {
    setTimeout(tick, 600);
    }
}
function check(ans) {
    ans1.onclick = "";
    ans2.onclick = "";
    if(ans.textContent.indexOf(q[r].answer) === -1){
        test("✕不正解", function(){
            react(1)
        });
    } else {
        test("〇正解", function(){
        react(2)
        });
        score += 10;
        scoreB.textContent = `スコア: ${score}`;
    }
}

function random(name) {
    return Math.floor(Math.random() * name)
}


let timerId = NaN;
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let img = document.querySelector(".img");
let width = canvas.width;
let height = canvas.height;
let x = 0;
let count = 0;
let y = 0;

function draw() {
    timerId = setInterval(normal, 400);
}

function anime(x,y){
    ctx.drawImage(img,64*x,64*y,64,64,0,0,64,64);
}

function normal() {
    ctx.clearRect(0,0,width,height);
    switch(count) {
        case 0:
        case 2:
            x=0,y=1;
            count++;
            break;
        case 1:
        case 3:
        case 5:        
            x=0,y=0;
            if(count === 5) {
                count=0;
            } else {
            count++;
            }
            break;
        case 4:
            x=0,y=2;
            count++;
            break;
    }
    anime(x,y);
}

function react(num) {
    ctx.clearRect(0,0,width,height);
    switch(count) {
        case 0:
            x=1,y=0;
            count++;
            break;
        case 1:
            x=1,y=num;
            count++;
            break;
        case 2:
            x=1,y=num;
            count=0;
            break;
    }
    anime(x,y);
}

quizer();
draw();