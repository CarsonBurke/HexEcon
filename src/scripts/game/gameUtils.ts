import { env } from "../env/env"
import { Pos } from "../../types/types"


export function packPos(pos: Pos) {

    return pos.x * env.graphSize + pos.y
}

export function packXY(x: number, y: number) {

    return x * env.graphSize + y
}

export function unpackPos(packedPos: number) {

    return {
        x: Math.floor(packedPos / env.graphSize),
        y: Math.floor(packedPos % env.graphSize),
    }
}

/**
 * Takes a rectange and returns the positions inside of it in an array
 */
export function findPositionsInsideRect(x1: number, y1: number, x2: number, y2: number) {
    const positions = []

    for (let x = x1; x <= x2; x += 1) {
        for (let y = y1; y <= y2; y += 1) {
            // Iterate if the pos doesn't map onto a room

            if (x < 0 || x >= env.graphSize || y < 0 || y >= env.graphSize) continue

            // Otherwise pass the x and y to positions

            positions.push({ x, y })
        }
    }

    return positions
}

export function isXYInGraph(x: number, y: number) {

    return x >= 0 && x < env.graphSize && y >= 0 && y < env.graphSize
}

/**
 * Gets the range between two positions' x and y (Half Manhattan)
 * @param x1 the first position's x
 * @param y1 the first position's y
 * @param x2 the second position's x
 * @param y2 the second position's y
 */
export function getRange(x1: number, x2: number, y1: number, y2: number) {
    // Find the range using Chebyshev's formula

    return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1))
}

export function getRangeOfPositions(pos1: Pos, pos2: Pos) {
    return getRange(pos1.x, pos2.x, pos1.y, pos2.y)
}

export function forAdjacentPositions(startPos: Pos, f: (pos: Pos) => void) {
    for (let x = startPos.x - 1; x <= startPos.x + 1; x += 1) {
        for (let y = startPos.y - 1; y <= startPos.y + 1; y += 1) {
            if (x === startPos.x && y === startPos.y) continue
            if (!isXYInGraph(x, y)) continue

            f({ x, y })
        }
    }
}

/**
 * Excludes center around range
 */
export function forPositionsAroundRange(startPos: Pos, range: number, f: (pos: Pos) => void) {
    for (let x = startPos.x - range; x <= startPos.x + range; x += 1) {
        for (let y = startPos.y - range; y <= startPos.y + range; y += 1) {
            if (x == startPos.x && y === startPos.y) continue
            // Iterate if the pos doesn't map onto a room

            if (x < 0 || x >= env.graphSize || y < 0 || y >= env.graphSize) continue

            f({ x, y })
        }
    }
}

/**
 * includes center around range
 */
export function forPositionsInRange(startPos: Pos, range: number, f: (pos: Pos) => void) {
    for (let x = startPos.x - range; x <= startPos.x + range; x += 1) {
        for (let y = startPos.y - range; y <= startPos.y + range; y += 1) {
            // Iterate if the pos doesn't map onto a room

            if (x < 0 || x >= env.graphSize || y < 0 || y >= env.graphSize) continue

            f({ x, y })
        }
    }
}

export function randomBool() {

    return Math.floor(Math.random() * 2)
}

export function randomOnesOffset() {

    return randomBool() ? 1 : -1
}

export function randomOffsetFor(pos: Pos) {

    const offsetPos = {
        x: -1,
        y: -1,
    }

    for (const key in offsetPos) {

        let posVal = offsetPos[key as keyof Pos]

        while (posVal < 0 || posVal > env.graphSize) {

            posVal = pos[key as keyof Pos] + randomOnesOffset()
        }

        offsetPos[key as keyof Pos] = posVal
    }

    return offsetPos
}

export function randomChance(chance: number) {

    return Math.floor(Math.random() * chance) % chance === 0
}

export function randomFloat(min: number, max: number) {
    return min + Math.random() * (max - min);
}

export function randomHSL() {
    var h = randomFloat(1, 360).toFixed(2)
    var s = randomFloat(0, 100).toFixed(2)
    var l = randomFloat(0, 100).toFixed(2)
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

export function findHighestScore<T>(iter: T[], f: (val: T) => number): number {
    let highestScore = 0

    for (const val of iter) {
        const score = f(val)
        if (score <= highestScore) continue

        highestScore = score
    }

    return highestScore
}

export function findHighestIndexOfScore<T>(iter: T[], f: (val: T) => number): [number, number] {
    let highestScore = 0
    let bestIndex = 0

    for (let i = 0; i < iter.length; i++) {
        
        const score = f(iter[i])
        if (score <= highestScore) continue

        bestIndex = i
        highestScore = score
    }

    return [highestScore, bestIndex]
}

export function findHighestScoreOfKeys<T>(obj: {[key: string]: T}, f: (val: T) => number): [number, string] {
    let highestScore = 0
    let bestKey: string

    for (const key in obj) {
        
        const score = f(obj[key])
        if (score <= highestScore) continue

        bestKey = key
        highestScore = score
    }

    return [highestScore, bestKey]
}

export function roundFloat(number: number, decimals: number) {

    return parseFloat(number.toFixed(decimals))
}