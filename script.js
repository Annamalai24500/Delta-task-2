let canvas = document.querySelector('canvas');
let div = document.querySelector('div');
let pause = document.getElementById('pause');
let resume = document.getElementById('resume');
let reset = document.getElementById('reset');
let keys = document.getElementById('keys');
let shards = document.getElementById('shards');
let systemhealth = document.getElementById('sys');
let playerhealth = document.getElementById('pl');
let highscore = document.getElementById('highscore');
let gameover = document.getElementById('gameover');
canvas.width = document.documentElement.clientWidth * 2;
canvas.height = document.documentElement.clientHeight * 2;
let c = canvas.getContext('2d');
window.addEventListener('DOMContentLoaded', () => {
    window.scrollTo({ left: 2700, top: 700, behavior: 'smooth' });
});

let mouse = { x: 2750, y: 750 };
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
    mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
});
let playing =true;
resume.classList.add('disabled');
pause.addEventListener('click',()=>{

    playing=false;
    pause.classList.add('disabled');
    resume.classList.remove('disabled');
});
resume.addEventListener('click',()=>{
    playing=true;
    pause.classList.remove('disabled');
    resume.classList.add('disabled');
});
reset.addEventListener('click',()=>{
  resetgame();
  playing=true;
})
keys.textContent="Keys: "+0;
shards.textContent="Shards Delivered: "+0;
systemhealth.textContent="System Health:"+50+"%";
playerhealth.textContent="Player Health: "+100+"%";
let ar = [];
let arcpos = [];
let keypos = [];
let keycards = 0;
let noofshards=0;
let dechealth=0;
let decplhealth=0;
let highscorepl=0;
function resetgame(){
    window.location.reload();
}
function inarc(gpx, gpy, carcx, carcy, arcrotation,sweepangle) {
    let dx = gpx - carcx;
    let dy = gpy - carcy;
    let diff = Math.sqrt(dx * dx + dy * dy);
    if (diff > 80) return false;
    let angle = Math.atan2(dy, dx);
    if (angle < 0) angle += 2 * Math.PI;
    let start = arcrotation % (2 * Math.PI);
    let end = (arcrotation + sweepangle) % (2 * Math.PI);
    if (start < end) {
        return angle >= start && angle <= end;
    } else {
        return angle >= start && angle <= start;
    }
}
function Rectdraw(x, y) {
    this.x = x;
    this.y = y;
    this.minis = [];
    this.arc = [];
    this.arcCreated = false;
    for (let i = 0; i < 5; i++) {
        let a = Math.random() * 70 + this.x;
        let b = Math.random() * 70 + this.y;
        let mini = { x: a, y: b };
        this.minis.push(mini);
        ar.push(mini);
    }

    this.draw = function () {
        if (this.x === 2700 && this.y === 700) {
            c.fillStyle = "#1E90FF";
        } else {
            c.fillStyle = "#00FF00";
        }
        c.fillRect(this.x, this.y, 100, 100);
    };

    this.minidraw = function () {
        c.fillStyle = "black";
        for (let i = 0; i < this.minis.length; i++) {
            c.fillRect(this.minis[i].x, this.minis[i].y, 20, 20);
        }
    };

    this.linedraw = function () {
        if (this.x + 200 < canvas.width && this.y + 200 < canvas.height) {
            c.strokeStyle = "#00FF00";
            c.beginPath();
            c.moveTo(this.x + 150, 0);
            c.lineTo(this.x + 150, canvas.height);
            c.moveTo(0, this.y + 150);
            c.lineTo(canvas.width, this.y + 150);
            c.stroke();
            c.closePath();
        }
    };

    this.createarc = function () {
        if (!this.arcCreated && (this.x != 2700 || this.y != 700)) {
            this.centrex = this.x + 50;
            this.centrey = this.y + 50;
            let miniarc = { x: this.centrex, y: this.centrey, rotation: 0, direction: 1 };
            arcpos.push(miniarc);
            this.arcCreated = true;
        }
    };
    this.update=function(){
         for (let i = bullets.length - 1; i >= 0; i--){
            let bullet=bullets[i];
            for(let j=0;j<this.minis.length;j++){
                if(bullet.dx<0 || bullet.dy<0){
                let distx = bullet.x - ((2 * this.minis[j].x + 20) / 2);
                let disty = bullet.y - ((2 * this.minis[j].y + 20) / 2);
                let distance = Math.sqrt(distx*distx+disty*disty);
                if (distance < 15) {
                    
                    this.minis.splice(j,1);
                    bullet.dx+=0.10;
                    break;
                }
                }
               
                
            }
         }
    }
}
function rotatingarc() {
    for (let i = 0; i < arcpos.length; i++) {
        let arc = arcpos[i];
        if (!arc.direction) arc.direction = 1;

        if (arc.rotation >= 2 * Math.PI) arc.rotation = 0;
        arc.rotation += arc.direction * 0.01;

        c.save();
        c.translate(arc.x, arc.y);
        c.rotate(arc.rotation);
        c.beginPath();
        c.globalAlpha=0.7;
        c.fillStyle = "#FF1A1A";
        c.strokeStyle = "#FF1111";
        c.moveTo(0, 0);
        c.arc(0, 0, 80, 0, Math.PI / 3);
        c.lineTo(0, 0);
        c.fill();
        c.stroke();
        c.closePath();
        c.restore();
    }
}
let timer=null;
function updatehealth(){
    clearInterval(timer);
    timer = setInterval(()=>{
    if(!playing){
        return;
    }
     dechealth++;
     let update = 50-dechealth;
     if(dechealth==26){
        systemhealth.textContent="GAME LOST";
        gameover.textContent="GAME OVER";
        gameover.classList.add('gameover');
        return;
     }
     systemhealth.textContent="System Health:"+update+"%";
  },10000);
    
    
}
let shard=0;
function highscoreplayer(){
   let score=setInterval(()=>{
    if(shard==noofshards){
         gameover.textContent="GAME WON";
         gameover.classList.add('gameover');
        if(highscorepl<Number(localStorage.getItem("score"))){
        localStorage.setItem("score",highscorepl);
        }
        return;
    }
    highscorepl++;
    highscore.textContent="High Score: "+localStorage.getItem("score");
   },3000);     
}

function Circle(x, y) {
    this.x = x;
    this.y = y;
    this.num = Math.floor(Math.random() * 15) + 5;
    this.keys = [];
    this.bullet=[];
    this.shardslength = Math.floor(Math.random()*(this.num-3))+2;
    shard=this.shardslength;
    this.shards=[];
    this.cuts = [];
    console.log(`${this.num} the total no of keys`);
    
    let remaining = this.num - this.shardslength;
    let cuts = [];

    for (let i = 0; i < this.shardslength - 1; i++) {
    cuts.push(Math.floor(Math.random() * (remaining + 1)));
    }
    cuts.sort((a, b) => a - b);
    cuts.unshift(0);
    cuts.push(remaining);

    for (let i = 1; i < cuts.length; i++) {
    this.shards.push(cuts[i] - cuts[i - 1] + 1);
    }
    for(let i=0;i<this.shardslength;i++){
        console.log(this.shards[i]);
    }
    for (let i = 0; i < this.num; i++) {
        let a = Math.random() * (2800-100) + 100;
        let b = Math.random() * (1100-100) + 100;
        this.keys.push({ x: a, y: b });
        
    }
    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, 10, 0, Math.PI * 2);
        c.fillStyle = "#CCFF00";
        c.fill();
        c.closePath();
    };
    this.generatekeys = function () {
        for (let i = 0; i < this.keys.length; i++) {
            c.beginPath();
            c.fillStyle = "#c6ddff";
            c.arc(this.keys[i].x, this.keys[i].y, 4, 0, Math.PI * 2, false);
            c.fill();
            c.closePath();
        }
    }
    this.generateAUREX = function () {
        c.beginPath();
        c.arc(2750, 750, 30, 0, Math.PI * 2);
        c.fillStyle = "#102E50";
        c.fill();
        c.closePath();
    }
    this.update = function () {
        if (mouse.y <= 1200 && mouse.x <= 2800 && mouse.x >= 100 && mouse.y >= 100) {
             this.notcollide = true;
            for (let i = 0; i < ar.length; i++) {
                let distx = mouse.x - ((2 * ar[i].x + 20) / 2);
                let disty = mouse.y - ((2 * ar[i].y + 20) / 2);
                let distance = Math.sqrt(distx * distx + disty * disty);
                if (distance < 20) {
                    this.notcollide = false;
                    break;
                }
            }
            for (let i = 0; i < arcpos.length; i++) {
                if (inarc(mouse.x, mouse.y, arcpos[i].x, arcpos[i].y, arcpos[i].rotation, Math.PI / 3)) {
                    decplhealth+=0.25;
                    let update = 100-decplhealth;
                    if(decplhealth>=100){
                        gameover.textContent="GAME LOST";
                        gameover.classList.add('gameover');
                        return;
                    }
                    playerhealth.textContent="Player Health: "+update;
                    break;
                }
            }
            for (let i = 0; i < this.keys.length; i++) {
                let disx = this.x - this.keys[i].x;
                let disy = this.y - this.keys[i].y;
                let dis = Math.sqrt(disx * disx + disy * disy);
                if (dis < 14) {
                    this.notcollide = true;
                    this.keys.splice(i, 1);
                    keycards++;
                    keys.textContent="Keys: "+keycards;
                    i--;
                    break;
                }
            }
            let distx=mouse.x-2750;
            let disty=mouse.y-750;
            let distance = Math.sqrt(distx*distx+disty*disty);
            if (distance<40) {
            let i = 0;
            while (i < this.shards.length) {
            if (keycards >= this.shards[i]) {
            keycards -= this.shards[i];
            noofshards++;
            this.shards.splice(i, 1);
            } else {
            i++;
            }
        }
            keys.textContent = "Keys: " + keycards;
            shards.textContent = "Shards Delivered: " + noofshards;

        }

           
            if (this.notcollide) {
                this.x = mouse.x;
                this.y = mouse.y;
            }
        }
        
        this.generatekeys();
        this.generateAUREX();
        this.draw();
        
    };
}

let shooter = new Circle(2700, 700);
let bullets = [];
let keyState = {};

document.addEventListener('keydown', (event) => {
    if (event.key === 'a' && !keyState['a']) {
        keyState['a'] = true;
        bullets.push({ x: shooter.x, y: shooter.y, dx: -3, dy: 0 });
    }
    if (event.key === 'w' && !keyState['w']) {
        keyState['w'] = true;
        bullets.push({ x: shooter.x, y: shooter.y, dx: 0, dy: -3 });
    }
});

document.addEventListener('keyup', (event) => {
    keyState[event.key] = false;
});

function createbullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];

        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        if (bullet.dx < 0) bullet.dx += 0.003;
        if (bullet.dy < 0) bullet.dy += 0.003;

        c.beginPath();
        c.arc(bullet.x, bullet.y, 8, 0, Math.PI * 2, false);
        c.fillStyle = "#FFFFF0";
        c.fill();
        c.closePath();
        for(let j=0;j<arcpos.length;j++){
            if(bullet.dx<0 || bullet.dy<0){
             if(inarc(bullet.x,bullet.y,arcpos[j].x, arcpos[j].y, arcpos[j].rotation, Math.PI / 3)){
                arcpos.splice(j,1);
                if(bullet.dx<0){
                bullet.dx+=0.10;
                break;
                }
                if(bullet.dy<0){
                bullet.dy+=0.10;
                break;
                }
            }
            }
           
        }
        if (bullet.x < 100 || bullet.y < 100) {
            bullets.splice(i, 1);
        }
        
    }
}


let rectArray = [];
for (let i = 100; i + 200 < canvas.height; i += 200) {
    for (let j = 100; j + 200 < canvas.width; j += 200) {
        rectArray.push(new Rectdraw(j, i));
    }
}

updatehealth();
highscoreplayer();

function animate() {

    if(playing){
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < rectArray.length; i++) {
        rectArray[i].draw();
        rectArray[i].minidraw();
        rectArray[i].linedraw();
        rectArray[i].createarc();
        rectArray[i].update();
    }

    rotatingarc();
    
    shooter.update();
    createbullets();
    
}
   
    requestAnimationFrame(animate);

}

animate();


