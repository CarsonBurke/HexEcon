import { MAX_RUNNER_SPEED } from "./constants"
import { env } from "./env/env"

export async function main() {

    await env.init()
    
    runUPS()
    
    async function runUPS() {
    
        while (true) {
    
            await new Promise((resolve, reject) => {
                setTimeout(function() {
                    resolve(() => {})
                }, MAX_RUNNER_SPEED / env.stats.speed)
            })

            await env.runUPS()
        }
    }
    
    const elements = document.getElementsByTagName('form')
    for (const el of elements) {
    
        el.addEventListener('submit', stopRefresh)
    }
    
    function stopRefresh(event: Event) {
    
        event.preventDefault()
    }
    
    document.addEventListener('click', event => { env.clickManager(event) })
    document.addEventListener('contextmenu', event => { env.onContextMenu(event) })
}