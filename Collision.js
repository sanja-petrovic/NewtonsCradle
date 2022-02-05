class Collision {

    findCollisionFeatures(a, b) {
        let dx = a.position.x - b.position.x;
        let dy = a.position.y - b.position.y;
        let d = dx * dx + dy * dy;
        let distance = dist(a.position.x, a.position.y, b.position.x, b.position.y);
        let delayOffset = 10;
        let radiusSum = a.radius + b.radius + delayOffset;
        if (d - radiusSum * radiusSum > 0) {
            return null;
        }
        let depth = Math.abs(distance - radiusSum) * 0.5;
        let distanceToPoint = depth - a.radius;
        let normal = p5.Vector.sub(a.position, b.position);
        normal.normalize();

        let contactPoint = p5.Vector.add(normal.mult(distanceToPoint), a.position);

        let result = new CollisionManifold(depth, normal, contactPoint, a, b);

        /*strokeWeight(10);
        point(contactPoint);*/

        return result;
    }

}