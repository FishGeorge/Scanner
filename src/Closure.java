import java.util.ArrayList;

public class Closure {
    // 状态的集合，用于表示closure
    public ArrayList<StateNode> nodes;
    public boolean isStart = false;
    public boolean isEnd = false;
    public int num;

    public Closure(ArrayList<StateNode> arrayNodes) {
        nodes = arrayNodes;
        change2_eclosure();
        // 修改Closure的isEnd
        for (int i = 0; i < nodes.size(); i++){
            if (nodes.get(i).isEnd) {
                isEnd = true;
                break;
            }
            if (nodes.get(i).isStart) {
                isStart = true;
                break;
            }
        }
    }

    public Closure(StateNode node) {
        nodes = new ArrayList<StateNode>();
        addNode(node);
        change2_eclosure();
    }

    public Closure(StateNode node, int num) {
        nodes = new ArrayList<StateNode>();
        addNode(node);
        change2_eclosure();
        this.num = num;
    }

    public void addNode(StateNode node) {
        // 检查闭包是否已存在该node
        for (int i = 0; i < nodes.size(); i++) {
            if (nodes.get(i).isEqual(node)) return;
        }
        // 若尚不存在，则添加
        nodes.add(node);
        // 修改Closure的isEnd
        if (!isStart && node.isStart)
            isStart = true;
        if (!isEnd && node.isEnd)
            isEnd = true;
    }

    public void change2_eclosure() {
//        boolean isChanged = false;
        for (int i = 0; i < nodes.size(); i++) {
            for (int j = 0; j < nodes.get(i).edges.size(); j++) {
                if (nodes.get(i).edges.get(j).re.equals("e")) {
                    this.addNode(nodes.get(i).edges.get(j).to);
//                    isChanged = true;
                }
            }
        }
//        if (isChanged) change2_eclosure();
    }

    public void showClosure() {
        System.out.print("{");
        for (int i = 0; i < nodes.size(); i++) {
            System.out.print(nodes.get(i).showStateNode());
            if (i != nodes.size() - 1)
                System.out.print(", ");
        }
        System.out.println("}");
    }

    public boolean isEqual(Closure closure) {
        // 检查长度
        if (nodes.size() != closure.nodes.size())
            return false;
        else {
            // 检查内容
            for (int i = 0; i < nodes.size(); i++) {
                for (int j = 0; j < closure.nodes.size(); j++) {
                    if (nodes.get(i).isEqual(closure.nodes.get(j))) break;
                    if (j == closure.nodes.size() - 1) return false;
                }
            }
        }
        // 通过检查
        return true;
    }
}
