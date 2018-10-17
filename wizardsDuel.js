import { game, Sprite } from "./sgc/sgc.js";
game.setBackground("floor.png");
class PlayerWizard extends Sprite {
    constructor() {
        super();
        this.name = "Marcus the Wizard";
        this.setImage("marcusSheet.png");
        this.height = 48;
        this.width = 48;
        this.x = this.width;
        this.y = this.y;
        this.defineAnimation("down", 6, 8);
        this.defineAnimation('right', 3, 5);
        this.defineAnimation('up', 0, 2);
        this.speedWhenWalking = 100;
        this.spellCastTime = 0;
    }
    handleDownArrowKey() {
        this.playAnimation("down");
        this.speed = this.speedWhenWalking;
        this.angle = 270;
    }
    handleUpArrowKey() {
        this.playAnimation('up');
        this.speed = this.speedWhenWalking;
        this.angle = 90;
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
            spell.x = this.width + this.x;
            spell.y = this.y;
            spell.name = "A spell cast by Marcus";
            spell.angle = 0;
            spell.setImage('marcusSpellSheet.png');
            this.playAnimation('right');
        }
    }
}

class NonPlayerWizard extends Sprite {
    constructor() {
        super();
        this.name = "The mysterious stranger";
        this.setImage("strangerSheet.png");
        this.width = 48;
        this.height = 48;
        this.x = game.displayWidth - 2 * this.width;
        this.y = this.height;
        this.angle = 270;
        this.speed = 150;
        this.defineAnimation("up", 0, 2);
        this.defineAnimation("down", 6, 8);
        this.defineAnimation("left", 9, 11);
        this.playAnimation('down');
    }
    handleGameLoop() {
        if (this.y <= 0) {
            // Upward motion has reached top, so turn down
            this.y = 0;
            this.angle = 270;
            this.playAnimation("down");
        }
        if (this.y >= game.displayHeight - this.height) {
            // Downward motion has reached bottom, so turn up
            this.y = game.displayHeight - this.height;
            this.angle = 90;
            this.playAnimation("up");
        }
        if (Math.random() < 0.01) {
            let sspell = new Spell();
            sspell.x = this.x - this.width;
            sspell.y = this.y;
            sspell.name = "A spell cast by stranger";
            sspell.angle = 180;
            sspell.setImage('strangerSpellSheet.png');
            this.playAnimation('left');
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
        if (!game.isActiveSprite(stranger)) {
            game.end("Congratulations!\n\nMarcus has defeated the mysterious" +
                "\nstranger in the dark cloak!");
        }
        if (!game.isActiveSprite(marcus)) {
            game.end("Marcus is defeated by the mysterious\nstranger in the dark cloak!\n\nBetter luck next time.");
        }
    }
}

let stranger = new NonPlayerWizard();

class Spell extends Sprite {
    constructor() {
        super();
        this.speed = 200;
        this.height = 48;
        this.width = 48;
        this.defineAnimation("magic", 0, 7);
        this.playAnimation("magic", true);

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
let marcus = new PlayerWizard();
