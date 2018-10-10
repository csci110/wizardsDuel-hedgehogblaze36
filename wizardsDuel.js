import {game, Sprite} from "./sgc/sgc.js";
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
    }
}
let marcus = new PlayerWizard();
