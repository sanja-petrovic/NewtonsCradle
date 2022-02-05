class CollisionManifold {

    constructor(depth, normal, contactPoint, c1, c2) {
        this.contactPoint = contactPoint;
        this.depth = depth;
        this.colliding = true;
        this.normal = normal;
        this.c1 = c1;
        this.c2 = c2;
    }
}