let canvas = document.querySelector('.canvas');
let ctx = canvas.getContext('2d');

let sprite = new Image();
sprite.src = './img/sprite.png';


let frame = 0;
let state = {
    current: 0,
    ready: 0,
    game: 1,
    over: 2
}
let DEGREE = Math.PI / 100;





let bg = {
    sX: 0,
    sY: 0,
    w: 275,
    h: 226,
    x: 0,
    y: canvas.height - 226,
    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
}
let fg = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: canvas.height - 112,
    dx : 2,
    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },
    update : function(){
        if (state.current == state.game) {
            if(this.x <= -112){
                this.x =0
            }else{
                this.x -= this.dx
            }
        }
    }
}
let bird = {
    animation: [
        { sX: 276, sY: 112 },
        { sX: 276, sY: 139 },
        { sX: 276, sY: 164 },
        { sX: 276, sY: 139 }
    ],
    x: 50,
    y: 150,
    w: 34,
    h: 26,
    frame: 0,
    speed: 0,
    gravity: .25,
    jump: 4.2,
    rotation: 0,
    draw: function () {
        let bird = this.animation[this.frame];
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, -this.w / 2, - this.h / 2, this.w, this.h);
        ctx.restore();
    },
    flap: function () {
        this.speed = -this.jump
    },
    update: function () {
        let period = state.current == state.game ? 5 : 10;
        this.frame += frame % period == 0 ? 1 : 0;
        if (this.frame >= this.animation.length) {
            this.frame = 0;
        }

        if (state.current == state.ready) {
            this.y = 150;
            this.rotation = 0 * DEGREE;
        } else {
            if (state.current == state.game) {
                this.speed += this.gravity;
                this.y += this.speed;
                if (this.y + this.h / 2 >= canvas.height - fg.h) {
                    this.y = (canvas.height - fg.h) - this.h / 2;
                    state.current = state.over,
                        this.speed = 0;
                }
                if (this.speed > this.jump) {
                    this.rotation = 50 * DEGREE;
                } else {
                    this.rotation = -25 * DEGREE;
                }
            }else{
                this.rotation = 50 * DEGREE;
                this.frame = 1;
            }
        }
    }
}
let getReady = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: canvas.width / 2 - 173 / 2,
    y: 80,
    draw: function () {
        state.current == state.ready && ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
}
let gameOver = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: canvas.width / 2 - 225 / 2,
    y: 90,
    draw: function () {
        state.current == state.over && ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
}





let draw = () => {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    bg.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
}

let update = () => {
    bird.update(),
    fg.update();
}

let loop = () => {
    draw();
    update();
    frame++;
    requestAnimationFrame(loop);
}

loop()




document.addEventListener('click', e => {
    switch (state.current) {
        case state.ready:
            state.current = state.game;
            break;
        case state.game:
            bird.flap();
            break;
        case state.over:
            state.current = state.ready;
            break;
        default:
            break;
    }
})