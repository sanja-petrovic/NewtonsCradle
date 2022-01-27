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

    move() {
        if(!this.dragged) {
            let gravity = 0.8;
            this.angularAcceleration = (-1 * gravity / this.length) * sin(this.angle);
            this.angularVelocity += this.angularAcceleration;
            this.angularVelocity *= this.friction;
            this.angle += this.angularVelocity;
        }
    }

    update() {
        this.move();
        this.draw();
    }

    stop() {
        this.angularVelocity = - this.elasticity * this.angularVelocity;
        this.angularAcceleration = 0;
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
}