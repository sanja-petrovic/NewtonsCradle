class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    add(vect) {
        return new Vector(this.x + vect.x, this.y + vect.y);
    }

    sub(vect) {
        return new Vector(this.x - vect.x, this.y - vect.y);
    }

    mult(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    div(scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
    }

    unit() {
        if(this.magnitude() !== 0)
            return this.div(this.magnitude());
        else
            return new Vector(0, 0);
    }

    dot(vect) {
        return new Vector(this.x * vect.x, this.y * vect.y);
    }

    cross(vect) {
        return this.x * vect.y - this.y * vect.x;
    }

    normal(direction) {
        return new Vector(direction * (-this.y), direction*this.x);
    }

    unitNormal(direction) {
        return this.normal(direction).unit();
    }
}