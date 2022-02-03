class Pendulum {

    constructor(startX, startY, posX, posY, length) {
        this.start = createVector(startX, startY);
        this.position = createVector();
        this.positionInit = createVector(posX, posY);
        this.length = length;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.angle = radians(0);
        this.radius = 60;
        this.dragged = false;
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
        fill('#f1f1f1');
        ellipseMode(CENTER);
        ellipse(this.position.x, this.position.y, this.radius * 2);
    }

    getVelocityVector() {
       return createVector(this.position.x, this.position.y);
       //line(velVec.x, velVec.y, this.positionInit.x, this.positionInit.y);
    }

    getVelocity() {
        return this.radius * this.angularVelocity;
    }

    getHeight() {
        return (this.positionInit.y - this.position.y);
    }

    semiImplicitEuler() {
        if (!this.dragged) {
            let gravity = 0.4;
            this.angularAcceleration = (-1 * gravity / this.length) * sin(this.angle);
            this.angularVelocity += this.angularAcceleration * dt;
            this.angularVelocity *= friction;
            this.angle += this.angularVelocity * dt;
        }
    }

    rk4(h) {
        if (!this.dragged) {

            let length = this.length;
            let gravity = 9.81;

            //ω' = α
            function fVelocity(theta) {
                return (-1 * gravity / length) * Math.sin(theta);
            }

            //θ' = ω
            function fAngle(omega) {
                return omega;
            }

            let currentVel = this.angularVelocity;
            let currentAngle = this.angle;

            let angleA = fAngle(currentVel);
            let velA = fVelocity(currentAngle);

            let angleB = fAngle(currentVel + 1/2 * h * velA);
            let velB = fVelocity(currentAngle + 1/2 * h * angleA);

            let angleC = fAngle(currentVel + 1/2 * h * velB);
            let velC = fVelocity(currentAngle + 1/2 * h * angleB);

            let angleD = fAngle(currentVel + h * velC);
            let velD = fVelocity(currentAngle + h * angleC);

            let angleNext = currentAngle + h / 6 * (angleA + 2 * angleB + 2 * angleC + angleD);
            let velNext = currentVel + h / 6 * (velA + 2 * velB + 2 * velC + velD);

            this.angle = angleNext;
            this.angularVelocity = velNext;
            this.angularAcceleration = fVelocity(angleNext);

            this.angularVelocity *= friction;

        }
    }

    update() {
        if(rk4) {
            this.rk4(rk4step);
        } else {
            this.semiImplicitEuler();
        }
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
        let delayOffset = 0;
        let radiusSum = this.radius + other.radius + delayOffset;
        if (d <= radiusSum * radiusSum) {
            return true;
        }
    }
}