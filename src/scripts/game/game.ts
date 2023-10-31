import { env } from "../env/env"
import { findHighestIndexOfScore, findHighestScoreOfKeys, packPos, packXY, randomChance, roundFloat } from "./gameUtils"
import { GridPos } from "./gridPos"
import { randomPos } from "../../utils"

export class Game {
    ID = env.newID()
    running = false
    graph: GridPos[]

    constructor() {

        env.games[this.ID] = this
    }
    init() {

        this.running = true
        this.graph = []
    
        for (let x = 0; x < env.graphSize; x++) {
            for (let y = 0; y < env.graphSize; y++) {

                const gridPos = new GridPos(this, {}, { x: x * env.posSize, y: y * env.posSize })
                this.graph[packXY( x, y)] = gridPos
            }
        }
    }
    reset() {

        this.init()
    }
    run() {

        if (env.stats.roundTick >= env.stats.roundTickLimit) {

            this.stop()
            return
        }
    }
    stop() {

        this.running = false
    }
}