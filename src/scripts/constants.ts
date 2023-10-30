import { Output } from "./neuralNetwork/network"

export const MAX_RUNNER_SPEED = 1000
export type CellTypes = 'solarCell' | 'collectorCell' | 'attackerCell' | 'cellMembrane'
export const CELL_TYPES: CellTypes[] = ['solarCell', 'collectorCell', 'attackerCell', 'cellMembrane']
export const GAME_OBJECT_TYPES = ['gridPos', 'organism', ...CELL_TYPES]
export const CELL_DEATH_ENERGY_MULTIPLIER = 0.9
export const CELLS = {
    'solarCell': {
        cost: 15,
        upkeep: 0.01,
    }, 
    'collectorCell': {
        cost: 20,
        upkeep: 0.05,
    }, 
    'attackerCell': {
        cost: 45,
        upkeep: 0.1,
    }, 
    'cellMembrane': {
        cost: 4,
        upkeep: 0.001,
    }
}
export const adjacentOffsets = [
    {
        x: -1,
        y: -1,
    },
    {
        x: 0,
        y: -1,
    },
    {
        x: 1,
        y: -1,
    },
    {
        x: 1,
        y: 0,
    },
    {
        x: 1,
        y: 1,
    },
    {
        x: 0,
        y: 1,
    },
    {
        x: -1,
        y: 1,
    },
    {
        x: -1,
        y: 0,
    },
]
export const MAX_NETWORK_RUNS = 100
export const NETWORK_OUTPUTS_STRUCTURE = [
    // Build
    'Build X',
    'Build Y',
    'Build Solar',
    'Build Attacker',
    'Build Collector',
    'Build Membrane',
    'Build y/n',
    // Distribute
    'Maintain X',
    'Maintain Y',
    'Maintain y/n',
    // Attack
    'Attack X',
    'Attack Y',
    'Attack y/n',
    // Go again
    'Go Again y/n'
]
export const NETWORK_OUTPUTS: Output[] = []

for (const key in NETWORK_OUTPUTS_STRUCTURE) {

    NETWORK_OUTPUTS.push(new Output(NETWORK_OUTPUTS_STRUCTURE[key]))
}