class Pendulum {

    constructor(startX, startY, posX, posY, length) {
        this.start = createVector(startX, startY);
        this.position = createVector();
        this.positionInit = createVector(posX, posY);
        this.length = length;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.angle = radians(0);
        this.ballr = 60;
        this.dragged = false;
        this.friction = 0.999;
        this.elasticity = 1;
        this.mass = 1;
        this.height = 0;
        this.moving = false;
    }

    draw() {
        this.position.set(-this.length * sin(this.angle), this.length * cos(this.angle), 0);
        this.position.add(this.start);
        stroke(43, 43, 43);
        line(this.start.x, this.start.y, this.position.x, this.position.y);
        stroke(110, 110, 110);
        strokeWeight(1);
        fill(255, 246, 203);
        ellipseMode(CENTER);
        ellipse(this.position.x, this.position.y, this.ballr * 2);
    }

    getVelocityVector() {
       let velVec = createVector(this.position.x, this.position.y);
       return velVec;
       //line(velVec.x, velVec.y, this.positionInit.x, this.positionInit.y);
    }

    semiImplicitEuler() {
        if (!this.dragged) {
            let gravity = 0.4;
            this.angularAcceleration = (-1 * gravity / this.length) * sin(this.angle);
            this.angularVelocity += this.angularAcceleration * dt;
            this.angularVelocity *= this.friction;
            this.angle += this.angularVelocity * dt;
        }
    }

    rk4(t) {
        if (!this.dragged) {

            let thetaCurrent = this.angle;
            let omegaCurrent = this.angularVelocity;
            let length = this.length;

            let gravity = 9.81;

            function calculate(theta) {
                return (-1 * gravity / length) * Math.sin(theta);
            }

            this.angularAcceleration = calculate(this.angle);

            let k1theta = t * omegaCurrent;
            let k1omega = t * calculate(thetaCurrent);

            let k2theta = t * (omegaCurrent + 0.5 * t * k1omega);
            let k2omega = t * calculate(thetaCurrent + 0.5 * t * k1theta);

            let k3theta = t * (omegaCurrent + 0.5 * t * k2omega);
            let k3omega = t * calculate(thetaCurrent + 0.5 * t * k2theta);

            let k4theta = t * (omegaCurrent + t * k3omega);
            let k4omega = t * calculate(thetaCurrent + t * k3theta);

            let thetaNext = thetaCurrent + (t / 6) * (k1theta + 2 * k2theta + 2 * k3theta + k4theta);
            let omegaNext = omegaCurrent + (t / 6) * (k1omega + 2 * k2omega + 2 * k3omega + k4omega);

            this.angle = thetaNext;
            this.angularVelocity = omegaNext;
        }
    }

    update() {
        this.rk4(0.4);
        this.draw();
    }

    stopDragging() {
        if (this.dragged) {
            this.dragged = false;
        }
    }

    drag(mx, my, offset) {
        if (this.dragged) {
            let mousePos = createVector(mx, my);
            mousePos.add(offset);
            let diff = p5.Vector.sub(this.start, mousePos);
            this.angle = atan2(-1 * diff.y, -diff.x) - PI / 2;
        }
    }

    detectCollision(other) {
        let dx = this.position.x - other.position.x;
        let dy = this.position.y - other.position.y;
        let d = dx * dx + dy * dy;
        let radiusSum = this.ballr + other.ballr;
        if (d <= radiusSum * radiusSum) {
            return true;
        }
    }
}