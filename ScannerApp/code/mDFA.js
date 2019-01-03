class mDFA {
    // public ArrayList<StateNode> states;
    // public ArrayList<Closure> closures;
    // public String[] symbols;
    // public int startnode_index;
    //
    // private boolean isSliced = false;

    constructor(dfa) {
        this.states = new ArrayList();
        this.closures = new ArrayList();
        this.symbols = dfa.symbols;
        this.InitMDFA(dfa);
        // console.log(this.showDFA());
        for (let i = 0; i < this.states.size(); i++) {
            if (this.states.get(i).isStart) {
                this.startnode_index = i;
                break;
            }
        }
    }

// 初始化mDFA，分为两个closure
    InitMDFA(dfa) {
        // 将节点分为两部分
        let nodes_notEnd = new ArrayList();
        let nodes_End = new ArrayList();
        for (let i = 0; i < dfa.states.size(); i++) {
            if (dfa.states.get(i).isEnd)
                nodes_End.addFromElement(dfa.states.get(i));
            else
                nodes_notEnd.addFromElement(dfa.states.get(i));
        }
        let closure_notEnd = new Closure(nodes_notEnd);
        let closure_End = new Closure(nodes_End);
        this.closures.addFromIndex(0, closure_notEnd);
        this.closures.addFromIndex(1, closure_End);
        // 对两个closure进行分割测试
        this.TestAndSlice();
        while (this.isSliced) {
            this.isSliced = false;
            this.TestAndSlice();
        }
        // 将closures转化为states
        for (let i = 0; i < this.closures.size(); i++) {
            let newNode = new StateNode(i, false, false);
            this.states.addFromElement(newNode);
        }
        for (let i = 0; i < this.closures.size(); i++) {
            for (let j = 0; j < this.closures.get(i).nodes.size(); j++) {
                if (!this.states.get(i).isEnd && this.closures.get(i).nodes.get(j).isEnd) {
                    let tmpNode = this.states.get(i);
                    tmpNode.isEnd = true;
                    this.states.set(i, tmpNode);
                }
                if (!this.states.get(i).isStart && this.closures.get(i).nodes.get(j).isStart) {
                    let tmpNode = this.states.get(i);
                    tmpNode.isStart = true;
                    this.states.set(i, tmpNode);
                }
                for (let m = 0; m < this.closures.get(i).nodes.get(j).edges.size(); m++) {
                    for (let i2 = 0; i2 < this.closures.size(); i2++) {
                        if (this.closures.get(i2).nodes.contains(this.closures.get(i).nodes.get(j).edges.get(m).to)) {
                            let tmpNode1 = this.states.get(i);
                            let tmpNode2 = this.states.get(i2);
                            tmpNode1.addEdgeFromEdge(new Edge(this.closures.get(i).nodes.get(j).edges.get(m).re, tmpNode2));
                            this.states.set(i, tmpNode1);
                        }
                    }
                }
            }
        }
    }

    TestAndSlice() {
        for (let i = 0; i < this.closures.size(); i++) {
            if (this.closures.get(i).nodes.size() > 1) {
                for (let j = 0; j < this.closures.get(i).nodes.size(); j++) {
                    for (let n = 0; n < this.symbols.length; n++) {
                        for (let m = 0; m < this.closures.get(i).nodes.get(j).edges.size(); m++) {
                            // 若当前闭包（节点数大于一）的当前状态节点对于当前字符的存在下一状态，且该下一状态不在当前闭包内
                            if (this.closures.get(i).nodes.get(j).edges.get(m).re === this.symbols[n] && !this.closures.get(i).nodes.contains(this.closures.get(i).nodes.get(j).edges.get(m).to)) {
                                let tmpClosure = this.closures.get(i);
                                let newClosure = Closure.ClosureConstructFromNode(tmpClosure.nodes.remove(j));
                                this.closures.set(i, tmpClosure);
                                this.closures.addFromElement(newClosure);
                                this.isSliced = true;
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

// mDFA显示
    showDFA() {
        let out = "mDFA:\n";
        for (let i = 0; i < this.states.size(); i++) {
            out += this.states.get(i).showEdges();
        }
        return out;
    }
}