class Island {
    constructor() {
        this.circles = [];
    }

    addCircle(c1) {
        this.circles.push(c1);
    }

    setAngle(angle) {
        for(let i = 0; i < this.circles.length; i++) {
            this.circles[i].angle = angle;
        }
    }

    setVelocity(angularVelocity) {
        for(let i = 0; i < this.circles.length; i++) {
            this.circles[i].angularVelocity = angularVelocity;
            if(angularVelocity !== 0) {
                this.circles[i].moving = true;
            } else {
                this.circles[i].moving = false;
            }
        }
    }

    isInIsland(c1) {
        for(let i = 0; i < this.circles.length; i++) {
            if(c1 === this.circles[i]) {
                return true;
            }
        }

        return false;
    }

    clear() {
        this.circles = [];
    }
}