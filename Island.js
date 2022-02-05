class Island {
    constructor() {
        this.circles = [];
    }

    addCircle(c1) {
        this.circles.push(c1);
    }

    setIndex(index) {
        this.index = index;
    }

    setAngle(angle) {
        for(let i = 0; i < this.circles.length; i++) {
            if(!this.circles[i].moving) {
                this.circles[i].angle = 0;
            }
        }
    }

    setVelocity(angularVelocity) {
        for(let i = 0; i < this.circles.length; i++) {
            this.circles[i].angularVelocity += angularVelocity;
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