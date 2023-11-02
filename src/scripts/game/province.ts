import { Assets, Sprite } from "pixi.js"
import { packPos } from "./gameUtils"
import { env } from "../env/env"
import { Game } from "./game"

export class Province {

    static texture = Assets.load('sprites/province.png')
    static hoverTexture = Assets.load('sprites/province.png')

    type = 'province'

    game: Game
    ID: string
    sprite: Sprite
    constructor(game: Game, opts: any, spriteOpts: any) {

        this.game = game
        this.ID = env.newID()
        Object.assign(this, opts)

        this.initSprite().then(() => {

            Object.assign(this.sprite, spriteOpts)
    
            this.initInteractions()
            this.render()
        })
    }
    init() {


    }
    private assign() {


    }
    private async initSprite() {

        this.sprite = new Sprite(await Province.texture)
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

        this.sprite.texture = await Province.hoverTexture
    }

    async hoverOff() {

        this.sprite.texture = await Province.texture
    }

    render() {

        env.container.addChild(this.sprite)
        this.sprite.width = env.posSize
        this.sprite.height = env.posSize
    }

    delete() {


    }

    run() {

        console.log('ran province ' + this.ID)
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
    }

    get packedPos() {

        return packPos(this.pos)
    }
}