import './networkFrame.css'

export function NetworkFrame() {

    return (
        <div className="networkManagerParent" id='networkManagerParent'>

            <div className="networkGuide">
                <div className="colorGuideParent">
                    <div className="colorGuideColor" id="colorGuideActivation"></div>
                    <h3 className="colorGuideText">Positive</h3>
                </div>
                <div className="colorGuideParent">
                    <div className="colorGuideColor" id="colorGuideNegative"></div>
                    <h3 className="colorGuideText">Negative</h3>
                </div>
            </div>
        </div>
    )
}