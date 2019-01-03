class Closure {
    // 状态的集合，用于表示closure
    // public ArrayList<StateNode> nodes;
    // public boolean isStart = false;
    // public boolean isEnd = false;
    // public int num;

    constructor(arrayNodes) {
        this.nodes = arrayNodes;
        this.change2_eclosure();
        // 修改Closure的isEnd
        for (let i = 0; i < this.nodes.size(); i++) {
            if (this.nodes.get(i).isEnd) {
                this.isEnd = true;
                break;
            }
            if (this.nodes.get(i).isStart) {
                this.isStart = true;
                break;
            }
        }
    }

    static ClosureConstructFromNode(node) {
        let nodes = new ArrayList();
        nodes.addFromElement(node);
        let outClosure = new Closure(nodes);
        outClosure.change2_eclosure();
        return outClosure;
    }

    static ClosureConstructFromNum(node, num) {
        let nodes = new ArrayList();
        nodes.addFromElement(node);
        let outClosure = new Closure(nodes);
        outClosure.change2_eclosure();
        outClosure.num = num;
        return outClosure;
    }

    addNode(node) {
        // 检查闭包是否已存在该node
        for (let i = 0; i < this.nodes.size(); i++) {
            if (this.nodes.get(i).isEqual(node)) return;
        }
        // 若尚不存在，则添加
        this.nodes.addFromElement(node);
        // 修改Closure的isEnd
        if (!this.isStart && node.isStart)
            this.isStart = true;
        if (!this.isEnd && node.isEnd)
            this.isEnd = true;
    }

    change2_eclosure() {
//        boolean isChanged = false;
        for (let i = 0; i < this.nodes.size(); i++) {
            for (let j = 0; j < this.nodes.get(i).edges.size(); j++) {
                if (this.nodes.get(i).edges.get(j).re === "e") {
                    this.addNode(this.nodes.get(i).edges.get(j).to);
//                    isChanged = true;
                }
            }
        }
//        if (isChanged) change2_eclosure();
    }

    showClosure() {
        let out = "";
        out += "{";
        for (let i = 0; i < this.nodes.size(); i++) {
            out += this.nodes.get(i).showStateNode();
            if (i !== (this.nodes.size() - 1))
                out += ", ";
        }
        out += "}\n";
        return out;
    }

    isEqual(closure) {
        // 检查长度
        if (this.nodes.size() !== closure.nodes.size())
            return false;
        else {
            // 检查内容
            for (let i = 0; i < this.nodes.size(); i++) {
                for (let j = 0; j < closure.nodes.size(); j++) {
                    if (this.nodes.get(i).isEqual(closure.nodes.get(j))) break;
                    if (j === (closure.nodes.size() - 1)) return false;
                }
            }
        }
        // 通过检查
        return true;
    }
}