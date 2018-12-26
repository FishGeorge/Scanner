import java.util.ArrayList;

public class StateNode {
    public int num;
    public ArrayList<Edge> edges;
    public boolean isEnd;

    public StateNode(int num, boolean b) {
        this.num = num;
        edges = new ArrayList<Edge>();
        isEnd = b;
    }

    public String showStateNode() {
        if (isEnd)
            return '(' + String.valueOf(num) + ')';
        else
            return String.valueOf(num);
    }

    public void showEdges() {
        for (int i = 0; i < this.edges.size(); i++)
            System.out.println(this.showStateNode() + " --" + edges.get(i).re + "--> " + edges.get(i).to.showStateNode());
    }
}
