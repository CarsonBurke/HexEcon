import { Game } from "./game"
import { Texture, Sprite, Assets } from 'pixi.js'
import { env } from "../env/env"
import { packPos } from "./gameUtils"

export class GridPos {
    static texture = Assets.load('sprites/grass.png')
    static hoverTexture = Assets.load('sprites/grassHover.png')

    type = 'gridPos'
    energy = 0

    game: Game
    ID: string
    sprite: Sprite
    constructor(game: Game, opts: any, spriteOpts: any) {

        this.game = game
        this.ID = env.newID()
        Object.assign(this, opts)

        this.initSprite().then(() => {

            Object.assign(this.sprite, spriteOpts)

            game.graph[this.packedPos] = this
    
            this.initInteractions()
            this.render()
        })
    }

    async initSprite() {

        this.sprite = new Sprite(await GridPos.texture)
        this.sprite.zIndex = 0

        if (!env.settings.enableRender) this.sprite.alpha = 0
    }

    initInteractions() {

        this.sprite.cursor = 'hover'
        this.sprite.eventMode = 'dynamic'

        const instance = this
        this.sprite.on('pointerover', function() { instance.hoverOn() })
        this.sprite.on('pointerout', function() { instance.hoverOff() })
    }

    async hoverOn() {

        this.sprite.texture = await GridPos.hoverTexture
    }

    async hoverOff() {

        this.sprite.texture = await GridPos.texture
    }

    render() {

        env.container.addChild(this.sprite)
        this.sprite.width = env.posSize
        this.sprite.height = env.posSize
    }

    get pos() {

        return {
            x: this.sprite.x / env.posSize,
            y: this.sprite.y / env.posSize,
        }
    }

    set pos(newPos) {

        this.sprite.x = newPos.x * env.posSize
        this.sprite.y = newPos.y * env.posSize

        this.game.graph[this.packedPos] = this
    }

    get packedPos() {

        return packPos(this.pos)
    }
}