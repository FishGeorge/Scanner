import java.util.ArrayList;

public class NFA {
    public ArrayList<StateNode> states;

    public NFA(String str) {
        states = new ArrayList<StateNode>();
        // 初始化NFA
        // 最原始的NFA：0 --re--> (1) （括号表示圈，指状态机终止状态）
        StateNode tmp0 = new StateNode(0, false);
        StateNode tmp1 = new StateNode(1, true);
        tmp0.edges.add(new Edge(str, tmp1));
        states.add(0, tmp0);
        states.add(1, tmp1);
    }

    // NFA显示
    public void showNFA() {
        for (int i = 0; i < states.size(); i++) {
            states.get(i).showEdges();
        }
    }

    // re为'('开头的字符串，找这个'('对应的')'
    public int searchBracket(String re) {
        // 这对括号内所包含的括号对数（含自身）
        int pair = 1;
        ArrayList<Integer> leftBracs = new ArrayList<Integer>();
        leftBracs.add(0);
        // 第一个右括号
        int possible_rightBrac = re.indexOf(')');
        // 若存在已发现右方的未发现的左括号，且其在第pair个右括号左边
        while (re.indexOf('(', leftBracs.get(pair - 1) + 1) != -1 && re.indexOf('(', leftBracs.get(pair - 1) + 1) < possible_rightBrac) {
            // 记录该左括号位置
            leftBracs.add(re.indexOf('(', leftBracs.get(pair - 1) + 1));
            // console.log("left: " + re.indexOf('(', leftBracs[pair - 1] + 1));
            // 对数+1
            pair++;
            System.out.println("leftBracs: " + leftBracs);
            // 找下一个右括号
            possible_rightBrac = re.indexOf(')', possible_rightBrac + 1);
        }
        return possible_rightBrac;
    }

    public static void main(String[] args) {
        new NFA("((ba)a)(ab)").showNFA();
    }
}
