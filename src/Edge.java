import java.util.ArrayList;

public class Edge {
    public String re;
    public StateNode to;

    public Edge(String str, StateNode t) {
        re = str;
        to = t;
    }

    public Edge(Edge e) {
        this.re = e.re;
        this.to = e.to;
    }

    public boolean isEqual(Edge e) {
        if (this.re.equals(e.re) && this.to.isEqual(e.to))
            return true;
        else
            return false;
    }
}
