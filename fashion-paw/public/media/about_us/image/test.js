window.onload = () => {


    const movepan = document.getElementById("movepan");
    const onebox = document.getElementById("onebox");


    const intervalId = setInterval(() => {
        if (movepan.offsetLeft > onebox.offsetLeft) {
            if (onebox.style.visibility != "visible") {
                onebox.style.visibility = "visible"
                onebox.classList.add("dancebox")
                kusa1.classList.add("bush-disappear")
            } else {
                console.log("apple");
                clearInterval(intervalId)
            }
        }
    }, 200)
    const intervalId2 = setInterval(() => {
        if (movepan.offsetLeft > twobox.offsetLeft) {
            if (twobox.style.visibility != "visible") {
                twobox.style.visibility = "visible"
                twobox.classList.add("dancebox")
            } else {
                console.log("apple");
                clearInterval(intervalId2)
            }
        }
    }, 200)
    const intervalId3 = setInterval(() => {
        if (movepan.offsetLeft > threebox.offsetLeft) {
            if (threebox.style.visibility != "visible") {
                threebox.style.visibility = "visible"
                threebox.classList.add("dancebox")
                kusa3.classList.add("dogruning")
            } else {
                console.log("apple");
                clearInterval(intervalId3)
            }
        }
    }, 200)
    const intervalId4 = setInterval(() => {
        if (movepan.offsetLeft > fourbox.offsetLeft) {
            if (fourbox.style.visibility != "visible") {
                fourbox.style.visibility = "visible"
                fourbox.classList.add("dancebox")
                kusa4.classList.add("fade-up")
            } else {
                console.log("apple");
                clearInterval(intervalId4)
            }
        }
    }, 200)

















}