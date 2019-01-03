public class Token {
    public String type;
    public String value;
    public boolean hasContent;

    public Token(String type) {
        this.type = type;
        hasContent = false;
    }

    public Token(String type, String value) {
        this.type = type;
        this.value = value;
        hasContent = true;
    }

    public String toString() {
        if (hasContent)
            return "<" + type + "," + value + ">";
        else
            return "<" + type + ">";
    }
}
