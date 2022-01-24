let buttonStart = document.getElementById("btn");
let button;
let inputN;
let width = window.innerWidth;
let height = window.innerHeight;
let n = 5;
let xOffset = 0;
let yOffset = 0;
let locked = false;
let x = 0;
let y = 0;

function setup() {
    createCanvas(width, height);
    inputN = createInput('Enter number of pendulums');
    inputN.position(22, 70);
    buttonStart = createButton('Start simulation');
    buttonStart.mousePressed(inputEvent);
    createCradle(n);
    for(let i = 0; i < n; i++) {
        pendulums[i].init();
    }
}


let pendulums = [];

function overPendulum(size, position) {
    if(mouseX > position.x - size && mouseX < position.x + size
        && mouseY > position.y - size && mouseY < position.y + size) {
        return true;
    }
    return false;
}

function draw() {
    background(255, 104, 196);
    let color1 = color(255, 135, 185);
    let color2 = color(255, 231, 113);
    setGradient(0, 0, 1920, 1080, color2, color1, "X");
    stroke(110, 110, 110);
    strokeWeight(1);
    fill(255, 246, 203);
    rect(width/2 - 100 - n*60+50, 270, 120*n + 80, 30);
    for(let i = 0; i < n; i++) {
        pendulums[i].draw();
    }
    pendulums[0].update();

    let colDet = new CollisionDetection(pendulums[0], pendulums[1]);
    colDet.detect();


}

function mousePressed() {
    if(overPendulum(pendulums[0].ballr*2, pendulums[0].position)) {
        locked = true;
        xOffset = mouseX - pendulums[0].position.x;
        yOffset = mouseY - pendulums[0].position.y;
        console.log('hi');
    } else {
        locked = false;
    }
}

function mouseDragged() {
    if (locked) {
        pendulums[0].setPosition(mouseX - xOffset, mouseY - yOffset);
        pendulums[0].update();
    }
}

function mouseReleased() {
    locked = false;
}

function inputEvent() {
    console.log('weee');
    pendulums = [];
    if(Number.isInteger(parseInt(inputN.value()))) {
        n = parseInt(inputN.value());
        createCradle(inputN.value());
        redraw();
    } else {
        createCradle(5);
        n = 5;
        redraw();
    }
}

function createCradle(n) {
    for(let i = 0; i < n; i++) {
        let pendulum = new Pendulum(width/2 + 120*i - n*60+50, 300, width/2 + 120*i - n*60+50, 700, 400);
        pendulums.push(pendulum);
        x = pendulum.position.x;
        y = pendulum.position.y;
    }
    rect(width/2 - 100 - n*60+50, 270, 120*n + 80, 30);
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