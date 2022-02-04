class Collision {

    /*Collision() {
        this.c1 = null;
        this.c2 = null;
    }*/

    detect(c1, c2) {
        let result = new CollisionManifold();
        let dx = c1.position.x - c2.position.x;
        let dy = c1.position.y - c2.position.y;
        let d = dx * dx + dy * dy;
        let delayOffset = 0;
        let radiusSum = c1.radius + c2.radius + delayOffset;
        if (d <= radiusSum * radiusSum) {
            this.c1 = c1;
            this.c2 = c2;
            return true;
        }

    }


    respond(c1, c2) {
        this.c1.angularVelocity = 0;
        this.c1.angle = 0;
        this.c2.angularVelocity += swingVelocity * friction;
    }

    findCollisionFeatures(a, b) {
        let result = new CollisionManifold();
        let dx = a.position.x - b.position.x;
        let dy = a.position.y - b.position.y;
        let d = dx * dx + dy * dy;
        let distance = dist(a.position.x, a.position.y, b.position.x, b.position.y);
        let delayOffset = 0;
        let radiusSum = a.radius + b.radius + delayOffset;
        if (d - radiusSum * radiusSum > 0) {
            return result;
        }
        let depth = Math.abs(distance - radiusSum) * 0.5;
        let distanceToPoint = depth - a.radius;
        let normal = p5.Vector.sub(a.position, b.position);
        normal.normalize();

        let contactPoint = p5.Vector.add(normal.mult(distanceToPoint), a.position);

        result = new Collision(depth, normal, contactPoint);
        strokeWeight(10);
        point(contactPoint);


        return result;
    }

}