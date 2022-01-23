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
        this.position.set(this.r * sin(this.angle), this.r * cos(this.angle), 0); // Polar to cartesian conversion
        this.position.add(this.start); // Make sure the position is relative to the pendulum's origin
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
        this.angularAcceleration = (-1 * gravity / this.r) * sin(this.angle); // Calculate acceleration (see: http://www.myphysicslab.com/pendulum1.html)
        this.angularVelocity += this.angularAcceleration; // Increment velocity
        this.angle += this.angularVelocity; // Increment angle
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