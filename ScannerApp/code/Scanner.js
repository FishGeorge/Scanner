class Scanner {
    // public mDFA mDFA_Scanner;
    // public String[] keywords;
    // public ArrayList<String[]> tokentype;

    // constructor(mdfa, keywords, tokentype) {
    //     this.mDFA_Scanner = mdfa;
    //     this.keywords = keywords;
    //     this.tokentype = tokentype;
    // }

    constructor(mdfa, tokentype) {
        this.mDFA_Scanner = mdfa;
        this.tokentype = tokentype;
    }

    set(re) {
        this.mDFA_Scanner = new mDFA(new DFA(new NFA(re), ["l", "n", "_", "$", "+", "-", "k", "/", "=", ">", "<", "%", "!", "&", "o", ".", ",", ";", "{", "}", "[", "]", "q", "p", "\"", "'", "?"]));
        let java_tokentype = new ArrayList();
        java_tokentype.addFromElement(["<", "LT"]);
        java_tokentype.addFromElement(["<=", "LE"]);
        java_tokentype.addFromElement(["==", "EQ"]);
        java_tokentype.addFromElement(["!=", "NE"]);
        java_tokentype.addFromElement([">", "GT"]);
        java_tokentype.addFromElement([">=", "GE"]);
        java_tokentype.addFromElement(["+", "ADD"]);
        java_tokentype.addFromElement(["-", "MINUS"]);
        java_tokentype.addFromElement(["*", "MULTIPLY"]);
        java_tokentype.addFromElement(["/", "DIVIDE"]);
        java_tokentype.addFromElement(["=", "ASSIGN"]);
        java_tokentype.addFromElement(["%", "REMAIN"]);
        java_tokentype.addFromElement(["!", "NOT"]);
        java_tokentype.addFromElement(["&&", "AND"]);
        java_tokentype.addFromElement(["||", "OR"]);
        java_tokentype.addFromElement([".", "SEPARATOR"]);
        java_tokentype.addFromElement([",", "SEPARATOR"]);
        java_tokentype.addFromElement([";", "SEPARATOR"]);
        java_tokentype.addFromElement(["{", "SEPARATOR"]);
        java_tokentype.addFromElement(["}", "SEPARATOR"]);
        java_tokentype.addFromElement(["[", "SEPARATOR"]);
        java_tokentype.addFromElement(["]", "SEPARATOR"]);
        java_tokentype.addFromElement(["(", "SEPARATOR"]);
        java_tokentype.addFromElement([")", "SEPARATOR"]);
        java_tokentype.addFromElement(["\"", "SEPARATOR"]);
        java_tokentype.addFromElement(["'", "SEPARATOR"]);
        java_tokentype.addFromElement(["?", "SEPARATOR"]);
        this.tokentype = java_tokentype;
    }

    scan(code) {
        let tokens_str = "";
        let outTokens = this.recognize(code);
        for (let i = 0; i < outTokens.size(); i++) {
            tokens_str += outTokens.get(i).toString();
            tokens_str += "\n";
        }
        return tokens_str;
    }

    recognize(code) {
        let tokens = new ArrayList();
        let length_code = code.length;
        let codeBlock = "";
//        int pt;
        let node_now = this.mDFA_Scanner.states.get(this.mDFA_Scanner.startnode_index);
        let str1For_mDFA = " ";
        let isInErr = false;
        for (let pt = 0; pt < length_code; pt++) {
//            if (codeBlock.equals(" ") || codeBlock.equals("\n") || codeBlock.equals("\t")) {
//                codeBlock = "";
//            }
            let charFromcode_now = code.charAt(pt);
            // 记录pt这一位字符到str1For_mDFA（RE特殊字符转换）
            if ((charFromcode_now.charCodeAt(0) >= 65 && charFromcode_now.charCodeAt(0) <= 90) || (charFromcode_now.charCodeAt(0) >= 97 && charFromcode_now.charCodeAt(0) <= 122)) {
                str1For_mDFA = "l";
            } else if (charFromcode_now.charCodeAt(0) >= 48 && charFromcode_now.charCodeAt(0) <= 57) {
                str1For_mDFA = "n";
            } else if (charFromcode_now === "*") {
                str1For_mDFA = "k";
            } else if (charFromcode_now === "|") {
                str1For_mDFA = "o";
            } else if (charFromcode_now === "(") {
                str1For_mDFA = "q";
            } else if (charFromcode_now === ")") {
                str1For_mDFA = "p";
            } else {
                str1For_mDFA = charFromcode_now;
            }
            if (node_now.findNextNodes(str1For_mDFA).size() === 0) {// 将pt这一位字符输入状态机，若发现无下一状态
                if (isInErr && str1For_mDFA.equals(" ")) {// 若之前存在code词法错误，且该字符为空格，处理错误
                    tokens.addFromElement(Token.TokenConstructFromValue("err", codeBlock));
                    isInErr = false;
                    codeBlock = "";
                    continue;
                }
                if (node_now.isEnd) {// 当前处于接受态
                    if (this.isInTokenTypes(codeBlock) !== -1) // 匹配到非id与num的字符串
                        tokens.addFromElement(Token.TokenConstructFromValue(this.tokentype.get(this.isInTokenTypes(codeBlock))[1], codeBlock));
                    else if (this.isNumeric(codeBlock))
                        tokens.addFromElement(Token.TokenConstructFromValue("NUM", codeBlock));
                    else
                        tokens.addFromElement(Token.TokenConstructFromValue("ID", codeBlock));
//                    codeBlock = String.valueOf(charFromcode_now);
                    if (!(str1For_mDFA === " " || str1For_mDFA === "\n")) pt--;
                    codeBlock = "";
                    node_now = this.mDFA_Scanner.states.get(this.mDFA_Scanner.startnode_index);
                } else {// 若不处于接受态，说明code与RE不符
                    if (codeBlock === "") continue;// 排除掉多余空格与回车
                    isInErr = true;
                    node_now = this.mDFA_Scanner.states.get(this.mDFA_Scanner.startnode_index);
                }
            } else if (node_now.findNextNodes(str1For_mDFA).size() === 1) {// 若发现有下一状态
                // 而已有字符串是符号，且下一位是字母
                if (this.isInTokenTypes(codeBlock) !== -1 && ((code.charCodeAt(pt + 1) >= 65 && code.charCodeAt(pt + 1) <= 90) || (code.charCodeAt(pt + 1) >= 97 && code.charCodeAt(pt + 1) <= 122))) {
                    tokens.addFromElement(Token.TokenConstructFromValue(this.tokentype.get(this.isInTokenTypes(codeBlock))[1], codeBlock));
                    pt--;
                    codeBlock = "";
                    node_now = this.mDFA_Scanner.states.get(this.mDFA_Scanner.startnode_index);
                } else {
                    node_now = node_now.findNextNodes(str1For_mDFA).get(0);
                    codeBlock += charFromcode_now;
                }
            } else {
                // never reach here
            }
        }
        return tokens;
    }

    // isInKeywords(str) {
    //     return new ArrayList(this.keywords).contains(str);
    // }

    isInTokenTypes(str) {
        for (let i = 0; i < this.tokentype.size(); i++) {
            if (this.tokentype.get(i)[0] === str)
                return i;
        }
        return -1;
    }

    isNumeric(str) {
        return !isNaN(str);
        // Pattern pattern = Pattern.compile("[0-9]*");
        // if (str.indexOf(".") > 0) {// 判断是否有小数点
        //     if (str.indexOf(".") == str.lastIndexOf(".") && str.split("\\.").length == 2) { // 判断是否只有一个小数点
        //         return pattern.matcher(str.replace(".", "")).matches();
        //     } else {
        //         return false;
        //     }
        // } else {
        //     return pattern.matcher(str).matches();
        // }
    }
}