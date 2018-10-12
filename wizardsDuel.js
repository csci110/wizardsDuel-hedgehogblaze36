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
        this.defineAnimation('right', 3,5);
        this.speedWhenWalking = 100;
    }
    handleDownArrowKey() {
        this.playAnimation("down");
        this.speed = this.speedWhenWalking;
        this.angle = 270;
    }
    handleGameLoop() {
        this.y = Math.max(5, this.y);
        this.y = Math.min(game.displayHeight - this.height, this.y);
        this.x = Math.max(5, this.x);
        this.x = Math.min(game.displayWidth - this.width, this.x);
        this.speed = 0;
    }
    handleSpacebar() {
        let spell = new Spell();
        spell.x = this.width + this.x;
        spell.y = this.y;
        spell.name = "A spell cast by Marcus";
        spell.angle = 0;
        spell.setImage('marcusSpellSheet.png');
        this.playAnimation('right');

    }
}

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
}
let marcus = new PlayerWizard();
