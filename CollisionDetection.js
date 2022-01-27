
class CollisionDetection {
    constructor(circle1, circle2) {
        this.circle1 = circle1;
        this.circle2 = circle2;
        this.detected = false;
    }

    detect() {
        let dx = (this.circle1.position.x + this.circle1.ballr) - (this.circle2.position.x + this.circle2.ballr);
        let dy = (this.circle1.position.y + this.circle1.ballr) - (this.circle2.position.y + this.circle2.ballr);
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= this.circle1.ballr + this.circle2.ballr + 2) {
            this.circle1.stop();
        }
    }

    getDetected() {
        return this.detected;
    }
}