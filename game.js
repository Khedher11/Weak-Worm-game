/* Pink Worm Jump v2.1 */
(()=>{
const canvas=document.getElementById("gameCanvas"),ctx=canvas.getContext("2d");
let W=innerWidth,H=innerHeight;canvas.width=W;canvas.height=H;
addEventListener("resize",()=>{W=innerWidth;H=innerHeight;canvas.width=W;canvas.height=H;groundY=H-groundHeight;});
const gravity=.6,jumpVelocity=-11,groundHeight=60;
const worm={x:W*.2,y:0,w:50,h:28,vy:0};let groundY=H-groundHeight;
const holes=[],holeFreq=100,holeSpeed=5,minHole=70,maxHole=120;let holeTick=0,score=0,milestone=9,gameOver=!1,started=!1;
const o=document.getElementById("overlay"),m=document.getElementById("message"),s=document.getElementById("subMessage"),r=document.getElementById("restartBtn");
function reset(){holes.length=0;worm.y=groundY-worm.h;worm.vy=0;score=0;holeTick=0;gameOver=!1;}
function start(){reset();started=!0;o.style.display="none";loop();}
function end(){gameOver=!0;o.style.display="flex";m.textContent="Game Over";s.textContent="Score: "+score;r.style.display="block";}
function spawn(){const w=Math.random()*(maxHole-minHole)+minHole;holes.push({x:W+w,w});}
function update(){worm.vy+=gravity;worm.y+=worm.vy;worm.y>groundY-worm.h&&(worm.y=groundY-worm.h,worm.vy=0);
holeTick++>holeFreq&&(spawn(),holeTick=0);
for(let i=holes.length-1;i>=0;i--){const h=holes[i];h.x-=holeSpeed;
const hit=worm.x+worm.w>h.x&&worm.x<h.x+h.w;if(hit&&worm.y+worm.h>=groundY)return end();
h.x+h.w<worm.x&&!h.passed&&(score++,h.passed=!0,score===milestone&&msg("❤ I love you Sara! ❤",2600));
h.x+h.w<-20&&holes.splice(i,1);}}
let temp;function msg(t,d){clearTimeout(temp);o.style.display="flex";m.textContent=t;s.textContent="";temp=setTimeout(()=>o.style.display="none",d);}
function draw(){ctx.clearRect(0,0,W,H);ctx.fillStyle="#ffd6e7";ctx.fillRect(0,0,W,H);
ctx.fillStyle="#ffacd9";ctx.fillRect(0,groundY,W,groundHeight);drawWorm();
ctx.fillStyle="#372c2e";holes.forEach(h=>ctx.fillRect(h.x,groundY,h.w,groundHeight));
ctx.fillStyle="#ff4fa8";ctx.font="bold 24px Helvetica Neue, Arial";ctx.fillText("Score: "+score,20,40);}
function drawWorm(){const seg=5,r=worm.h/2,g=(worm.w-r*2)/(seg-1);
for(let i=0;i<seg;i++){const cx=worm.x+r+i*g,cy=worm.y+r;ctx.fillStyle="#ff4fa8";ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
ctx.fillStyle="rgba(255,255,255,.4)";ctx.beginPath();ctx.arc(cx-r*.4,cy-r*.4,r*.4,0,Math.PI*2);ctx.fill();}
ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(worm.x+worm.w-r*.7,worm.y+r*.7,r*.4,0,Math.PI*2);ctx.fill();
ctx.fillStyle="#000";ctx.beginPath();ctx.arc(worm.x+worm.w-r*.6,worm.y+r*.7,r*.2,0,Math.PI*2);ctx.fill();}
function loop(){if(gameOver)return;update();draw();requestAnimationFrame(loop);}
function jump(){if(!started)return start();worm.vy===0&&(worm.vy=jumpVelocity);}
canvas.addEventListener("touchstart",e=>{e.preventDefault();jump();});canvas.addEventListener("mousedown",jump);
r.addEventListener("click",()=>{r.style.display="none";start();});
worm.y=groundY-worm.h;draw();
})();
