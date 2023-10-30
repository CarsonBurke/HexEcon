import { CellTypes, CELL_TYPES } from "../constants"
import { env } from "../env/env"
import { AttackerCell } from "./attackerCell"
import { Cell } from "./cell"
import { CellMembrane } from "./cellMembrane"
import { CollectorCell } from "./collectorCell"
import { findHighestIndexOfScore, findHighestScoreOfKeys, packPos, packXY, randomChance, roundFloat } from "./gameUtils"
import { GridPos } from "./gridPos"
import { Organism } from "./organism"
import { SolarCell } from "./solarCell"
import { Cells } from "../types"
import { networkManager } from "../neuralNetwork/networkManager"
import { randomPos } from "../../utils"

export class Game {
    ID = env.newID()
    running = false
    graph: GridPos[]
    organisms: {[ID: string]: Organism}
    cells: Cells
    cellGraph: Cell[]
    /**
     * The ID of the network of the organism that won
     */
    winner: string
    organismsCount: number

    constructor() {

        env.games[this.ID] = this
    }
    init() {

        this.running = true
        this.winner = undefined
        this.graph = []
        this.organisms = {}
        this.cells = {}
        for (const type of CELL_TYPES) {

            this.cells[type] = {}
        }
        this.cellGraph = []
    
        for (let x = 0; x < env.graphSize; x++) {
            for (let y = 0; y < env.graphSize; y++) {

                const gridPos = new GridPos(this, {}, { x: x * env.posSize, y: y * env.posSize })
                this.graph[packXY( x, y)] = gridPos
            }
        }

        const networks = Object.values(networkManager.networks)

        for (let i = 0; i < env.stats.organismsQuota; i++) {

            let pos = randomPos()

            while (this.cellGraph[packPos(pos)]) {

                pos = randomPos()
            }

            const organism = new Organism({
                game: this
            })
            organism.networkID = networks[i].ID
            const solarCell = new SolarCell({
                game: this,
                organism: organism,
            },
            {
                x: pos.x * env.posSize,
                y: pos.y * env.posSize,
            })
        }
    }
    reset() {

        for (const ID in this.organisms) {

            delete this.organisms[ID]
        }

        this.init()
    }
    run() {

        this.organismsCount = 0

        for (const ID in this.organisms) {

            const organism = this.organisms[ID]

            if (organism.cellCount > env.stats.bestCells) env.stats.bestCells = organism.cellCount

            organism.run()
        }

        if (this.organismsCount === 1) {

            this.stop()
            return
        }

        if (env.stats.roundTick >= env.stats.roundTickLimit) {

            this.stop()
            return
        }
    }
    stop() {

        for (const ID in this.organisms) {

            const organism = this.organisms[ID]
            organism.killCells()
        }

        this.findWinner()
        this.running = false
    }
    private findWinner() {

        const [score, organismID] = findHighestScoreOfKeys(this.organisms, (organism) => roundFloat(organism.income + organism.energy / env.stats.roundTick, 2))
        if (score > env.stats.bestScore) env.stats.bestScore = score

        this.winner = this.organisms[organismID].networkID
    }
}