import java.util.ArrayList;

public class StateNode {
    public int num;
    public ArrayList<Edge> edges;
    public boolean isStart = false;
    public boolean isEnd;

    public StateNode(int num, boolean isEnd, boolean isStart) {
        this.num = num;
        edges = new ArrayList<Edge>();
        this.isEnd = isEnd;
        this.isStart = isStart;
    }

    public StateNode(StateNode s) {
        this.num = s.num;
        this.edges = s.edges;
        this.isEnd = s.isEnd;
    }

    public ArrayList<StateNode> findNextNodes(String str) {
        ArrayList<StateNode> out = new ArrayList<StateNode>();
        for (int i = 0; i < edges.size(); i++) {
            if (edges.get(i).re.equals(str))
                out.add(edges.get(i).to);
        }
        return out;
    }

    public boolean isEqual(StateNode n) {
        // 为防止NFA.java 39行所述问题（这里的newNode可能有一个自己指向的自己并不是自己的问题，因为Edge构造函数中，这里是一个拷贝）
        // 只检查两个node的标号是否一致
        if (this.num == n.num)
            return true;
        else
            return false;
    }

    public boolean addEdge(Edge edge) {
        // 检查node是否已存在该edge
        for (int i = 0; i < edges.size(); i++) {
            if (edges.get(i).isEqual(edge)) return false;
        }
        // 若尚不存在，则添加
        edges.add(edge);
        return true;
    }

    public boolean addEdge(int index, Edge edge) {
        // 检查node是否已存在该edge
        for (int i = 0; i < edges.size(); i++) {
            if (edges.get(i).isEqual(edge)) return false;
        }
        // 若尚不存在，则添加
        edges.add(index, edge);
        return true;
    }

    public String showStateNode() {
        if (isEnd)
            if (isStart)
                return "[(" + String.valueOf(num) + ")]";
            else
                return "(" + String.valueOf(num) + ")";
        else if (isStart)
            return '[' + String.valueOf(num) + ']';
        else
            return String.valueOf(num);
    }

    public void showEdges() {
        for (int i = 0; i < this.edges.size(); i++)
            System.out.println(this.showStateNode() + " -- " + edges.get(i).re + " --> " + edges.get(i).to.showStateNode());
    }
}
