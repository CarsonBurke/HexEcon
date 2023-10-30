import './scroller.css'

//ANIMATIONS

export function animateEls() {

    const elementsToAnimate = document.getElementsByClassName("animate")

    for (const el of elementsToAnimate as any) {

        if (!el.dataset.showValue) el.dataset.showValue = "100"
        if (!el.dataset.time) el.dataset.time = "0.5"

        el.style.animationDuration = el.dataset.time + "s"

        const userTop = window.innerHeight - el.dataset.showValue

        const elTop = Math.trunc(el.getBoundingClientRect().top / 10) * 10

        if (userTop >= elTop) {

            el.classList.add("animateShow")

            if (el.classList.contains("floatUp")) {

                el.style.animationName = "floatUp"
                continue
            }
            if (el.classList.contains("floatDown")) {

                el.style.animationName = "floatDown"
                continue
            }
            if (el.classList.contains("floatLeft")) {

                el.style.animationName = "floatLeft"
                continue
            }
            if (el.classList.contains("floatRight")) {

                el.style.animationName = "floatRight"
                continue
            }

            el.style.animationName = "still"
            continue
        }

        if (window.innerHeight <= elTop) {

            el.classList.remove("animateShow")

            el.style.animationName = "undefined"
            continue
        }
    }
}