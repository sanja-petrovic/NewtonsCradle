
let buttonStart = document.getElementById("btn");
let button;
let inputN;
let width = window.innerWidth;
let height = window.innerHeight;

function setup() {
    createCanvas(width, height);
    inputN = createInput('Enter number of pendulums');
    inputN.position(22, 70);
    buttonStart = createButton('Start simulation');
    createCradle(5);
}


let pendulums = [];


function draw() {
    background(255, 104, 196);
    let color1 = color(255, 135, 185);
    let color2 = color(255, 231, 113);
    setGradient(0, 0, 1920, 1080, color2, color1, "X");
    stroke(110, 110, 110);
    strokeWeight(1);
    fill(255, 246, 203);
    rect(width/2 - 100 - 5*60+50, 270, 120*5 + 80, 30);
    for(let i = 0; i < 5; i++) {
        pendulums[i].startF();
    }
}

function inputEvent() {
    pendulums = [];
    if(Number.isInteger(parseInt(inputN.value()))) {
        createCradle(inputN.value());
    } else {
        createCradle(5);
    }
}

function createCradle(n) {
    for(let i = 0; i < n; i++) {
        let pendulum = new Pendulum(width/2 + 120*i - n*60+50, 300, width/2 + 120*i - n*60+50, 700, 60);
        pendulums.push(pendulum);
    }
}

function setGradient(x, y, w, h, c1, c2, axis) {
    noFill();
    if (axis === "Y") { // Top to bottom gradient
        for (let i = y; i <= y + h; i++) {
            var inter = map(i, y, y + h, 0, 1);
            var c = lerpColor(c1, c2, inter);
            stroke(c);
            line(x, i, x + w, i);
        }
    } else if (axis === "X") { // Left to right gradient
        for (let j = x; j <= x + w; j++) {
            let inter2 = map(j, x, x + w, 0, 1);
            let d = lerpColor(c1, c2, inter2);
            stroke(d);
            line(j, y, j, y + h);
        }
    }

    //reference: https://p5js.org/examples/color-linear-gradient.html
}

