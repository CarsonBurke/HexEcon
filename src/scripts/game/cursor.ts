import { env } from "../env/env"
import { Game } from "./game"
import { Texture, Sprite, Assets } from 'pixi.js'

export class Cursor {
    static texture = Assets.load('sprites/cursor.png')
    game
    ID
    sprite: Sprite
    type = 'cursor'
    
    constructor(game: Game, opts: {[key: string]: any}, spriteOpts: {[key: string]: any}) {

        this.game = game
        this.ID = env.newID()
        Object.assign(this, opts)
/* 
        this.sprite = new Sprite(await Cursor.texture)
        Object.assign(this.sprite, spriteOpts)
 */
        this.render()
    }

    render() {

        const defaultIcon = "url('sprites/cursor.png'),auto"
        const hoverIcon = "url('sprites/cursor.png'),auto"

        env.app.renderer.events.cursorStyles.default = defaultIcon
        env.app.renderer.events.cursorStyles.hover = hoverIcon
    }
}