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
let selectedPendulum;
let selected = false;
let directionLock = false;
let swingAngle = 0;
let swingVelocity = 0;
let swingVector;
let dt = 1;
let startTime;
let executeOnce = false;

function setup() {
    createCanvas(width, height);
    inputN = createInput('Enter number of pendulums');
    inputN.position(22, 70);
    buttonStart = createButton('Start simulation');
    buttonStart.mousePressed(inputEvent);
    createCradle(n);
    frameRate(60);
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
    rect(width/2 - 100 - n*60+50, 270, 120*n + 80, 30)

    for(let i = 0; i < n; i++) {
        pendulums[i].update();
    }

    if(selected) {
        if(direction === "l" && selectedPendulum != (n - 1)) {
            swingVelocity = pendulums[0].angularVelocity;
            collisionLeftToRight();
        } else if(direction === "r" && selectedPendulum != 0) {
            swingVelocity = pendulums[n-1].angularVelocity;
            collisionRightToLeft();
        }
    }
}


function collisionLeftToRight() {
    if(pendulums[selectedPendulum].detectCollision(pendulums[selectedPendulum + 1])) {

        for(let i = 0; i <= selectedPendulum; i++) {
            if(!pendulums[i].moving) {
                console.log("hi " + i);
                pendulums[i].angularVelocity = 0;
                pendulums[i].angle = 0;
            }
        }

        for(let i = n - 1 - selectedPendulum; i < n; i++) {

            //Zakon odrzanja impulsa kod Njutnovog klatna nalaze da:
            //inicijalna brzina = krajnja brzina
            //Ref: https://www.school-for-champions.com/science/newtons_cradle_derivation.htm
            pendulums[i].angularVelocity += swingVelocity;
            pendulums[i].moving = true;

        }
        //selectedPendulum = n - 1 - selectedPendulum;
    }
}

function collisionRightToLeft() {
    if(pendulums[selectedPendulum].detectCollision(pendulums[selectedPendulum - 1])) {

        for(let i = n - 1; i >= selectedPendulum; i--) {
            if(!pendulums[i].moving) {
                console.log("hi " + i);
                pendulums[i].angularVelocity = 0;
                pendulums[i].angle = 0;
            }
        }

        for(let i = 0; i <= n - 1 - selectedPendulum; i++) {
            pendulums[i].angularVelocity += swingVelocity;
            pendulums[i].moving = true;
        }

        //selectedPendulum = n - 1 - selectedPendulum;
    }
}

function mousePressed() {
    selectedCount = 0;
    selected = false;
    selectedPendulum = -1;
    for(let i = 0; i < n; i++) {
        pendulums[i].moving = false;
        pendulums[i].angularVelocity = 0;
        pendulums[i].angle = 0;
    }
    for (let i = 0; i < n; i++) {
        if (overPendulum(pendulums[i].ballr, pendulums[i].position)) {
            selected = true;
            selectedPendulum = i;
        }
    }
}

function mouseDirection() {
    if(pmouseX > mouseX) {
        return "l";
    }
    else if(pmouseX < mouseX) {
        return "r";
    }
}


let direction;
function mouseDragged() {
    if(!directionLock) {
        direction = mouseDirection();
        directionLock = true;
    }

    if(mouseY < 600) {
        mouseY = 600;
    }
    if(direction === "l") {
        for(let i = 0; i <= selectedPendulum; i++) {
            pendulums[i].dragged = true;
            let offset = (i - selectedPendulum) * pendulums[i].ballr*2;
            pendulums[i].drag(mouseX, mouseY, offset);
            swingAngle = pendulums[i].angle;
            pendulums[i].moving = false;
        }
    } else if (direction === "r") {
        for(let i = selectedPendulum; i < n; i++) {
            pendulums[i].dragged = true;
            let offset = (i - selectedPendulum) * pendulums[i].ballr*2;
            pendulums[i].drag(mouseX, mouseY, offset);
            swingAngle = pendulums[i].angle;
            pendulums[i].moving = false;
        }
    }


}

function mouseReleased() {

    if(direction === "l") {
        for(let i = selectedPendulum; i >= 0; i--) {
            pendulums[i].stopDragging();
        }
    } else if(direction === "r") {
        for(let i = selectedPendulum; i < n; i++) {
            pendulums[i].stopDragging();
        }
    }
    directionLock = false;
    startTime = 0;
}

function inputEvent() {
    pendulums = [];
    if(Number.isInteger(parseInt(inputN.value()))) {
        n = parseInt(inputN.value());
        createCradle(inputN.value());
        redraw();
    } else {
        n = 5;
        createCradle(5);
        redraw();
    }
}

function createCradle(n) {
    pendulums = [];
    for(let i = 0; i < n; i++) {
        let pendulum = new Pendulum(width/2 + 120*i - n*60+50, 300, width/2 + 120*i - n*60+50, 700, 400);
        pendulums.push(pendulum);
        pendulum.draw();
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