
class Pendulum {

    constructor(startX, startY, posX, posY, radius) {
        this.start = createVector(startX, startY);
        this.position = createVector(posX, posY);
        this.r = radius;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.angle = radians(60);
        this.posMagnitude = this.position.mag();
    }

    init() {
        this.length = this.position.y - this.start.y;
        stroke(43, 43, 43);
        line(this.start.x, this.start.y, this.position.x, this.position.y);
        stroke(110, 110, 110);
        strokeWeight(1);
        fill(255, 246, 203);
        circle(this.position.x, this.position.y, this.r*2);
    }

    update() {
        this.position.set(this.start.x + 3*this.r*sin(this.angle), 2*this.start.y + this.r*cos(this.angle), 0);
        this.init();
    }

    setAngle(angle) {
        this.angle = radians(angle);
    }

    getPosition() {
        return this.position;
    }

    setPosition(x, y) {
        let newPos = createVector(x, y);
        let newAngle = newPos.angleBetween(this.position);
        let newAngle2 = this.position.angleBetween(newPos);
        let distVect = p5.Vector.sub(this.start, this.position);
        console.log(degrees(distVect.heading()), newAngle2);
        if(distVect.heading() + newAngle2 > radians(-10) || distVect.heading() + newAngle2 < radians(-165)) {
        } else {
            distVect.rotate(newAngle2);
        }
        this.position = p5.Vector.sub(this.start, distVect);

    }


    startF() {
        let gravity = 0.4;
        this.angularAcceleration = (-1 * gravity / this.r) * sin(this.angle);
        this.angularVelocity += this.angularAcceleration;
        this.angle += this.angularVelocity;
        this.update();
    }
}