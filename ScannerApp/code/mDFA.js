class mDFA {
    // public ArrayList<StateNode> states;
    // public ArrayList<Closure> closures;
    // public String[] symbols;
    // public int startnode_index;
    //
    // private boolean isAfterSliced = false;

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
        while (this.isAfterSliced) {
            this.isAfterSliced = false;
            this.TestAndSlice();
        }
        // 将closures转化为states
        for (let i = 0; i < this.closures.size(); i++) {
            let newNode = new StateNode(i, false, false);
            this.states.addFromElement(newNode);
        }
        for (let i = 0; i < this.closures.size(); i++) {
            for (let j = 0; j < this.closures.get(i).nodes.size(); j++) {
                for (let m = 0; m < this.closures.get(i).nodes.get(j).edges.size(); m++) {
                    for (let i2 = 0; i2 < this.closures.size(); i2++) {
                        if (this.closures.get(i2).nodes.contains(this.closures.get(i).nodes.get(j).edges.get(m).to)) {
                            // 舍去 不可划分的子集 中 状态节点的互相跳转边
                            if (i === i2 && this.closures.get(i).nodes.get(j).num !== this.closures.get(i).nodes.get(j).edges.get(m).to.num)
                                break;
                            let tmpNode1 = this.states.get(i);
                            let tmpNode2 = this.states.get(i2);
                            tmpNode1.addEdgeFromEdge(new Edge(this.closures.get(i).nodes.get(j).edges.get(m).re, tmpNode2));
                            this.states.set(i, tmpNode1);
                        }
                    }
                }
                // 设置isEnd
                if (!this.states.get(i).isEnd && this.closures.get(i).nodes.get(j).isEnd) {
                    let tmpNode = this.states.get(i);
                    tmpNode.isEnd = true;
                    this.states.set(i, tmpNode);
                }
                // 设置isStart
                if (!this.states.get(i).isStart && this.closures.get(i).nodes.get(j).isStart) {
                    let tmpNode = this.states.get(i);
                    tmpNode.isStart = true;
                    this.states.set(i, tmpNode);
                }
            }
        }
    }

    TestAndSlice() {
        for (let c = 0; c < this.closures.size(); c++) {
            if (this.closures.get(c).nodes.size() > 1) {
                for (let n = 0; n < this.closures.get(c).nodes.size(); n++) {
                    for (let s = 0; s < this.symbols.length; s++) {
                        for (let e = 0; e < this.closures.get(c).nodes.get(n).edges.size(); e++) {
                            // 1.9 这个判断规则似乎，很有问题啊...
                            // 若当前闭包（节点数大于1）的当前状态节点对于当前字符的存在下一状态，且该下一状态不在当前闭包内
                            // if (this.closures.get(c).nodes.get(n).edges.get(e).re === this.symbols[s] && !this.closures.get(c).nodes.contains(this.closures.get(c).nodes.get(n).edges.get(e).to)) {
                            //     let tmpClosure = this.closures.get(c);
                            //     let newClosure = Closure.ClosureConstructFromNode(tmpClosure.nodes.remove(n));
                            //     this.closures.set(c, tmpClosure);
                            //     this.closures.addFromElement(newClosure);
                            //     this.isAfterSliced = true;
                            //     return;
                            // }
                            // 1.9 修改为如下
                            if (this.closures.get(c).nodes.get(n).edges.get(e).re === this.symbols[s]) {
                                // 若当前闭包（节点数大于1）的当前状态节点对于当前字符 存在 下一状态
                                // 找出下一状态所属闭包
                                let toClosure;
                                for (let c2 = 0; c2 < this.closures.size(); c2++) {
                                    if (this.closures.get(c2).nodes.contains(this.closures.get(c).nodes.get(n).edges.get(e).to)) {
                                        toClosure = this.closures.get(c2);
                                        break;
                                    }
                                }
                                // 遍历同一闭包内其他状态节点n2，是否有弱等价的跳转边（指向同一闭包）
                                for (let n2 = 0; n2 < this.closures.get(c).nodes.size(); n2++) {
                                    if (n2 === n) continue;
                                    if (this.closures.get(c).nodes.get(n2).edges.size() === 0) {
                                        //若n2压根没有边，那分割出n2
                                        let tmpClosure = this.closures.get(c);
                                        let newClosure = Closure.ClosureConstructFromNode(tmpClosure.nodes.remove(n2));
                                        this.closures.set(c, tmpClosure);
                                        this.closures.addFromElement(newClosure);
                                        this.isAfterSliced = true;
                                        return;
                                    }
                                    for (let e2 = 0; e2 < this.closures.get(c).nodes.get(n2).edges.size(); e2++) {
                                        if (toClosure.nodes.contains(this.closures.get(c).nodes.get(n2).edges.get(e2).to)) {
                                            // 若n2有等价的跳转边，则跳出状态n2（当前情况下n2与n至少弱等价）
                                            break;
                                        } else {
                                            if (e2 === this.closures.get(c).nodes.get(n2).edges.size()) {
                                                // 若n2找不到等价的跳转边，分割出n2（这实际上应该是个闭包层次的问题（而不是两个状态间的问题），需要维护一个表记录闭包内所有状态的指向，进行横向比较，这里...暂时就这样吧）
                                                let tmpClosure = this.closures.get(c);
                                                let newClosure = Closure.ClosureConstructFromNode(tmpClosure.nodes.remove(n2));
                                                this.closures.set(c, tmpClosure);
                                                this.closures.addFromElement(newClosure);
                                                this.isAfterSliced = true;
                                                return;
                                            }
                                        }
                                    }
                                }
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