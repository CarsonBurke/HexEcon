import { CELLS, CELL_DEATH_ENERGY_MULTIPLIER, CellTypes } from "../constants"
import { env } from "../env/env"
import { Sprite } from 'pixi.js'
import { Game } from "./game"
import { forAdjacentPositions, forPositionsAroundRange, forPositionsInRange, packPos } from "./gameUtils"
import { Organism } from "./organism"


export class Cell {
    maxHits = 10
    hits = this.maxHits

    type: CellTypes
    ID: string
    game: Game
    organism: Organism
    sprite: Sprite

    constructor() {}
    init(opts: {[key: string]: any}, spriteOpts: {[key: string]: any}) {

        Object.assign(this, opts)

        this.ID = env.newID()

        this.initSprite(spriteOpts)
        this.assign()
    }
    private initSprite(spriteOpts: {[key: string]: any}) {

        this.sprite = new Sprite(env.sprites[this.type])
        env.container.addChild(this.sprite)

        Object.assign(this.sprite, spriteOpts)

        if (!env.settings.enableRender) this.sprite.alpha = 0
    }
    private assign() {
        this.sprite.zIndex = 2

        this.organism.cells[this.type][this.ID] = this
        this.game.cells[this.type][this.ID] = this
        this.game.cellGraph[this.packedPos] = this

        this.organism.energy -= CELLS[this.type].cost
    }
    damage(amount: number) {
/* 
        this.sprite.alpha = this.hits / this.maxHits
 */
        this.hits -= amount
        if (this.hits <= 0) this.kill()
    }
    kill() {
        this.game.graph[this.packedPos].energy += CELLS[this.type].cost * CELL_DEATH_ENERGY_MULTIPLIER

        this.sprite.removeFromParent()

        delete this.organism.cells[this.type][this.ID]
        delete this.game.cells[this.type][this.ID]
        this.game.cellGraph[this.packedPos] = undefined
    }
    initialRun() {

        this.organism.cellCount += 1

        const upkeep = CELLS[this.type].upkeep * Math.pow(Object.keys(this.organism.cells[this.type]).length, 0.2)

        this.organism.energy -= upkeep
        this.organism.income -= upkeep

        // Find expansion coords

        forPositionsInRange(this.pos, 
            3,
            pos => {
                if (this.game.cellGraph[packPos(pos)]) return

                this.organism.expansionPositions.add(packPos(pos)) 
            })
        
        this.customInitialRun()
    }
    /**
     * Type placeholder
     */
    customInitialRun() {

        
    }
    run() {
        
        // Gr
        

        this.customRun()
    }
    /**
     * Type placeholder
     */
    customRun() {

        
    }

    get pos() {

        return {
            x: this.sprite.x / env.posSize,
            y: this.sprite.y / env.posSize,
        }
    }

    set pos(newPos) {

        this.game.cellGraph[this.packedPos] = undefined

        this.sprite.x = newPos.x * env.posSize
        this.sprite.y = newPos.y * env.posSize

        this.game.cellGraph[this.packedPos] = this
    }

    get packedPos() {

        return packPos(this.pos)
    }
}