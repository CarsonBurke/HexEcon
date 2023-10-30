import { Sprite } from "pixi.js"
import { CellTypes } from "./constants"
import { AttackerCell } from "./game/attackerCell"
import { Cell } from "./game/cell"
import { CellMembrane } from "./game/cellMembrane"
import { CollectorCell } from "./game/collectorCell"
import { SolarCell } from "./game/solarCell"

export interface Pos {
    x: number
    y: number
}
export type Cells = Partial<{[key in CellTypes]: {[ID: string]: Cell}}>
export type Textures = {[key in CellTypes]: any }