import java.util.ArrayList;

public class mDFA {
    public ArrayList<StateNode> states;
    public ArrayList<Closure> closures;
    public String[] symbols = {"a", "b"};

    private boolean isSliced = false;

    public mDFA(DFA dfa) {
        states = new ArrayList<StateNode>();
        closures = new ArrayList<Closure>();
        symbols = dfa.symbols;
        InitMDFA(dfa);
        showDFA();
    }

    // 初始化mDFA，分为两个closure
    public void InitMDFA(DFA dfa) {
        // 将节点分为两部分
        ArrayList<StateNode> nodes_notEnd = new ArrayList<>();
        ArrayList<StateNode> nodes_End = new ArrayList<>();
        for (int i = 0; i < dfa.states.size(); i++) {
            if (dfa.states.get(i).isEnd)
                nodes_End.add(dfa.states.get(i));
            else
                nodes_notEnd.add(dfa.states.get(i));
        }
        Closure closure_notEnd = new Closure(nodes_notEnd);
        Closure closure_End = new Closure(nodes_End);
        closures.add(0, closure_notEnd);
        closures.add(1, closure_End);
        // 对两个closure进行分割测试
        testAndslice();
        while (isSliced) {
            isSliced = false;
            testAndslice();
        }
        // 将closures转化为states
        for (int i = 0; i < closures.size(); i++) {
            StateNode newNode = new StateNode(i, false, false);
            states.add(newNode);
        }
        for (int i = 0; i < closures.size(); i++) {
            for (int j = 0; j < closures.get(i).nodes.size(); j++) {
                if (!states.get(i).isEnd && closures.get(i).nodes.get(j).isEnd) {
                    StateNode tmpNode = states.get(i);
                    tmpNode.isEnd = true;
                    states.set(i, tmpNode);
                }
                if (!states.get(i).isStart && closures.get(i).nodes.get(j).isStart) {
                    StateNode tmpNode = states.get(i);
                    tmpNode.isStart = true;
                    states.set(i, tmpNode);
                }
                for (int m = 0; m < closures.get(i).nodes.get(j).edges.size(); m++) {
                    for (int i2 = 0; i2 < closures.size(); i2++) {
                        if (closures.get(i2).nodes.contains(closures.get(i).nodes.get(j).edges.get(m).to)) {
                            StateNode tmpNode1 = states.get(i);
                            StateNode tmpNode2 = states.get(i2);
                            tmpNode1.addEdge(new Edge(closures.get(i).nodes.get(j).edges.get(m).re, tmpNode2));
                            states.set(i, tmpNode1);
                        }
                    }
                }
            }
        }
    }

    public void testAndslice() {
        for (int i = 0; i < closures.size(); i++) {
            if (closures.get(i).nodes.size() > 1) {
                for (int j = 0; j < closures.get(i).nodes.size(); j++) {
                    for (int n = 0; n < symbols.length; n++) {
                        for (int m = 0; m < closures.get(i).nodes.get(j).edges.size(); m++) {
                            // 若当前闭包（节点数大于一）的当前状态节点对于当前字符的存在下一状态，且该下一状态不在当前闭包内
                            if (closures.get(i).nodes.get(j).edges.get(m).re.equals(symbols[n]) && !closures.get(i).nodes.contains(closures.get(i).nodes.get(j).edges.get(m).to)) {
                                Closure tmpClosure = closures.get(i);
                                Closure newClosure = new Closure(tmpClosure.nodes.remove(j));
                                closures.set(i, tmpClosure);
                                closures.add(newClosure);
                                isSliced = true;
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

    // DFA显示
    public void showDFA() {
        System.out.println("mDFA:");
        for (int i = 0; i < states.size(); i++) {
            states.get(i).showEdges();
        }
    }

    public static void main(String[] args) {
        // 1
//        mDFA obj_mDFA = new mDFA(new DFA(new NFA("aa*(bab*a)*(a|b)b*")));
        // 2
//        mDFA obj_mDFA = new mDFA(new DFA(new NFA("a(bab*a)*(a|b)b*")));
        // 3
//        mDFA obj_mDFA = new mDFA(new DFA(new NFA("(ab*a)*(a|b)b*")));
        // 4
//        mDFA obj_mDFA = new mDFA(new DFA(new NFA("((ba*)*a)*(a|b)")));
        // 5
        mDFA obj_mDFA = new mDFA(new DFA(new NFA("aa*((bab*a)*(a|b)b*)*")));
    }
}
