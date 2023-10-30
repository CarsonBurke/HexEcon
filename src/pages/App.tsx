import React, { ReactElement } from 'react'
import { main } from '../scripts'
import { NetworkFrame } from '../scripts/neuralNetwork/networkFrame'
import './app.css'
import { env } from '../scripts/env/env'
import Stat from '../components/stat'

function initStats() {

    const stats: JSX.Element[] = []

    for (const key in env.stats) {

        stats.push(<Stat key={key} name={key} value={env.stats[key as keyof typeof env.stats]} />)
    }

    return stats
}

window.onload = main
export default function App() {

  return (
      <main>
        <div className="envParent" id="envParent">

          <div className="displayParent">
              <div className="displayChild UIParent">

                  <h1 className="envTitle"><img className="envIcon" src={require('../images/logo.png')} />WebGine</h1>

                  <div className="statsParent">

                    {initStats()}
                </div>
                <form className="changeParent smallGap" id="form">

                    <input className="toggle waveButton" id="toggleRender" type='checkbox' defaultChecked={env.settings.enableRender} onInput={env.toggleRender} />
                    <label htmlFor='toggleRender' className='toggleLabel'>Render</label>

                </form>
                <form className="changeParent smallGap" id="form">

                    <input className="toggle waveButton" id="toggleNetworkVisuals" type='checkbox' defaultChecked={env.settings.networkVisuals} onInput={env.toggleNetworkVisuals} />
                    <label htmlFor='toggleNetworkVisuals' className='toggleLabel'>Network Visuals</label>

                </form>
                <form className="changeParent" id="form">

                    <button className="button waveButton" onClick={() => {env.manualReset()}}>Reset games</button>

                </form>
                <form className="changeParent" id="form">

                    <input className="changeInput" type="number" placeholder="Speed" id="newSpeed" />
                    <button className="button conjoinedButton waveButton" onClick={env.changeSpeed}>Change</button>

                </form>
                <form className="changeParent" id="form">

                    <input className="changeInput" type="number" placeholder="Games" id='newGames' />
                    <button className="button conjoinedButton waveButton" onClick={env.changeGames}>Change</button>

                </form>
                <form className="changeParent" id="form">

                    <input className="changeInput" type="number" placeholder="Organisms" id='newOrganisms' />
                    <button className="button conjoinedButton waveButton" onClick={env.changeOrganisms}>Change</button>

                </form>
                <form className="changeParent" id="form">

                    <input className="changeInput" type="number" placeholder="Round tick limit" id='newRoundTickLimit' />
                    <button className="button conjoinedButton waveButton" onClick={env.changeRoundTickLimit}>Change</button>

                </form>

                <NetworkFrame />

            </div>
          </div>
        </div>
      </main>
  )
}