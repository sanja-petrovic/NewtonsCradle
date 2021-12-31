
class CollisionDetection {
    constructor(circle1, circle2) {
        this.circle1 = circle1;
        this.circle2 = circle2;
    }

    detect() {
        let dx = this.circle1.position.x + this.circle1.r - this.circle2.position.x - this.circle2.r;
        let dy = this.circle1.position.y + this.circle1.r - this.circle2.position.y - this.circle2.r;
        let distance = Math.sqrt(dx*dx + dy*dy);

        if(distance <= this.circle1.r + this.circle2.r) {
            console.log("Collision detected!");
        } else {
            console.log("Hmm");
        }
    }
}