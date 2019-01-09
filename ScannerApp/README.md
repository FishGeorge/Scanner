# Compilers Principle Course Design
## Introduction
&emsp;&emsp;原先该词法分析器是开发在Java下的，有严格的OO设计封装。因为后来需求变更想做一个UI，Java平台的UI框架又十分贫瘠，所以花了不少时间把Java代码移植到JS下，代码也有非常浓厚的OO味在里面（苦笑）。Java源代码烦请移步<a href="https://github.com/FishGeorge/Scanner">FishGeorge/Scanner</a>获取。<br>
&emsp;&emsp;CP老师的要求原本是“输入RE，输出一个程序。而该程序接受输入Code，输出Token串”，从设计上考虑，我将上下两层合并，做成了“输入RE与Code，输出Token串”。这两种程序我认为在实现价值上是等价的。<br>
&emsp;&emsp;下面是一些关于程序实现需要注意的细节，如有疑惑请联系我。<br>
<br>&emsp;&emsp;Author: 71Y16114 龚呈<br>
&emsp;&emsp;Github@FishGeorge&emsp;E-mail: gongcheng3c@foxmail.com

---
## Directory
* .\code : js源文件，主要由java代码移植而来，RE->mDFA的转换与分析器的实现
* .\doc : 词法分析器的示例文本
* .\semantic : Semantic UI框架文件
* .\html : 除初始页index.html外的其他html文件

---
## Code Structure
* 基本类 :<br>
StateNode : 状态机中的状态节点，维护一个Arraylist\<Edge\>及一些状态属性<br>
Edge : 状态机图论中的边，维护一个RE块及一个指向StateNode<br>
Closure : 某状态的空值等价闭包，维护一个Arraylist\<StateNode\><br>
* 状态机类 :<br>
NFA : 不定有限状态机，通过RE字符串初始化<br>
DFA : 确定有限状态机，通过实例NFA与RE中所用字符Arraylist初始化<br>
mDFA : 最小化确定有限状态机，通过实例DFA初始化<br>
* 主类 :<br>
Scanner : 结合实例mDFA读取Code进行处理
* 工具类 :<br>
ArrayList : JS下封装的一个近似Java.ArrayList的类<br>
Token : 用于封装Code经处理后的结果

---
## Usage & Requirement
* scanner.html页面中，词法分析器有两个输出，分别为Code和RE。<br>Code输入框即为词法分析器的输入框，输入任意代码（当然，应符合输入的RE）。<br>RE的格式示例如 a(a|b)|b*。其中 (, ), *, | 四种字符用作RE识别判断符，故不可使用，如有需要可用其他字符代替（例如示例中使用q, p, k, o代替）。
* 单击“Refresh & NextExample”按钮重置页面并更换示例。
* 单击“Scan it!”按钮进行词法分析。
* Token类型已定义，详细如下：

词|Token类型|Token值
:--|:--|:--
字符串|ID|字符串本身（实际应为指向符号表指针）
数字（含小数）|NUM|数字本身（实际应为指向符号表指针）
<|LT|<
<=|LE|<=
==|EQ|==
!=|NE|!=
\>|GT|\>
\>=|GE|\>=
+|ADD|+
-|MINUS|-
\*|MULTIPLY|\*
/|DIVIDE|/
=|ASSIGN|=
%|REMAIN|%
!|NOT|!
&&|AND|&&
\|\||OR|\|\||
. , ; { } [ ] ( ) " ' ?|SEPARATOR|分隔符本身

---