
class CollisionDetection {
    constructor(circle1, circle2) {
        this.circle1 = circle1;
        this.circle2 = circle2;
    }

    detect() {
        let dx = this.circle1.pos.x + this.circle1.radius - this.circle2.pos.x - this.circle2.radius;
        let dy = this.circle1.pos.y + this.circle1.radius - this.circle2.pos.y - this.circle2.radius;
        let distance = Math.sqrt(dx*dx + dy*dy);

        if(distance <= this.circle1.radius + this.circle2.radius) {
            console.log("Collision detected!");
        } else {
            console.log("Hmm");
        }
    }
}