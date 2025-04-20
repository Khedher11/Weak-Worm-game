/* Pink Worm Jump v3.3 */
(()=>{
const canvas=document.getElementById("gameCanvas"),ctx=canvas.getContext("2d");
let W=innerWidth,H=innerHeight;canvas.width=W;canvas.height=H;
addEventListener("resize",()=>{W=innerWidth;H=innerHeight;canvas.width=W;canvas.height=H;groundY=H-groundHeight;});
const gravity=.6,jumpVel=-11,groundHeight=60;
const worm={x:W*.2,y:0,w:50,h:28,vy:0};
let groundY=H-groundHeight;
const holes=[],freq=100,speed=5,minW=70,maxW=120;
let tick=0,score=0,target=9,over=!1,start=!1;
const ol=document.getElementById("overlay"),msg=document.getElementById("message"),
      sub=document.getElementById("subMessage"),rst=document.getElementById("restartBtn");
function reset(){holes.length=0;worm.y=groundY-worm.h;worm.vy=0;score=0;tick=0;over=!1;}
function begin(){reset();start=!0;ol.style.display="none";loop();}
function end(t){over=!0;ol.style.display="flex";msg.textContent=t;sub.textContent="";rst.style.display="block";}
function spawn(){const w=Math.random()*(maxW-minW)+minW;holes.push({x:W+w,w});}
function update(){
    worm.vy+=gravity;worm.y+=worm.vy;if(worm.y>groundY-worm.h){worm.y=groundY-worm.h;worm.vy=0;}
    tick++;if(tick>freq){spawn();tick=0;}
    for(let i=holes.length-1;i>=0;i--){const h=holes[i];h.x-=speed;
        if(worm.x+worm.w>h.x&&worm.x<h.x+h.w&&worm.y+worm.h>=groundY) return end("Game Over");
        if(h.x+h.w<worm.x&&!h.done){score++;h.done=!0;if(score===target)return end("❤️ I love you Sara ❤️");}
        if(h.x+h.w<-20) holes.splice(i,1);
    }
}
function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#cfeafd";ctx.fillRect(0,0,W,H);
    ctx.fillStyle="#ffacd9";ctx.fillRect(0,groundY,W,groundHeight);
    const segs=5,r=worm.h/2,g=(worm.w-r*2)/(segs-1);
    for(let i=0;i<segs;i++){const cx=worm.x+r+i*g,cy=worm.y+r;
        ctx.fillStyle="#ff4fa8";ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="rgba(255,255,255,.4)";ctx.beginPath();ctx.arc(cx-r*.4,cy-r*.4,r*.4,0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(worm.x+worm.w-r*.7,worm.y+r*.7,r*.4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#000";ctx.beginPath();ctx.arc(worm.x+worm.w-r*.6,worm.y+r*.7,r*.2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#372c2e";holes.forEach(h=>ctx.fillRect(h.x,groundY,h.w,groundHeight));
    ctx.fillStyle="#ff4fa8";ctx.font="bold 24px Helvetica Neue, Arial";ctx.fillText("Score: "+score,20,40);
}
function loop(){if(over)return;update();draw();requestAnimationFrame(loop);}
function jump(){if(!start)return begin();if(worm.vy===0)worm.vy=jumpVel;}
canvas.addEventListener("touchstart",e=>{e.preventDefault();jump();});
canvas.addEventListener("mousedown",jump);
rst.addEventListener("click",()=>{rst.style.display="none";begin();});
worm.y=groundY-worm.h;draw();
})();
