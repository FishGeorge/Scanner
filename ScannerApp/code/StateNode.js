class StateNode {
    constructor(num, isEnd, isStart) {
        this.num = num;
        this.edges = new ArrayList([]);
        this.isEnd = isEnd;
        this.isStart = isStart;
    }

    StateNode(s) {
        this.num = s.num;
        this.edges = s.edges;
        this.isEnd = s.isEnd;
    }

    findNextNodes(str) {
        let out = new ArrayList([]);
        for (let i = 0; i < this.edges.size(); i++) {
            if (this.edges.get(i).re === str)
                out.addFromElement(this.edges.get(i).to);
        }
        return out;
    }

    isEqual(n) {
        // 为防止NFA.java 39行所述问题（这里的newNode可能有一个自己指向的自己并不是自己的问题，因为Edge构造函数中，这里是一个拷贝）
        // 只检查两个node的标号是否一致
        if (this.num === n.num)
            return true;
        else
            return false;
    }

    addEdgeFromEdge(edge) {
        // 检查node是否已存在该edge
        for (let i = 0; i < this.edges.size(); i++) {
            if (this.edges.get(i).isEqual(edge)) return false;
        }
        // 若尚不存在，则添加
        this.edges.addFromElement(edge);
        return true;
    }

    addEdgeFromIndex(index, edge) {
        // 检查node是否已存在该edge
        // console.log("this.edges.size() " + this.edges.size());
        for (let i = 0; i < this.edges.size(); i++) {
            if (this.edges.get(i).isEqual(edge)) return false;
        }
        // 若尚不存在，则添加
        this.edges.addFromIndex(index, edge);
        return true;
    }

    showStateNode() {
        if (this.isEnd)
            if (this.isStart)
                return "[(" + this.num + ")]";
            else
                return "(" + this.num + ")";
        else if (this.isStart)
            return '[' + this.num + ']';
        else
            return this.num;
    }

    showEdges() {
        let out = "";
        for (let i = 0; i < this.edges.size(); i++)
            out += this.showStateNode() + " -- " + this.edges.get(i).re + " --> " + this.edges.get(i).to.showStateNode() + "\n";
        return out;
    }
}