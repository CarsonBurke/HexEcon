import { env } from '../env/env'
import { Texture, Sprite, Assets } from 'pixi.js'
import { Cell } from './cell'
import { CellTypes } from '../constants'
import { randomFloat } from './gameUtils'

export class SolarCell extends Cell {

    energyGenerationRate = 1

    /**
     * 
     * @param {*} opts must contiain a game and an organism parent
     * @param {*} spriteOpts must contain an x and y
     */
     constructor(opts: {[key: string]: any}, spriteOpts: {[key: string]: any}) {
        
        super()
        this.type = 'solarCell'

        this.init(opts, spriteOpts)
    }
    customInitialRun() {

        this.organism.income += this.energyGenerationRate
        this.organism.energy += this.energyGenerationRate
    }
}