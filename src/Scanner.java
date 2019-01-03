import java.util.ArrayList;
import java.util.Arrays;
import java.util.regex.Pattern;

public class Scanner {
    public mDFA mDFA_Scanner;
    public String[] keywords;
    public ArrayList<String[]> tokentype;

    public Scanner(mDFA mdfa, String[] keywords, ArrayList<String[]> tokentype) {
        this.mDFA_Scanner = mdfa;
        this.keywords = keywords;
        this.tokentype = tokentype;
    }

    public void set(String re) {
        this.mDFA_Scanner = new mDFA(new DFA(new NFA(re), new String[]{"l", "n", "_", "$", "+", "-", "k", "/", "=", ">", "<", "%", "!", "&", "o", ".", ",", ";", "{", "}", "[", "]", "q", "p", "\"", "'", "?"}));
        ArrayList<String[]> java_tokentype = new ArrayList<>();
        java_tokentype.add(new String[]{"<", "LT"});
        java_tokentype.add(new String[]{"<=", "LE"});
        java_tokentype.add(new String[]{"==", "EQ"});
        java_tokentype.add(new String[]{"!=", "NE"});
        java_tokentype.add(new String[]{">", "GT"});
        java_tokentype.add(new String[]{">=", "GE"});
        java_tokentype.add(new String[]{"+", "ADD"});
        java_tokentype.add(new String[]{"-", "MINUS"});
        java_tokentype.add(new String[]{"*", "MULTIPLY"});
        java_tokentype.add(new String[]{"/", "DIVIDE"});
        java_tokentype.add(new String[]{"=", "ASSIGN"});
        java_tokentype.add(new String[]{"%", "REMAIN"});
        java_tokentype.add(new String[]{"!", "NOT"});
        java_tokentype.add(new String[]{"&&", "AND"});
        java_tokentype.add(new String[]{"||", "OR"});
        java_tokentype.add(new String[]{".", "SEPARATOR"});
        java_tokentype.add(new String[]{",", "SEPARATOR"});
        java_tokentype.add(new String[]{";", "SEPARATOR"});
        java_tokentype.add(new String[]{"{", "SEPARATOR"});
        java_tokentype.add(new String[]{"}", "SEPARATOR"});
        java_tokentype.add(new String[]{"[", "SEPARATOR"});
        java_tokentype.add(new String[]{"]", "SEPARATOR"});
        java_tokentype.add(new String[]{"(", "SEPARATOR"});
        java_tokentype.add(new String[]{")", "SEPARATOR"});
        java_tokentype.add(new String[]{"\"", "SEPARATOR"});
        java_tokentype.add(new String[]{"'", "SEPARATOR"});
        java_tokentype.add(new String[]{"?", "SEPARATOR"});
        this.tokentype = java_tokentype;
    }

    public String scan(String code) {
        String tokens_str = "";
        ArrayList<Token> outTokens = recognize(code);
        for (int i = 0; i < outTokens.size(); i++) {
            tokens_str += outTokens.get(i).toString();
            tokens_str += "\n";
        }
        return tokens_str;
    }

    public ArrayList<Token> recognize(String code) {
        ArrayList<Token> tokens = new ArrayList<Token>();
        int length_code = code.length();
        String codeBlock = "";
//        int pt;
        StateNode node_now = mDFA_Scanner.states.get(mDFA_Scanner.startnode_index);
        String str1For_mDFA = " ";
        boolean isInErr = false;
        for (int pt = 0; pt < length_code; pt++) {
//            if (codeBlock.equals(" ") || codeBlock.equals("\n") || codeBlock.equals("\t")) {
//                codeBlock = "";
//            }
            char charFromcode_now = code.charAt(pt);
            // 记录pt这一位字符到str1For_mDFA（RE特殊字符转换）
            if (((int) charFromcode_now >= 65 && (int) charFromcode_now <= 90) || ((int) charFromcode_now >= 97 && (int) charFromcode_now <= 122)) {
                str1For_mDFA = "l";
            } else if ((int) charFromcode_now >= 48 && (int) charFromcode_now <= 57) {
                str1For_mDFA = "n";
            } else if (charFromcode_now == '*') {
                str1For_mDFA = "k";
            } else if (charFromcode_now == '|') {
                str1For_mDFA = "o";
            } else if (charFromcode_now == '(') {
                str1For_mDFA = "q";
            } else if (charFromcode_now == ')') {
                str1For_mDFA = "p";
            } else {
                str1For_mDFA = String.valueOf(charFromcode_now);
            }
            if (node_now.findNextNodes(str1For_mDFA).size() == 0) {// 将pt这一位字符输入状态机，若发现无下一状态
                if (isInErr && str1For_mDFA.equals(" ")) {// 若之前存在code词法错误，且该字符为空格，处理错误
                    tokens.add(new Token("err", codeBlock));
                    isInErr = false;
                    codeBlock = "";
                    continue;
                }
                if (node_now.isEnd) {// 当前处于接受态
                    if (isInTokenTypes(codeBlock) != -1) // 匹配到非id与num的字符串
                        tokens.add(new Token(tokentype.get(isInTokenTypes(codeBlock))[1], codeBlock));
                    else if (isNumeric(codeBlock))
                        tokens.add(new Token("NUM", codeBlock));
                    else
                        tokens.add(new Token("ID", codeBlock));
//                    codeBlock = String.valueOf(charFromcode_now);
                    if (!(str1For_mDFA.equals(" ") || str1For_mDFA.equals("\n"))) pt--;
                    codeBlock = "";
                    node_now = mDFA_Scanner.states.get(mDFA_Scanner.startnode_index);
                } else {// 若不处于接受态，说明code与RE不符
                    if (codeBlock.equals("")) continue;// 排除掉多余空格与回车
                    isInErr = true;
                    node_now = mDFA_Scanner.states.get(mDFA_Scanner.startnode_index);
                }
            } else if (node_now.findNextNodes(str1For_mDFA).size() == 1) {// 若发现有下一状态
                // 而已有字符串是符号，且下一位是字母
                if (isInTokenTypes(codeBlock) != -1 && (((int) code.charAt(pt + 1) >= 65 && (int) code.charAt(pt + 1) <= 90) || ((int) code.charAt(pt + 1) >= 97 && (int) code.charAt(pt + 1) <= 122))) {
                    tokens.add(new Token(tokentype.get(isInTokenTypes(codeBlock))[1], codeBlock));
                    pt--;
                    codeBlock = "";
                    node_now = mDFA_Scanner.states.get(mDFA_Scanner.startnode_index);
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

    public boolean isInKeywords(String str) {
        return Arrays.asList(keywords).contains(str);
    }

    public int isInTokenTypes(String str) {
        for (int i = 0; i < tokentype.size(); i++) {
            if (tokentype.get(i)[0].equals(str))
                return i;
        }
        return -1;
    }


    public boolean isNumeric(String str) {
        Pattern pattern = Pattern.compile("[0-9]*");
        if (str.indexOf(".") > 0) {// 判断是否有小数点
            if (str.indexOf(".") == str.lastIndexOf(".") && str.split("\\.").length == 2) { // 判断是否只有一个小数点
                return pattern.matcher(str.replace(".", "")).matches();
            } else {
                return false;
            }
        } else {
            return pattern.matcher(str).matches();
        }
    }

    public static void main(String[] args) {
        String[] java_keywords = {
                "abstract", "assert", "boolean", "break", "byte", "case",
                "catch", "char", "class", "const", "continue", "default",
                "do", "double", "else", "enum", "extends", "final", "finally",
                "float", "for", "goto", "if", "implements", "import", "instanceof",
                "int", "interface", "long", "native", "new", "package", "private",
                "protected", "public", "return", "strictfp", "short", "static",
                "super", "switch", "synchronized", "this", "throw", "throws",
                "transient", "try", "void", "volatile", "while"
        };
        ArrayList<String[]> java_tokentype = new ArrayList<>();
        java_tokentype.add(new String[]{"<", "LT"});
        java_tokentype.add(new String[]{"<=", "LE"});
        java_tokentype.add(new String[]{"==", "EQ"});
        java_tokentype.add(new String[]{"!=", "NE"});
        java_tokentype.add(new String[]{">", "GT"});
        java_tokentype.add(new String[]{">=", "GE"});
        java_tokentype.add(new String[]{"+", "ADD"});
        java_tokentype.add(new String[]{"-", "MINUS"});
        java_tokentype.add(new String[]{"*", "MULTIPLY"});
        java_tokentype.add(new String[]{"/", "DIVIDE"});
        java_tokentype.add(new String[]{"=", "ASSIGN"});
        java_tokentype.add(new String[]{"%", "REMAIN"});
        java_tokentype.add(new String[]{"!", "NOT"});
        java_tokentype.add(new String[]{"&&", "AND"});
        java_tokentype.add(new String[]{"||", "OR"});
        java_tokentype.add(new String[]{".", "SEPARATOR"});
        java_tokentype.add(new String[]{",", "SEPARATOR"});
        java_tokentype.add(new String[]{";", "SEPARATOR"});
        java_tokentype.add(new String[]{"{", "SEPARATOR"});
        java_tokentype.add(new String[]{"}", "SEPARATOR"});
        java_tokentype.add(new String[]{"[", "SEPARATOR"});
        java_tokentype.add(new String[]{"]", "SEPARATOR"});
        java_tokentype.add(new String[]{"(", "SEPARATOR"});
        java_tokentype.add(new String[]{")", "SEPARATOR"});
        java_tokentype.add(new String[]{"\"", "SEPARATOR"});
        java_tokentype.add(new String[]{"'", "SEPARATOR"});
        java_tokentype.add(new String[]{"?", "SEPARATOR"});

        // 对正则表达式的书写要求
        // 单个字母用字母l表示，单个数字用字母n表示
        // 运算符 + - / = > < % ! & 用自身表示，乘运算的*用字母k表示，或运算的|用字母o表示
        // 分隔符 . , ; { } [ ] 用自身表示，左括号(用字母q表示，右括号)用字母p表示
        // 其他符号 " ' ? 用自身表示
        Scanner scanner = new Scanner(new mDFA(new DFA(
                new NFA("(l(l)*)|(nn*)|(nn*.nn*)|((_|$|l)(_|$|l|n)*)|(+|-|k|/|=|>|<|%|!|(!=)|(==)|(<=)|(>=)|(&&)|(oo))|(.|,|;|{|}|[|]|q|p)|(\"|'|?)"),
                new String[]{"l", "n", "_", "$", "+", "-", "k", "/", "=", ">", "<", "%", "!", "&", "o", ".", ",", ";", "{", "}", "[", "]", "q", "p", "\"", "'", "?"})
        ), java_keywords, java_tokentype);
        String code = "public class Test{\n" +
                "    public boolean B = 1 <= 2.5;\n" +
                "    public static void main(String[] args){\n" +
                "        System.out.println(\"Hello world!\");\n" +
                "    }\n" +
                "}";
        System.out.println("\nScanner output:");
        System.out.println(scanner.scan(code));
    }
}
