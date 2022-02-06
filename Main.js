let buttonStart = document.getElementById("btn");
let button;
let width = window.innerWidth;
let height = window.innerHeight;
let n = 5;
let selectedPendulum;
let selected = false;
let directionLock = false;
let swingAngle = 0;
let swingVelocity = 0;
let dt = 1;
let selectionLock = false;
let friction = 1;
let rk4step = 0.35;
let rk4 = true;
let pendulums = [];
let reverse = false;
let selectedPendulumOg;
let selectedCount = 0;
let counted = false;
let island = new Island();
let island2 = new Island();

let sliderPend = document.getElementById("sliderPendulums");
let sliderPendVal = document.getElementById("sliderPendValue");
sliderPendVal.innerHTML = sliderPend.value;
sliderPend.oninput = function () {
    pendulums = [];
    sliderPendVal.innerHTML = this.value;
    n = this.value;
    createCradle(n);
}

let sliderFriction = document.getElementById("sliderFriction");
let frictionVal = document.getElementById("sliderFrValue");
frictionVal.innerHTML = sliderFriction.value;
sliderFriction.oninput = function () {
    friction = parseFloat(this.value.toString());
    frictionVal.innerHTML = this.value;
}

let algorithmCheck = document.getElementById("algorithmCheck");

function setup() {
    createCanvas(width, height);
    createCradle(n);
    frameRate(60);
    textSize(20);
    strokeWeight(0);
    textStyle(NORMAL);
}

function overPendulum(size, position) {
    if(mouseX > position.x - size && mouseX < position.x + size
        && mouseY > position.y - size && mouseY < position.y + size) {
        return true;
    }
    return false;
}

let collisionList = [];

function draw() {
    background(255, 104, 196);
    let color2 = color('#8ffff9');
    let color1 = color('#62e5ff');
    setGradient(0, 0, 1920, 1080, color2, color1, "Y");
    stroke(110, 110, 110);
    strokeWeight(1);
    fill('#f1f1f1');
    rect(width/2 - 100 - n*60+60, 270, 120*n + 80, 30);

    for(let i = 0; i < n; i++) {
        pendulums[i].update();
        fill('black');
        text(i + ": " + round(pendulums[i].angle, 2), 100, 400+i*50);
    }

    if(algorithmCheck.checked) {
        rk4 = true;
    } else {
        rk4 = false;
    }


    if(selected) {
        handleCollisions();
    }

}

let collisionLock = true;
function handleCollisions() {

    detectCollisions();
    reverseDirections();
    change();
    correctPositions();
    resolveCollisions();

    collisionList = [];


}

function detectCollisions() {
    let collision = new Collision();

    text(direction, 200, 500);
    for(let i = 0; i < n-1; i++) {
        for (let j = i + 1; j < n; j++) {
            if(!((direction === "l" && i < selectedPendulum) || (direction === "r" && i >= selectedPendulum)))
            {
                let result = collision.findCollisionFeatures(pendulums[i], pendulums[j]);
                if (result != null) {
                    collisionList.push(result);
                    break;
                }

            }
        }
    }
    text("sel: " + selectedPendulum, 300, 600);
    text("count: " + selectedCount, 300, 650);
    text("col num: " + collisionList.length, 300, 500);

    if(direction === "r") {
        collisionList.reverse();
    }
}

function correctPositions() {
    if(!selectionLock) {
        for(let i = 0; i < collisionList.length; i++) {
            if(!collisionList[i].c1.moving) {
                swingAngle = collisionList[i].c1.angle;
                collisionList[i].c1.angle -= swingAngle;
            }
            if(!collisionList[i].c2.moving) {
                swingAngle = collisionList[i].c2.angle;
                collisionList[i].c2.angle -= swingAngle;
            }
        }
    }


}

function resolveCollisions() {
    for(let j = 0; j < collisionList.length; j++) {
        applyImpulse2(collisionList[j]);
    }
}

function reverseDirections() {
    if(!directionLock && collisionList.length === Math.abs(n - selectedCount)) {
        if(direction === "r") {
            direction = "l";
        } else if(direction === "l") {
            direction = "r";
        }
    }
}


function applyImpulse2(manifold) {
    let invMass1 = 1 / manifold.c1.mass;
    let invMass2 = 1 / manifold.c2.mass;
    let invMassSum = invMass1 + invMass2;

    let relativeVel = manifold.c2.getVelocity() - manifold.c1.getVelocity();
    let j = (-(1 + friction) * relativeVel) / invMassSum;

    let v1 = -j * invMass1;
    let v2 = -j * invMass2;
    let w1 = v1 / manifold.c1.radius;
    let w2 = v2 / manifold.c2.radius;

    manifold.c1.angularVelocity += w1;
    manifold.c2.angularVelocity -= w2;
}

function change() {
    if(!selectionLock && collisionList.length === Math.abs(n - selectedCount)) {
        selectedPendulum = n - 1 - selectedPendulum;
        for(let i = 0; i < n; i++) {
            if(pendulums[i].moving) {
                pendulums[i].moving = false;
            }
        }
    }
}

function countSelected() {
    if(!counted) {
        if(direction === "l") {
            for(let i = 0; i <= selectedPendulum; i++) {
                selectedCount++;
            }
        } else if(direction === "r") {
            for(let i = selectedPendulum; i < n; i++) {
                selectedCount++;
            }
        }
    }

    counted = true;
}

function collisionLeftToRight(index) {
    if(pendulums[index].detectCollision(pendulums[index + 1])) {
        for(let i = 0; i <= index; i++) {
            if(!pendulums[i].moving) {
                pendulums[i].angularVelocity = 0;
                //Reference: https://www.wired.com/2011/10/how-to-model-newtons-cradle/
                // 'So this leaves the case of v2f = 0, or the ball that was initially moving ends up at rest.'
                pendulums[i].angle = 0;
            }
        }

        for(let i = n - 1 - index; i < n; i++) {

            //Zakon odrzanja impulsa kod Njutnovog klatna nalaze da:
            //inicijalna brzina = krajnja brzina
            //Ref: https://www.school-for-champions.com/science/newtons_cradle_derivation.htm
            pendulums[i].angularVelocity += swingVelocity * friction;
            pendulums[i].moving = true;
        }

        if(!selectionLock) {
            selectedPendulum = n - 1 - index;
            direction = "r";
            for(let i = n - 1 - index; i < n; i++) {
                pendulums[i].moving = false;
            }
        }
    }
}

function collisionRightToLeft(index) {
    if(pendulums[index].detectCollision(pendulums[index - 1])) {
        for(let i = n - 1; i >= index; i--) {
            if(!pendulums[i].moving) {
                pendulums[i].angularVelocity = 0;
                pendulums[i].angle = 0;
            }
        }

        for(let i = 0; i <= n - 1 - index; i++) {
            pendulums[i].angularVelocity += swingVelocity * friction;
            pendulums[i].moving = true;
        }

        if(!selectionLock) {
            selectedPendulum = n - 1 - index;
            direction = "l";
            for(let i = 0; i <= n - 1 - index; i++) {
                pendulums[i].moving = false;
            }
        }

    }
}
function mousePressed() {
    counted = false;
    selectedCount = 0;
    selected = false;
    released = false;
    selectedPendulum = -1;
    for(let i = 0; i < n; i++) {
        pendulums[i].moving = false;
        pendulums[i].angularVelocity = 0;
        pendulums[i].angle = 0;
    }
    for (let i = 0; i < n; i++) {
        if (overPendulum(pendulums[i].radius, pendulums[i].position)) {
            selectionLock = true;
            selected = true;
            selectedPendulum = i;
            selectedPendulumOg = i;
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
    if(selectionLock) {
        island.clear();
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
                let offset = (i - selectedPendulum) * pendulums[i].radius*2;
                pendulums[i].drag(mouseX, mouseY, offset);
                pendulums[i].moving = true;
            }
        } else if (direction === "r") {
            for(let i = selectedPendulum; i < n; i++) {
                pendulums[i].dragged = true;
                let offset = (i - selectedPendulum) * pendulums[i].radius*2;
                pendulums[i].drag(mouseX, mouseY, offset);
                pendulums[i].moving = true;
            }
        }
    }


}

let released = false;
function mouseReleased() {

    if(selectionLock) {
        if(direction === "l") {
            for(let i = selectedPendulum; i >= 0; i--) {
                pendulums[i].stopDragging();
            }
        } else if(direction === "r") {
            for(let i = selectedPendulum; i < n; i++) {
                pendulums[i].stopDragging();
            }
        }
    }

    countSelected();
    directionLock = false;
    selectionLock = false;
    released = true;
}

function restartSim() {
    pendulums = [];
    n = 5;
    createCradle(5);
    for(let i = 0; i < n; i++) {
        pendulums[i].angularVelocity = 0;
        pendulums[i].angle = 0;
        pendulums[i].angularAcceleration = 0;
    }
    swingVelocity = 0;
    swingAngle = 0;
    sliderPend.value = 5;
    friction = 1;
    sliderFriction.value = 1;
    sliderPendVal.innerHTML = 5;
    frictionVal.innerHTML = 1;
    rk4 = true;
    algorithmCheck.checked = true;
    island.clear();
    redraw();
}

function createCradle(n) {
    pendulums = [];
    for(let i = 0; i < n; i++) {
        let pendulum = new Pendulum(width/2 + 120*i - n*60+60, 300, width/2 + 120*i - n*60+60, 700, 400, i);
        pendulums.push(pendulum);
        pendulum.draw();
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
