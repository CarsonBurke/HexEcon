import { env } from "./scripts/env/env"

export function timer(seconds: number) {

    return new Promise((resolve, reject) => {
        setTimeout(function(err: any) {
            resolve(err)
        }, seconds * 1000)
    })
}

export function randomPos() {

    return {
        x: Math.floor(Math.random() * env.graphSize),
        y: Math.floor(Math.random() * env.graphSize),
    }
}