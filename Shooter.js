import { game, Sprite } from "./sgc/sgc.js";
game.setBackground("system.png");
class Player extends Sprite {
    constructor() {
        super();
        this.name = "Red the PLayer";
        this.setImage("red.png");
        this.height = 48;
        this.width = 48;
        this.x = 0;
        this.y = game.displayHeight - this.height;
        this.speedWhenWalking = 100;
        this.spellCastTime = 0;
    }
    handleRightArrowKey() {
        this.speed = this.speedWhenWalking;
        this.angle = 0;
    }
    handleLeftArrowKey() {
        this.speed = this.speedWhenWalking;
        this.angle = 180;
    }
    handleGameLoop() {
        this.y = Math.max(5, this.y);
        this.y = Math.min(game.displayHeight - this.height, this.y);
        this.x = Math.max(5, this.x);
        this.x = Math.min(game.displayWidth - this.width, this.x);
        this.speed = 0;
    }
    handleSpacebar() {
        let now = game.getTime();
        if (now - this.spellCastTime >= 2) {
            this.spellCastTime = now;
            let spell = new Spell();
            spell.x = this.width;
            spell.y = this.height - this.y;
            spell.name = "A spell cast by Red";
            spell.angle = 90;
            spell.setImage('marcusSpellSheet.png');
        }
    }
}

class Target extends Sprite {
    constructor() {
        super();
        this.name = "The Ship";
        this.setImage("Target.png");
        this.width = 48;
        this.height = 48;
        this.x = game.displayWidth - 2 * this.width;
        this.y = this.height;
        this.angle = 0;
        this.speed = 150;
    }
    handleGameLoop() {
        if (this.x <= 0) {
            // Upward motion has reached top, so turn down
            this.x = 0;
            this.angle = 0;
        }
        if (this.x >= game.displayWidth - this.width) {
            // Downward motion has reached bottom, so turn up
            this.x = game.displayWidth - this.width;
            this.angle = 180;
        }
        if (Math.random() < 0.01) {
            let sspell = new Spell();
            sspell.y = this.y + this.height;
            sspell.x = this.x;
            sspell.name = "A missile sent by the ship";
            sspell.angle = 270;
            sspell.setImage('strangerSpellSheet.png');
        }
    }
    handleAnimationEnd() {
        if (this.angle === 90) {
            this.playAnimation("up");
        }
        if (this.angle === 270) {
            this.playAnimation("down");
        }
    }
}

class Fireball extends Sprite {
    constructor(deadSprite) {
        super();
        this.x = deadSprite.x;
        this.y = deadSprite.y;
        this.setImage('fireballSheet.png');
        game.removeSprite(deadSprite);
        this.defineAnimation('explode', 0, 16);
        this.playAnimation('explode');
    }
    handleAnimationEnd() {
        game.removeSprite(this);
        if (!game.isActiveSprite(target)) {
            game.end("Congratulations!\n\nRed has defeated the mysterious" +
                "\nship in the dark sky!");
        }
        if (!game.isActiveSprite(red)) {
            game.end("Red is defeated by the mysterious\nship in the dark sky!\n\nBetter luck next time.");
        }
    }
}

let target = new Target();

class Spell extends Sprite {
    constructor() {
        super();
        this.speed = 200;
        this.height = 48;
        this.width = 48;
        this.defineAnimation("magic", 0, 7);
        this.playAnimation("magic", true);
        this.angle = 90;

    }
    handleBoundaryContact() {
        game.removeSprite(this);
    }
    handleCollision(otherSprite) {
        if (this.getImage() !== otherSprite.getImage()) {
            let verticalOffset = Math.abs(this.y - otherSprite.y);
            if (verticalOffset < this.height / 2) {
                game.removeSprite(this);
                new Fireball(otherSprite);
            }
        }
        return false;
    }
}
let red = new Player();