import { Cell } from "./cell"
import { Texture, Sprite, Assets } from 'pixi.js'
import { env } from "../env/env"
import { CellTypes } from "../constants"

export class CellMembrane extends Cell {

    energy = 0

    /**
     * 
     * @param {*} opts must contiain a game and an organism parent
     * @param {*} spriteOpts must contain an x and y
     */
     constructor(opts: {[key: string]: any}, spriteOpts: {[key: string]: any}) {

        super()
        this.type = 'cellMembrane'

        this.init(opts, spriteOpts)
    }
    customInitialRun() {

        
    }
}