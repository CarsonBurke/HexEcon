import { env } from "../env/env";
import { Game } from "./game";
import { Province } from "./province";

export class Nation {

    provinces: {[ID: string]: Province}

    game: Game
    ID: string
    constructor(game: Game, opts: any) {

        this.game = game
        this.ID = env.newID()
        Object.assign(this, opts)
    }

    run() {

        for (const ID in this.provinces) {

            const province = this.provinces[ID]
            
            province.run()
        }
    }
}