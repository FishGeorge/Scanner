class DFA {
    // public ArrayList<StateNode> states;
    // public ArrayList<Closure> closures;
    //
    // public String[] symbols;

//    public String[] symbols = {"a", "b"};

    constructor(nfa, symbols) {
        this.states = new ArrayList();
        this.closures = new ArrayList();
        this.symbols = symbols;
        this.InitDFA(nfa);
        // console.log(this.showDFA());
    }

// 由NFA生成DFA
    InitDFA(nfa) {
//        closures.get(0).showClosure();
        this.closures.addFromElement(Closure.ClosureConstructFromNum(nfa.states.get(0), 0));
        // 添加与0闭包对等的statenode
        this.states.addFromIndex(0, new StateNode(0, this.closures.get(0).isEnd, this.closures.get(0).isStart));
        // 由初始0闭包开始遍历生成其余闭包
        // 遍历dfa已有的每个闭包
        for (let i = 0; i < this.closures.size(); i++) {
            // 遍历每种字符
            for (let n = 0; n < this.symbols.length; n++) {
                // 遍历闭包中的每个状态节点
                let tmpNodes = new ArrayList();
                for (let j = 0; j < this.closures.get(i).nodes.size(); j++) {
                    // 得到当前闭包中的当前状态节点对于当前字符的可能“下一状态集”
                    let tmp = this.closures.get(i).nodes.get(j).findNextNodes(this.symbols[n]);
                    for (let m = 0; m < tmp.size(); m++) {
                        // 检查当前闭包对于当前字符的下一状态闭包中是否已有“下一状态集”中的成员
                        if (!tmpNodes.contains(tmp.get(m))) {
                            // 若尚未存在，则添加
                            tmpNodes.addFromElement(tmp.get(m));
                        }
                    }
                }
                // 当前闭包对于当前字符的下一状态闭包构建完毕，对其进行处理
                if (tmpNodes.size() > 0) {
                    // 生成闭包并空闭包化
                    let tmpClosure = new Closure(tmpNodes);
                    // 将新闭包放入closures
//                    closures.add(tmpClosure); 不能用这种，要确认是否已有该集合
                    let result = this.addClosure(tmpClosure);
                    if (result === -1) {
                        // 返回值-1表示不存在且添加成功
                        // 创建对等的statenode
                        let tmpNode = new StateNode(this.states.size(), tmpClosure.isEnd, tmpClosure.isStart);
                        // 修改当前闭包对等的statenode的Edge
                        let nowNode = this.states.get(i);
                        nowNode.addEdgeFromEdge(new Edge(this.symbols[n], tmpNode));
                        this.states.set(i, nowNode);
                        // 将新生成的statenode放入states
                        this.states.addFromElement(tmpNode);
                    } else {
                        // 若闭包集内已有与该下一状态闭包等价的闭包
                        // 创建对等的statenode
                        let tmpNode = this.states.get(result);
                        // 修改当前闭包对等的statenode的Edge
                        let nowNode = this.states.get(i);
                        nowNode.addEdgeFromEdge(new Edge(this.symbols[n], tmpNode));
                        this.states.set(i, nowNode);
                    }
                }
            }
        }
    }

    addClosure(c) {
        // 检查闭包集是否已存在该闭包
        for (let i = 0; i < this.closures.size(); i++) {
            if (this.closures.get(i).isEqual(c)) return i;
        }
        // 若尚不存在，则添加
        this.closures.addFromElement(c);
        return -1;
    }

// DFA显示
    showDFA() {
        let out = "DFA:\n";
        for (let i = 0; i < this.states.size(); i++) {
            out += this.states.get(i).showEdges();
        }
        return out;
    }
}