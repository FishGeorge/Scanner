class Token {
    // public String type;
    // public String value;
    // public boolean hasContent;

    constructor(type) {
        this.type = type;
        this.hasContent = false;
    }

    static TokenConstructFromValue(type, value) {
        let outToken = new Token(type);
        outToken.value = value;
        outToken.hasContent = true;
        return outToken;
    }

    toString() {
        if (this.hasContent)
            return "<" + this.type + "," + this.value + ">";
        else
            return "<" + this.type + ">";
    }
}