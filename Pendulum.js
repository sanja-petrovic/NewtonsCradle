class Pendulum {

    constructor(startX, startY, posX, posY, length) {
        this.start = createVector(startX, startY);
        this.position = createVector();
        this.length = length;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.angle = radians(0);
        this.ballr = 60;
        this.dragged = false;
        this.friction = 0.999;
        this.elasticity = 0;
        this.mass = 1;
        this.maxTimeDelta = 0.1;
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
        ellipse(this.position.x, this.position.y, this.ballr*2);
    }

    semiImplicitEuler() {
        if(!this.dragged) {
            let gravity = 0.4;
            this.angularAcceleration = (-1 * gravity / this.length) * sin(this.angle);
            this.angularVelocity += this.angularAcceleration * dt;
            this.angularVelocity *= this.friction;
            this.angle += this.angularVelocity * dt;
        }
    }

    rk4(t) {
        if(!this.dragged) {

            let thetaCurrent = this.angle;
            let omegaCurrent = this.angularVelocity;
            let length = this.length;

            let gravity = 9.81;

            function calculate(theta) {
                return (-1 * gravity / length) * sin(theta);
            }

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
        this.rk4(0.5);
        this.draw();
    }

    stop() {
        this.angularVelocity = - this.elasticity * this.angularVelocity;
    }

    onClick(mx, my) {
        let d = dist(mx, my, this.position.x, this.position.y);
        if (d < this.ballr) {
            this.dragged = true;
        }
    }

    stopDragging() {
        if(this.dragged) {
            this.dragged = false;
            this.angularVelocity = 0;
        }
    }

    drag(mx, my, offset) {
        if(this.dragged) {
            let mousePos = createVector(mx, my);
            mousePos.add(offset);
            let diff = p5.Vector.sub(this.start, mousePos);
            this.angle = atan2(-1*diff.y, -diff.x) - PI/2;
        }
    }

    detectCollision(other) {
        let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
        if(d < this.ballr + other.ballr) {
            this.angularVelocity = 0;
            this.angle = 0; //treba mi elegantnije resenje za ovo
            return true;
        }
    }
}

function closestPoint(startX, startY, endX, endY, pointX, pointY) {
    let a1 = endY - startY
    let b1 = startX - endX
    let c1 = (endY - startY) * startX + (startX - endX) * startY;
    let c2 = - b1 * pointX + a1 * pointY
    let det = a1*a1 - -b1*b1;
    let cx = 0;
    let cy = 0;
    if(det != 0) {
        cx = (a1*c1 - b1*c2)/det;
        cy = (a1*c2 - -b1*c1)/det;
    } else {
        cx = pointX;
        cy = pointY;
    }

}