const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

class Player {
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.speed = 4;
        this.gravity = 0.5;
        this.velocityY = 0;
        this.jumpForce = -13;
        this.OnGround = false;
        this.color = 'blue';
        this.health = 100;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(keys) {
        if (keys['ArrowLeft'] && this.x > 0) this.x -= this.speed;
        if (keys['ArrowRight'] && this.x + this.width < canvas.width) this.x += this.speed;

        this.velocityY += this.gravity;

        this.y += this.velocityY;

        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
            this.OnGround = true;
        }
        else {
            this.OnGround = false;
        }

        if (keys['ArrowUp'] && this.OnGround) {
            this.velocityY = this.jumpForce;
        }
    }

}

class Heal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.height = 50;
        this.width = 50;
        this.color = 'green';
    }


    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Lava {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.height = 50;
        this.width = 50;
        this.color = 'red';
    }


    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Game {
    constructor() {
        this.player = new Player(50, 500, 50, 50);
        this.keys = {};
        this.heals = [];
        this.lavaBlocks = [];
        this.generateHeals();
        this.generateLava();
        this.gameLoop();

        document.addEventListener('keydown', (e) => this.keys[e.key] = true);
        document.addEventListener('keyup', (e) => this.keys[e.key] = false);
    }

    generateHeals() {
        const maxY = this.player.y - this.player.jumpForce;
        for (let i = 0; i < 5; i++) {
            let x = Math.random() * (canvas.width - 50);
            let y = Math.random() * (maxY - 50);
            this.heals.push(new Heal(x, y));
        }
    }

    generateLava() {
        for (let i = 0; i < 20; i++) {
            let x = Math.random() * (canvas.width - 50);
            let y = Math.random() * (canvas.height - 100);
            this.lavaBlocks.push(new Lava(x, y));
        }
    }


    checkCollision(object) {
        return (
            this.player.x < object.x + object.width &&  
            this.player.x + this.player.width > object.x && 
            this.player.y < object.y + object.height &&  
            this.player.y + this.player.height > object.y 
        );
    }

    gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.player.move(this.keys);
        this.player.draw();

        if (this.heals.length === 0) {
            alert('you won');
            window.location.reload();
        }

        for (let i = this.heals.length - 1; i >= 0; i--) {
            let heal = this.heals[i];
            heal.draw();

            if (this.checkCollision(heal)) {
                console.log("Heal collected!");
                this.heals.splice(i, 1);
                this.player.health = this.player.health + 10 > 100 ? 100 : this.player.health + 10;
            }
        }

        for (let i = this.lavaBlocks.length - 1; i >= 0; i--) {
            let lava = this.lavaBlocks[i];
            lava.draw();

            if (this.checkCollision(lava)) {
                if (this.player.health -10 <= 0) window.location.reload();
                this.lavaBlocks.splice(i, 1);
                this.player.health -= 10;
            }
        }

        ctx.font = "50px serif";
        ctx.fillText(this.player.health, 10, 50);

        requestAnimationFrame(() => this.gameLoop());
    }
}


const game = new Game();