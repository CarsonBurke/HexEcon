import { MAX_RUNNER_SPEED } from '../constants'
import { Game } from '../game/game'
import { Application, Assets, Container, Graphics } from 'pixi.js'
import { Textures } from '../../types/types'

class Env {

    contextMenu = document.getElementById('contextMenu')

    games: {[ID: string]: Game } = {}
    graphSize = 10
    graphLength = this.graphSize * this.graphSize
    posSize = 8
    IDIndex = 0
    width = this.graphSize * this.posSize
    height = this.graphSize * this.posSize
    lastFrameTime = new Date().getTime()
    lastUpdateTime = new Date().getTime()
    app = new Application({ 
        backgroundAlpha: 0,
        /* antialias: true, */
        width: this.width, 
        height: this.height,
    }) as any
    container = new Container()
    graphics = new Graphics()

    settings = {
        enableRender: true,
    }

    stats = {
        tick: 0,
        fps: '0',
        ups: '0',
        roundTick: 0,
        speed: 1,
        bestCells: 0,
        bestScore: 0,
        organisms: 0,
        organismsQuota: 10,
        games: 1,
        roundTickLimit: 100,
        lastReset: 0,
    }

    constructor() {


    }
    async init() {

        await this.initSprites()
        this.initApp()
        this.initContainer()
        this.initGraphics()
        this.initGames()

        this.app.ticker.add(this.runFPS)
    }

    private async initSprites() {

        
    }

    private initApp() {

        this.app.view.classList.add('env')
        this.app.view.id = 'env'
        document.getElementById('envParent').appendChild(this.app.view)

        this.app.stage.eventMode = 'dynamic'
    }

    private initContainer() {

        this.app.stage.addChild(this.container)
    }
    
    private initGraphics() {

        this.graphics.zIndex = 1
        this.container.addChild(this.graphics)
    }

    private initGames() {
    
        //

        for (let i = 0; i < this.stats.games; i++) {
    
            const game = new Game()
            game.init()
        }
    }
    
    newID() {
    
        this.IDIndex += 1
        return this.IDIndex.toString()
    }

    private runFPS() {
        if (!env.settings.enableRender) return
        
        if (env.lastUpdateTime <= env.lastFrameTime) {

            return
        }

        env.container.children.sort((a, b) => a.zIndex - b.zIndex)
    
        for (const gameID in env.games) {
    
            const game = env.games[gameID]
    
        }
    
        for (const statName in env.stats) {
    
            document.getElementById(statName).innerText = env.stats[statName as keyof typeof env.stats].toString()
        }

        const thisFrameTime = new Date().getTime()
        env.stats.fps = (MAX_RUNNER_SPEED / (thisFrameTime - env.lastFrameTime)).toFixed(2)
        env.lastFrameTime = new Date().getTime()
    }

    async runUPS() {

        this.stats.tick += 1
        this.stats.roundTick += 1
        /* console.log('tick', this.stats.tick) */
        let runningGames = 0

        env.graphics.clear()
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
            if (!game.running) {

                continue
            }

            runningGames += 1
            game.run()
        }
    
        for (const statName in this.stats) {
    
            document.getElementById(statName).innerText = this.stats[statName as keyof typeof this.stats].toString()
        }
    
        //
    
        if (!runningGames) {
    
            this.reset()
        }

        const thisUpdateTime = new Date().getTime()
        this.stats.ups = (MAX_RUNNER_SPEED / (thisUpdateTime - this.lastUpdateTime)).toFixed(2)
        this.lastUpdateTime = new Date().getTime()
    }

    manualReset() {

        for (const ID in this.games) {

            const game = this.games[ID]

            game.stop()
        }

        this.reset()
    }
    
    reset() {
    
        this.stats.lastReset = this.stats.tick
        this.stats.roundTick = 0
    
        for (const gameID in this.games) {
    
            const game = this.games[gameID]
    
            game.reset()
        }
    }

    keyManager(event: Event) {


    }

    clickManager(event: Event) {
        return

        const targetEl = event.target as HTMLElement
        if (targetEl.classList.contains('contextMenuPart')) {

            return
        }

        this.contextMenu.classList.add('spaceHidden')
    }

    onContextMenu(event: Event) {
        return

        event.preventDefault()

        this.contextMenu.classList.remove('spaceHidden')
        this.contextMenu.style.top = (event as any).clientY + Math.abs(document.body.getBoundingClientRect().top) + 'px'
        this.contextMenu.style.left = (event as any).clientX + 'px'
    }

    toggleRender() {

        if (env.settings.enableRender) {

            // Disalbe rendering

            env.settings.enableRender = false

            for (const sprite of env.container.children) {

                sprite.alpha = 0
            }
            
            return
        }

        // Enable rendering

        env.settings.enableRender = true

        for (const sprite of env.container.children) {

            sprite.alpha = 1
        }
    }

    changeSpeed() {

        const element = document.getElementById('newSpeed') as HTMLInputElement
        if (!element.value) return

        env.stats.speed = parseInt(element.value)
    }

    changeGames() {

        const element = document.getElementById('newGames') as HTMLInputElement
        if (!element.value) return

        env.stats.games = parseInt(element.value)
    }

    changeOrganisms() {

        const element = document.getElementById('newOrganisms') as HTMLInputElement
        if (!element.value) return

        env.stats.organismsQuota = parseInt(element.value)
    }

    changeRoundTickLimit() {

        const element = document.getElementById('newRoundTickLimit') as HTMLInputElement
        if (!element.value) return

        env.stats.roundTickLimit = parseInt(element.value)
    }
}

export const env = new Env()