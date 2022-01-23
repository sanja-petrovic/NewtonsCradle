class Pendulum {

    constructor(startX, startY, posX, posY, radius) {
        this.start = createVector(startX, startY);
        this.position = createVector();
        this.r = radius;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.angle = radians(45);
        this.length = this.start.y - this.position.y;
        this.ballr = 120;
    }

    init() {
        this.position.set(this.r * sin(this.angle), this.r * cos(this.angle), 0);
        this.position.add(this.start);
        stroke(43, 43, 43);
        line(this.start.x, this.start.y, this.position.x, this.position.y);
        stroke(110, 110, 110);
        strokeWeight(1);
        fill(255, 246, 203);
        ellipseMode(CENTER);
        ellipse(this.position.x, this.position.y, this.ballr, this.ballr);
    }

    update() {
        let gravity = 0.4;
        this.angularAcceleration = (-1 * gravity / this.r) * sin(this.angle);
        this.angularVelocity += this.angularAcceleration;
        this.angle += this.angularVelocity;
    }

    setAngle(angle) {
        this.angle = radians(angle);
    }

    getPosition() {
        return this.position;
    }

    setPosition(x, y) {
        this.position = createVector(x, y);
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
        this.position = createVector(x, y);
    }

    startF() {
        let gravity = 0.4;
        this.angularAcceleration = (-1 * gravity / this.r) * sin(this.angle);
        this.angularVelocity += this.angularAcceleration;
        this.angle += this.angularVelocity;
        this.update();
    }
}