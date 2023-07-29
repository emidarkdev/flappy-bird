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
    dx: 2,
    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },
    update: function () {
        if (state.current == state.game) {
            if (this.x <= -112) {
                this.x = 0
            } else {
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
    radius: 12,
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
            this.speed += this.gravity;
            this.y += this.speed;
            if (this.y + this.h / 2 >= canvas.height - fg.h) {
                this.y = (canvas.height - fg.h) - this.h / 2;
                state.current = state.over;
            }
            if (this.speed > this.jump) {
                this.rotation = 50 * DEGREE;
            } else {
                if (state.current == state.game) {
                    this.rotation = -25 * DEGREE
                };
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
let pipes = {
    position: [],

    top: {
        sX: 553,
        sY: 0
    },
    bottom: {
        sX: 502,
        sY: 0
    },

    w: 53,
    h: 400,
    gap: 85,
    maxYPos: -150,
    dx: 2,

    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            const pipe = this.position[i];
            let p_top_posY = pipe.y;
            let p_bottom_posY = pipe.y + this.h + this.gap;
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, pipe.x, p_top_posY, this.w, this.h);
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, pipe.x, p_bottom_posY, this.w, this.h);
        }
    },


    update: function () {
        if (state.current != state.game) return;
        if (frame % 100 == 0) {
            this.position.push({
                x: canvas.width,
                y: this.maxYPos * (Math.random() + 1)
            })
        }
        for (let i = 0; i < this.position.length; i++) {
            const pipe = this.position[i];
            let p_bottom_posY = pipe.y + this.h + this.gap;
            if (
                bird.x + bird.radius > pipe.x &&
                bird.x - bird.radius < pipe.x + this.w &&
                bird.y + bird.radius > pipe.y &&
                bird.y - bird.radius < pipe.y + this.h
            ) {
                state.current = state.over;
            }
            if (
                bird.x + bird.radius > pipe.x &&
                bird.x - bird.radius < pipe.x + this.w &&
                bird.y + bird.radius > p_bottom_posY &&
                bird.y - bird.radius < p_bottom_posY + this.h
            ) {
                state.current = state.over;
            }

            pipe.x -= this.dx;
        }
    }

}




let draw = () => {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
}

let update = () => {
    bird.update(),
        fg.update();
    pipes.update();

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
            bird.speed = 0;
            state.current = state.game;
            break;
        case state.game:
            bird.flap();
            break;
        case state.over:
            pipes.position = [];
            state.current = state.ready;
            break;
        default:
            break;
    }
})