import java.util.ArrayList;

public class DFA {
    public ArrayList<StateNode> states;
    public ArrayList<Closure> closures;

//    public String[] symbols = {
//            // 字母，数字
//            "l", "n",
//            // 运算符
//            "+", "-", "k", "/", "=", ">", "<", "%", "!", "&", "o",
//            // 分隔符
//            ".", ",", ";", "{", "}", "q", "p"
//    };

    public String[] symbols = {"a", "b"};

    public DFA(NFA nfa) {
        states = new ArrayList<StateNode>();
        closures = new ArrayList<Closure>();
        InitDFA(nfa);
        showDFA();
    }

    // 由NFA生成DFA
    public void InitDFA(NFA nfa) {
//        closures.get(0).showClosure();
        closures.add(new Closure(nfa.states.get(0), 0));
        // 添加与0闭包对等的statenode
        states.add(0, new StateNode(0, closures.get(0).isEnd, closures.get(0).isStart));
        // 由初始0闭包开始遍历生成其余闭包
        // 遍历dfa已有的每个闭包
        for (int i = 0; i < closures.size(); i++) {
            // 遍历每种字符
            for (int n = 0; n < symbols.length; n++) {
                // 遍历闭包中的每个状态节点
                ArrayList<StateNode> tmpNodes = new ArrayList<StateNode>();
                for (int j = 0; j < closures.get(i).nodes.size(); j++) {
                    // 得到当前闭包中的当前状态节点对于当前字符的可能“下一状态集”
                    ArrayList<StateNode> tmp = closures.get(i).nodes.get(j).findNextNodes(symbols[n]);
                    for (int m = 0; m < tmp.size(); m++) {
                        // 检查当前闭包对于当前字符的下一状态闭包中是否已有“下一状态集”中的成员
                        if (!tmpNodes.contains(tmp.get(m))) {
                            // 若尚未存在，则添加
                            tmpNodes.add(tmp.get(m));
                        }
                    }
                }
                // 当前闭包对于当前字符的下一状态闭包构建完毕，对其进行处理
                if (tmpNodes.size() > 0) {
                    // 生成闭包并空闭包化
                    Closure tmpClosure = new Closure(tmpNodes);
                    // 将新闭包放入closures
//                    closures.add(tmpClosure); 不能用这种，要确认是否已有该集合
                    int result = addClosure(tmpClosure);
                    if (result == -1) {
                        // 返回值-1表示不存在且添加成功
                        // 创建对等的statenode
                        StateNode tmpNode = new StateNode(states.size(), tmpClosure.isEnd, tmpClosure.isStart);
                        // 修改当前闭包对等的statenode的Edge
                        StateNode nowNode = states.get(i);
                        nowNode.addEdge(new Edge(symbols[n], tmpNode));
                        states.set(i, nowNode);
                        // 将新生成的statenode放入states
                        states.add(tmpNode);
                    } else {
                        // 若闭包集内已有与该下一状态闭包等价的闭包
                        // 创建对等的statenode
                        StateNode tmpNode = states.get(result);
                        // 修改当前闭包对等的statenode的Edge
                        StateNode nowNode = states.get(i);
                        nowNode.addEdge(new Edge(symbols[n], tmpNode));
                        states.set(i, nowNode);
                    }
                }
            }
        }
    }

    public int addClosure(Closure c) {
        // 检查闭包集是否已存在该闭包
        for (int i = 0; i < closures.size(); i++) {
            if (closures.get(i).isEqual(c)) return i;
        }
        // 若尚不存在，则添加
        closures.add(c);
        return -1;
    }

    // DFA显示
    public void showDFA() {
        System.out.println("DFA:");
        for (int i = 0; i < states.size(); i++) {
            states.get(i).showEdges();
        }
    }

    public static void main(String[] args) {
//        NFA nfa = new NFA(
//                // 关键字/保留字
//                "(l(l)*)|" +
//                        // 标识符
//                        "((_|$|l)(_|$|l|n)*)|" +
//                        // 运算符
//                        "(+|-|k|/|=|>|<|%|!|o|!=|==|<=|>=|&&|oo)|" +
//                        // 分隔符
//                        "(.|,|;|{|}|q|p)|" +
//                        // 注释符
//                        "//");
        DFA dfa = new DFA(new NFA("(ab*a)*(a|b)b*"));
    }
}
