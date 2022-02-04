class CollisionManifold {

    CollisionManifold(depth, normal, contactPoint) {
        this.contactPoint = contactPoint;
        this.depth = depth;
        this.colliding = true;
        this.normal = normal;
    }

    addContactPoint(contactPoint) {
    }
}