class Edge {
    constructor(str, t) {
        this.re = str;
        this.to = t;
    }

    // Edge(e) {
    //     this.re = e.re;
    //     this.to = e.to;
    // }

    isEqual(e) {
        if (this.re===e.re && this.to.isEqual(e.to))
            return true;
        else
            return false;
    }
}