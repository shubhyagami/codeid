let editor = null;
let openTabs = [];
let activeFilePath = null;
let fileTreeData = null;
let currentFileContent = {};
let editorModel = null;
let isRunning = false;

// ═══════════════════════════════════════════════════════════════════
// Java Type Knowledge Base — IntelliJ-like autocomplete intelligence
// ═══════════════════════════════════════════════════════════════════

const JAVA_TYPE_DB = {
    // ── String ──────────────────────────────────────────────────
    'String': [
        { label: 'length', kind: 'Method', detail: 'int length()', documentation: 'Returns the length of this string', insertText: 'length()' },
        { label: 'charAt', kind: 'Method', detail: 'char charAt(int index)', documentation: 'Returns the char value at the specified index', insertText: 'charAt(${1:index})' },
        { label: 'substring', kind: 'Method', detail: 'String substring(int beginIndex, int endIndex)', documentation: 'Returns a substring', insertText: 'substring(${1:beginIndex}, ${2:endIndex})' },
        { label: 'indexOf', kind: 'Method', detail: 'int indexOf(String str)', documentation: 'Returns the index of the first occurrence of the specified substring', insertText: 'indexOf(${1:str})' },
        { label: 'lastIndexOf', kind: 'Method', detail: 'int lastIndexOf(String str)', documentation: 'Returns the index of the last occurrence', insertText: 'lastIndexOf(${1:str})' },
        { label: 'contains', kind: 'Method', detail: 'boolean contains(CharSequence s)', documentation: 'Returns true if this string contains the specified sequence', insertText: 'contains(${1:s})' },
        { label: 'equals', kind: 'Method', detail: 'boolean equals(Object obj)', documentation: 'Compares this string to the specified object', insertText: 'equals(${1:obj})' },
        { label: 'equalsIgnoreCase', kind: 'Method', detail: 'boolean equalsIgnoreCase(String other)', documentation: 'Compares two strings ignoring case', insertText: 'equalsIgnoreCase(${1:other})' },
        { label: 'compareTo', kind: 'Method', detail: 'int compareTo(String other)', documentation: 'Compares two strings lexicographically', insertText: 'compareTo(${1:other})' },
        { label: 'startsWith', kind: 'Method', detail: 'boolean startsWith(String prefix)', documentation: 'Tests if this string starts with the specified prefix', insertText: 'startsWith(${1:prefix})' },
        { label: 'endsWith', kind: 'Method', detail: 'boolean endsWith(String suffix)', documentation: 'Tests if this string ends with the specified suffix', insertText: 'endsWith(${1:suffix})' },
        { label: 'isEmpty', kind: 'Method', detail: 'boolean isEmpty()', documentation: 'Returns true if length() is 0', insertText: 'isEmpty()' },
        { label: 'isBlank', kind: 'Method', detail: 'boolean isBlank()', documentation: 'Returns true if the string is empty or contains only whitespace', insertText: 'isBlank()' },
        { label: 'trim', kind: 'Method', detail: 'String trim()', documentation: 'Returns a string with leading and trailing whitespace removed', insertText: 'trim()' },
        { label: 'strip', kind: 'Method', detail: 'String strip()', documentation: 'Returns a string with leading and trailing whitespace removed (Unicode-aware)', insertText: 'strip()' },
        { label: 'toLowerCase', kind: 'Method', detail: 'String toLowerCase()', documentation: 'Converts all characters to lower case', insertText: 'toLowerCase()' },
        { label: 'toUpperCase', kind: 'Method', detail: 'String toUpperCase()', documentation: 'Converts all characters to upper case', insertText: 'toUpperCase()' },
        { label: 'replace', kind: 'Method', detail: 'String replace(CharSequence target, CharSequence replacement)', documentation: 'Replaces each occurrence of target with replacement', insertText: 'replace(${1:target}, ${2:replacement})' },
        { label: 'replaceAll', kind: 'Method', detail: 'String replaceAll(String regex, String replacement)', documentation: 'Replaces each match of the regex with replacement', insertText: 'replaceAll(${1:regex}, ${2:replacement})' },
        { label: 'replaceFirst', kind: 'Method', detail: 'String replaceFirst(String regex, String replacement)', documentation: 'Replaces the first match of the regex', insertText: 'replaceFirst(${1:regex}, ${2:replacement})' },
        { label: 'split', kind: 'Method', detail: 'String[] split(String regex)', documentation: 'Splits this string around matches of the given regex', insertText: 'split(${1:regex})' },
        { label: 'toCharArray', kind: 'Method', detail: 'char[] toCharArray()', documentation: 'Converts this string to a new character array', insertText: 'toCharArray()' },
        { label: 'matches', kind: 'Method', detail: 'boolean matches(String regex)', documentation: 'Tells whether this string matches the given regex', insertText: 'matches(${1:regex})' },
        { label: 'concat', kind: 'Method', detail: 'String concat(String str)', documentation: 'Concatenates the specified string to the end', insertText: 'concat(${1:str})' },
        { label: 'valueOf', kind: 'Method', detail: 'static String valueOf(Object obj)', documentation: 'Returns the string representation of the argument', insertText: 'valueOf(${1:obj})' },
        { label: 'format', kind: 'Method', detail: 'static String format(String format, Object... args)', documentation: 'Returns a formatted string', insertText: 'format(${1:format}, ${2:args})' },
        { label: 'join', kind: 'Method', detail: 'static String join(CharSequence delimiter, CharSequence... elements)', documentation: 'Returns a new String composed of elements joined with delimiter', insertText: 'join(${1:delimiter}, ${2:elements})' },
        { label: 'chars', kind: 'Method', detail: 'IntStream chars()', documentation: 'Returns a stream of int values from this string', insertText: 'chars()' },
        { label: 'codePointAt', kind: 'Method', detail: 'int codePointAt(int index)', documentation: 'Returns the Unicode code point at the given index', insertText: 'codePointAt(${1:index})' },
        { label: 'getBytes', kind: 'Method', detail: 'byte[] getBytes()', documentation: 'Encodes this string into a sequence of bytes', insertText: 'getBytes()' },
        { label: 'intern', kind: 'Method', detail: 'String intern()', documentation: 'Returns a canonical representation of the string', insertText: 'intern()' },
        { label: 'repeat', kind: 'Method', detail: 'String repeat(int count)', documentation: 'Returns a string whose value is this string repeated count times', insertText: 'repeat(${1:count})' },
        { label: 'hashCode', kind: 'Method', detail: 'int hashCode()', documentation: 'Returns a hash code for this string', insertText: 'hashCode()' },
        { label: 'toString', kind: 'Method', detail: 'String toString()', documentation: 'Returns the string itself', insertText: 'toString()' },
    ],

    // ── Object ──────────────────────────────────────────────────
    'Object': [
        { label: 'toString', kind: 'Method', detail: 'String toString()', documentation: 'Returns a string representation of the object', insertText: 'toString()' },
        { label: 'equals', kind: 'Method', detail: 'boolean equals(Object obj)', documentation: 'Indicates whether some other object is equal to this one', insertText: 'equals(${1:obj})' },
        { label: 'hashCode', kind: 'Method', detail: 'int hashCode()', documentation: 'Returns a hash code value for the object', insertText: 'hashCode()' },
        { label: 'getClass', kind: 'Method', detail: 'Class<?> getClass()', documentation: 'Returns the runtime class of this Object', insertText: 'getClass()' },
        { label: 'notify', kind: 'Method', detail: 'void notify()', documentation: 'Wakes up a single thread waiting on this object', insertText: 'notify()' },
        { label: 'notifyAll', kind: 'Method', detail: 'void notifyAll()', documentation: 'Wakes up all threads waiting on this object', insertText: 'notifyAll()' },
        { label: 'wait', kind: 'Method', detail: 'void wait()', documentation: 'Causes the current thread to wait', insertText: 'wait()' },
    ],

    // ── System ──────────────────────────────────────────────────
    'System': [
        { label: 'out', kind: 'Field', detail: 'static PrintStream out', documentation: 'The standard output stream', insertText: 'out' },
        { label: 'err', kind: 'Field', detail: 'static PrintStream err', documentation: 'The standard error output stream', insertText: 'err' },
        { label: 'in', kind: 'Field', detail: 'static InputStream in', documentation: 'The standard input stream', insertText: 'in' },
        { label: 'currentTimeMillis', kind: 'Method', detail: 'static long currentTimeMillis()', documentation: 'Returns the current time in milliseconds', insertText: 'currentTimeMillis()' },
        { label: 'nanoTime', kind: 'Method', detail: 'static long nanoTime()', documentation: 'Returns the current value of the high-resolution time source in nanoseconds', insertText: 'nanoTime()' },
        { label: 'exit', kind: 'Method', detail: 'static void exit(int status)', documentation: 'Terminates the currently running JVM', insertText: 'exit(${1:0})' },
        { label: 'gc', kind: 'Method', detail: 'static void gc()', documentation: 'Runs the garbage collector', insertText: 'gc()' },
        { label: 'getenv', kind: 'Method', detail: 'static String getenv(String name)', documentation: 'Gets the value of the specified environment variable', insertText: 'getenv(${1:name})' },
        { label: 'getProperty', kind: 'Method', detail: 'static String getProperty(String key)', documentation: 'Gets the system property indicated by the specified key', insertText: 'getProperty(${1:key})' },
        { label: 'lineSeparator', kind: 'Method', detail: 'static String lineSeparator()', documentation: 'Returns the system-dependent line separator string', insertText: 'lineSeparator()' },
        { label: 'arraycopy', kind: 'Method', detail: 'static void arraycopy(Object src, int srcPos, Object dest, int destPos, int length)', documentation: 'Copies an array from the specified source array', insertText: 'arraycopy(${1:src}, ${2:srcPos}, ${3:dest}, ${4:destPos}, ${5:length})' },
    ],

    // ── PrintStream (System.out / System.err) ───────────────────
    'PrintStream': [
        { label: 'println', kind: 'Method', detail: 'void println(Object x)', documentation: 'Prints an Object and then terminates the line', insertText: 'println(${1})' },
        { label: 'print', kind: 'Method', detail: 'void print(Object obj)', documentation: 'Prints an Object', insertText: 'print(${1})' },
        { label: 'printf', kind: 'Method', detail: 'PrintStream printf(String format, Object... args)', documentation: 'Writes a formatted string using the specified format and arguments', insertText: 'printf(${1:format}, ${2:args})' },
        { label: 'format', kind: 'Method', detail: 'PrintStream format(String format, Object... args)', documentation: 'Writes a formatted string', insertText: 'format(${1:format}, ${2:args})' },
        { label: 'flush', kind: 'Method', detail: 'void flush()', documentation: 'Flushes the stream', insertText: 'flush()' },
        { label: 'close', kind: 'Method', detail: 'void close()', documentation: 'Closes the stream', insertText: 'close()' },
        { label: 'write', kind: 'Method', detail: 'void write(int b)', documentation: 'Writes the specified byte to this stream', insertText: 'write(${1:b})' },
    ],

    // ── Math ────────────────────────────────────────────────────
    'Math': [
        { label: 'abs', kind: 'Method', detail: 'static int abs(int a)', documentation: 'Returns the absolute value', insertText: 'abs(${1:a})' },
        { label: 'max', kind: 'Method', detail: 'static int max(int a, int b)', documentation: 'Returns the greater of two values', insertText: 'max(${1:a}, ${2:b})' },
        { label: 'min', kind: 'Method', detail: 'static int min(int a, int b)', documentation: 'Returns the smaller of two values', insertText: 'min(${1:a}, ${2:b})' },
        { label: 'pow', kind: 'Method', detail: 'static double pow(double a, double b)', documentation: 'Returns a raised to the power of b', insertText: 'pow(${1:a}, ${2:b})' },
        { label: 'sqrt', kind: 'Method', detail: 'static double sqrt(double a)', documentation: 'Returns the positive square root', insertText: 'sqrt(${1:a})' },
        { label: 'cbrt', kind: 'Method', detail: 'static double cbrt(double a)', documentation: 'Returns the cube root', insertText: 'cbrt(${1:a})' },
        { label: 'ceil', kind: 'Method', detail: 'static double ceil(double a)', documentation: 'Returns the smallest double >= argument that is an integer', insertText: 'ceil(${1:a})' },
        { label: 'floor', kind: 'Method', detail: 'static double floor(double a)', documentation: 'Returns the largest double <= argument that is an integer', insertText: 'floor(${1:a})' },
        { label: 'round', kind: 'Method', detail: 'static long round(double a)', documentation: 'Returns the closest long', insertText: 'round(${1:a})' },
        { label: 'random', kind: 'Method', detail: 'static double random()', documentation: 'Returns a random double value between 0.0 and 1.0', insertText: 'random()' },
        { label: 'log', kind: 'Method', detail: 'static double log(double a)', documentation: 'Returns the natural logarithm (base e)', insertText: 'log(${1:a})' },
        { label: 'log10', kind: 'Method', detail: 'static double log10(double a)', documentation: 'Returns the base 10 logarithm', insertText: 'log10(${1:a})' },
        { label: 'sin', kind: 'Method', detail: 'static double sin(double a)', documentation: 'Returns the trigonometric sine', insertText: 'sin(${1:a})' },
        { label: 'cos', kind: 'Method', detail: 'static double cos(double a)', documentation: 'Returns the trigonometric cosine', insertText: 'cos(${1:a})' },
        { label: 'tan', kind: 'Method', detail: 'static double tan(double a)', documentation: 'Returns the trigonometric tangent', insertText: 'tan(${1:a})' },
        { label: 'toRadians', kind: 'Method', detail: 'static double toRadians(double angdeg)', documentation: 'Converts an angle from degrees to radians', insertText: 'toRadians(${1:angdeg})' },
        { label: 'toDegrees', kind: 'Method', detail: 'static double toDegrees(double angrad)', documentation: 'Converts an angle from radians to degrees', insertText: 'toDegrees(${1:angrad})' },
        { label: 'PI', kind: 'Constant', detail: 'static final double PI', documentation: 'The double value closest to pi (3.14159...)', insertText: 'PI' },
        { label: 'E', kind: 'Constant', detail: 'static final double E', documentation: 'The double value closest to e (2.71828...)', insertText: 'E' },
        { label: 'signum', kind: 'Method', detail: 'static double signum(double d)', documentation: 'Returns the signum function of the argument', insertText: 'signum(${1:d})' },
        { label: 'exp', kind: 'Method', detail: 'static double exp(double a)', documentation: 'Returns Euler\'s number e raised to the power of a', insertText: 'exp(${1:a})' },
        { label: 'hypot', kind: 'Method', detail: 'static double hypot(double x, double y)', documentation: 'Returns sqrt(x² + y²) without intermediate overflow', insertText: 'hypot(${1:x}, ${2:y})' },
        { label: 'addExact', kind: 'Method', detail: 'static int addExact(int x, int y)', documentation: 'Returns the sum, throwing ArithmeticException on overflow', insertText: 'addExact(${1:x}, ${2:y})' },
        { label: 'floorDiv', kind: 'Method', detail: 'static int floorDiv(int x, int y)', documentation: 'Returns the largest int <= the algebraic quotient', insertText: 'floorDiv(${1:x}, ${2:y})' },
        { label: 'floorMod', kind: 'Method', detail: 'static int floorMod(int x, int y)', documentation: 'Returns the floor modulus of the int arguments', insertText: 'floorMod(${1:x}, ${2:y})' },
    ],

    // ── Integer ─────────────────────────────────────────────────
    'Integer': [
        { label: 'parseInt', kind: 'Method', detail: 'static int parseInt(String s)', documentation: 'Parses the string as a signed decimal integer', insertText: 'parseInt(${1:s})' },
        { label: 'valueOf', kind: 'Method', detail: 'static Integer valueOf(int i)', documentation: 'Returns an Integer instance representing the specified int', insertText: 'valueOf(${1:i})' },
        { label: 'toString', kind: 'Method', detail: 'String toString()', documentation: 'Returns a string representation', insertText: 'toString()' },
        { label: 'intValue', kind: 'Method', detail: 'int intValue()', documentation: 'Returns the value as an int', insertText: 'intValue()' },
        { label: 'compareTo', kind: 'Method', detail: 'int compareTo(Integer other)', documentation: 'Compares two Integer objects numerically', insertText: 'compareTo(${1:other})' },
        { label: 'equals', kind: 'Method', detail: 'boolean equals(Object obj)', documentation: 'Compares this object to the specified object', insertText: 'equals(${1:obj})' },
        { label: 'MAX_VALUE', kind: 'Constant', detail: 'static final int MAX_VALUE', documentation: '2147483647', insertText: 'MAX_VALUE' },
        { label: 'MIN_VALUE', kind: 'Constant', detail: 'static final int MIN_VALUE', documentation: '-2147483648', insertText: 'MIN_VALUE' },
        { label: 'toBinaryString', kind: 'Method', detail: 'static String toBinaryString(int i)', documentation: 'Returns a string representation in base 2', insertText: 'toBinaryString(${1:i})' },
        { label: 'toHexString', kind: 'Method', detail: 'static String toHexString(int i)', documentation: 'Returns a string representation in base 16', insertText: 'toHexString(${1:i})' },
        { label: 'toOctalString', kind: 'Method', detail: 'static String toOctalString(int i)', documentation: 'Returns a string representation in base 8', insertText: 'toOctalString(${1:i})' },
        { label: 'sum', kind: 'Method', detail: 'static int sum(int a, int b)', documentation: 'Adds two integers together', insertText: 'sum(${1:a}, ${2:b})' },
        { label: 'max', kind: 'Method', detail: 'static int max(int a, int b)', documentation: 'Returns the greater of two int values', insertText: 'max(${1:a}, ${2:b})' },
        { label: 'min', kind: 'Method', detail: 'static int min(int a, int b)', documentation: 'Returns the smaller of two int values', insertText: 'min(${1:a}, ${2:b})' },
        { label: 'hashCode', kind: 'Method', detail: 'int hashCode()', documentation: 'Returns a hash code', insertText: 'hashCode()' },
    ],

    // ── Double ──────────────────────────────────────────────────
    'Double': [
        { label: 'parseDouble', kind: 'Method', detail: 'static double parseDouble(String s)', documentation: 'Returns a new double initialized to the value represented by the string', insertText: 'parseDouble(${1:s})' },
        { label: 'valueOf', kind: 'Method', detail: 'static Double valueOf(double d)', documentation: 'Returns a Double instance', insertText: 'valueOf(${1:d})' },
        { label: 'doubleValue', kind: 'Method', detail: 'double doubleValue()', documentation: 'Returns the double value', insertText: 'doubleValue()' },
        { label: 'intValue', kind: 'Method', detail: 'int intValue()', documentation: 'Returns the value as an int', insertText: 'intValue()' },
        { label: 'isNaN', kind: 'Method', detail: 'boolean isNaN()', documentation: 'Returns true if this Double value is Not-a-Number', insertText: 'isNaN()' },
        { label: 'isInfinite', kind: 'Method', detail: 'boolean isInfinite()', documentation: 'Returns true if this Double value is infinitely large', insertText: 'isInfinite()' },
        { label: 'compareTo', kind: 'Method', detail: 'int compareTo(Double other)', documentation: 'Compares two Double objects numerically', insertText: 'compareTo(${1:other})' },
        { label: 'toString', kind: 'Method', detail: 'String toString()', documentation: 'Returns a string representation', insertText: 'toString()' },
        { label: 'MAX_VALUE', kind: 'Constant', detail: 'static final double MAX_VALUE', documentation: '1.7976931348623157E308', insertText: 'MAX_VALUE' },
        { label: 'MIN_VALUE', kind: 'Constant', detail: 'static final double MIN_VALUE', documentation: '4.9E-324', insertText: 'MIN_VALUE' },
        { label: 'NaN', kind: 'Constant', detail: 'static final double NaN', documentation: 'A constant holding a Not-a-Number value', insertText: 'NaN' },
        { label: 'POSITIVE_INFINITY', kind: 'Constant', detail: 'static final double POSITIVE_INFINITY', documentation: 'A constant holding the positive infinity', insertText: 'POSITIVE_INFINITY' },
        { label: 'NEGATIVE_INFINITY', kind: 'Constant', detail: 'static final double NEGATIVE_INFINITY', documentation: 'A constant holding the negative infinity', insertText: 'NEGATIVE_INFINITY' },
    ],

    // ── Long ────────────────────────────────────────────────────
    'Long': [
        { label: 'parseLong', kind: 'Method', detail: 'static long parseLong(String s)', documentation: 'Parses the string as a signed decimal long', insertText: 'parseLong(${1:s})' },
        { label: 'valueOf', kind: 'Method', detail: 'static Long valueOf(long l)', documentation: 'Returns a Long instance', insertText: 'valueOf(${1:l})' },
        { label: 'longValue', kind: 'Method', detail: 'long longValue()', documentation: 'Returns the value as a long', insertText: 'longValue()' },
        { label: 'compareTo', kind: 'Method', detail: 'int compareTo(Long other)', documentation: 'Compares two Long objects numerically', insertText: 'compareTo(${1:other})' },
        { label: 'toString', kind: 'Method', detail: 'String toString()', documentation: 'Returns a string representation', insertText: 'toString()' },
        { label: 'MAX_VALUE', kind: 'Constant', detail: 'static final long MAX_VALUE', documentation: '9223372036854775807', insertText: 'MAX_VALUE' },
        { label: 'MIN_VALUE', kind: 'Constant', detail: 'static final long MIN_VALUE', documentation: '-9223372036854775808', insertText: 'MIN_VALUE' },
        { label: 'toBinaryString', kind: 'Method', detail: 'static String toBinaryString(long i)', documentation: 'Returns binary string representation', insertText: 'toBinaryString(${1:i})' },
        { label: 'toHexString', kind: 'Method', detail: 'static String toHexString(long i)', documentation: 'Returns hex string representation', insertText: 'toHexString(${1:i})' },
        { label: 'sum', kind: 'Method', detail: 'static long sum(long a, long b)', documentation: 'Adds two longs together', insertText: 'sum(${1:a}, ${2:b})' },
    ],

    // ── Float ───────────────────────────────────────────────────
    'Float': [
        { label: 'parseFloat', kind: 'Method', detail: 'static float parseFloat(String s)', documentation: 'Returns a new float from the string', insertText: 'parseFloat(${1:s})' },
        { label: 'valueOf', kind: 'Method', detail: 'static Float valueOf(float f)', documentation: 'Returns a Float instance', insertText: 'valueOf(${1:f})' },
        { label: 'floatValue', kind: 'Method', detail: 'float floatValue()', documentation: 'Returns the float value', insertText: 'floatValue()' },
        { label: 'isNaN', kind: 'Method', detail: 'boolean isNaN()', documentation: 'Returns true if this Float value is NaN', insertText: 'isNaN()' },
        { label: 'compareTo', kind: 'Method', detail: 'int compareTo(Float other)', documentation: 'Compares two Float objects', insertText: 'compareTo(${1:other})' },
        { label: 'toString', kind: 'Method', detail: 'String toString()', documentation: 'Returns a string representation', insertText: 'toString()' },
    ],

    // ── Boolean ─────────────────────────────────────────────────
    'Boolean': [
        { label: 'parseBoolean', kind: 'Method', detail: 'static boolean parseBoolean(String s)', documentation: 'Parses the string as a boolean', insertText: 'parseBoolean(${1:s})' },
        { label: 'valueOf', kind: 'Method', detail: 'static Boolean valueOf(boolean b)', documentation: 'Returns a Boolean instance', insertText: 'valueOf(${1:b})' },
        { label: 'booleanValue', kind: 'Method', detail: 'boolean booleanValue()', documentation: 'Returns the value as a boolean', insertText: 'booleanValue()' },
        { label: 'compareTo', kind: 'Method', detail: 'int compareTo(Boolean b)', documentation: 'Compares two Boolean objects', insertText: 'compareTo(${1:b})' },
        { label: 'toString', kind: 'Method', detail: 'String toString()', documentation: 'Returns a string representation', insertText: 'toString()' },
        { label: 'TRUE', kind: 'Constant', detail: 'static final Boolean TRUE', documentation: 'The Boolean object corresponding to true', insertText: 'TRUE' },
        { label: 'FALSE', kind: 'Constant', detail: 'static final Boolean FALSE', documentation: 'The Boolean object corresponding to false', insertText: 'FALSE' },
    ],

    // ── Character ───────────────────────────────────────────────
    'Character': [
        { label: 'isDigit', kind: 'Method', detail: 'static boolean isDigit(char ch)', documentation: 'Determines if the specified character is a digit', insertText: 'isDigit(${1:ch})' },
        { label: 'isLetter', kind: 'Method', detail: 'static boolean isLetter(char ch)', documentation: 'Determines if the specified character is a letter', insertText: 'isLetter(${1:ch})' },
        { label: 'isLetterOrDigit', kind: 'Method', detail: 'static boolean isLetterOrDigit(char ch)', documentation: 'Determines if the specified character is a letter or digit', insertText: 'isLetterOrDigit(${1:ch})' },
        { label: 'isUpperCase', kind: 'Method', detail: 'static boolean isUpperCase(char ch)', documentation: 'Determines if the character is uppercase', insertText: 'isUpperCase(${1:ch})' },
        { label: 'isLowerCase', kind: 'Method', detail: 'static boolean isLowerCase(char ch)', documentation: 'Determines if the character is lowercase', insertText: 'isLowerCase(${1:ch})' },
        { label: 'isWhitespace', kind: 'Method', detail: 'static boolean isWhitespace(char ch)', documentation: 'Determines if the character is whitespace', insertText: 'isWhitespace(${1:ch})' },
        { label: 'toUpperCase', kind: 'Method', detail: 'static char toUpperCase(char ch)', documentation: 'Converts to uppercase', insertText: 'toUpperCase(${1:ch})' },
        { label: 'toLowerCase', kind: 'Method', detail: 'static char toLowerCase(char ch)', documentation: 'Converts to lowercase', insertText: 'toLowerCase(${1:ch})' },
        { label: 'valueOf', kind: 'Method', detail: 'static Character valueOf(char c)', documentation: 'Returns a Character instance', insertText: 'valueOf(${1:c})' },
        { label: 'toString', kind: 'Method', detail: 'String toString()', documentation: 'Returns a string representation', insertText: 'toString()' },
    ],

    // ── List / ArrayList ────────────────────────────────────────
    'List': [
        { label: 'add', kind: 'Method', detail: 'boolean add(E e)', documentation: 'Appends the specified element to the end of this list', insertText: 'add(${1:element})' },
        { label: 'add', kind: 'Method', detail: 'void add(int index, E element)', documentation: 'Inserts the element at the specified position', insertText: 'add(${1:index}, ${2:element})' },
        { label: 'get', kind: 'Method', detail: 'E get(int index)', documentation: 'Returns the element at the specified position', insertText: 'get(${1:index})' },
        { label: 'set', kind: 'Method', detail: 'E set(int index, E element)', documentation: 'Replaces the element at the specified position', insertText: 'set(${1:index}, ${2:element})' },
        { label: 'remove', kind: 'Method', detail: 'E remove(int index)', documentation: 'Removes the element at the specified position', insertText: 'remove(${1:index})' },
        { label: 'size', kind: 'Method', detail: 'int size()', documentation: 'Returns the number of elements in this list', insertText: 'size()' },
        { label: 'isEmpty', kind: 'Method', detail: 'boolean isEmpty()', documentation: 'Returns true if this list contains no elements', insertText: 'isEmpty()' },
        { label: 'contains', kind: 'Method', detail: 'boolean contains(Object o)', documentation: 'Returns true if this list contains the specified element', insertText: 'contains(${1:o})' },
        { label: 'indexOf', kind: 'Method', detail: 'int indexOf(Object o)', documentation: 'Returns the index of the first occurrence', insertText: 'indexOf(${1:o})' },
        { label: 'lastIndexOf', kind: 'Method', detail: 'int lastIndexOf(Object o)', documentation: 'Returns the index of the last occurrence', insertText: 'lastIndexOf(${1:o})' },
        { label: 'clear', kind: 'Method', detail: 'void clear()', documentation: 'Removes all of the elements from this list', insertText: 'clear()' },
        { label: 'addAll', kind: 'Method', detail: 'boolean addAll(Collection<? extends E> c)', documentation: 'Appends all elements in the specified collection', insertText: 'addAll(${1:collection})' },
        { label: 'subList', kind: 'Method', detail: 'List<E> subList(int fromIndex, int toIndex)', documentation: 'Returns a view of the portion of this list', insertText: 'subList(${1:fromIndex}, ${2:toIndex})' },
        { label: 'toArray', kind: 'Method', detail: 'Object[] toArray()', documentation: 'Returns an array containing all elements', insertText: 'toArray()' },
        { label: 'iterator', kind: 'Method', detail: 'Iterator<E> iterator()', documentation: 'Returns an iterator over the elements', insertText: 'iterator()' },
        { label: 'stream', kind: 'Method', detail: 'Stream<E> stream()', documentation: 'Returns a sequential Stream with this collection as its source', insertText: 'stream()' },
        { label: 'forEach', kind: 'Method', detail: 'void forEach(Consumer<? super E> action)', documentation: 'Performs the given action for each element', insertText: 'forEach(${1:element} -> ${2})' },
        { label: 'sort', kind: 'Method', detail: 'void sort(Comparator<? super E> c)', documentation: 'Sorts this list according to the order induced by the specified Comparator', insertText: 'sort(${1:comparator})' },
        { label: 'containsAll', kind: 'Method', detail: 'boolean containsAll(Collection<?> c)', documentation: 'Returns true if this list contains all elements of the specified collection', insertText: 'containsAll(${1:collection})' },
        { label: 'removeAll', kind: 'Method', detail: 'boolean removeAll(Collection<?> c)', documentation: 'Removes all elements that are contained in the specified collection', insertText: 'removeAll(${1:collection})' },
        { label: 'retainAll', kind: 'Method', detail: 'boolean retainAll(Collection<?> c)', documentation: 'Retains only the elements that are contained in the specified collection', insertText: 'retainAll(${1:collection})' },
        { label: 'of', kind: 'Method', detail: 'static <E> List<E> of(E... elements)', documentation: 'Returns an unmodifiable list containing the specified elements', insertText: 'of(${1:elements})' },
        { label: 'toString', kind: 'Method', detail: 'String toString()', documentation: 'Returns a string representation', insertText: 'toString()' },
        { label: 'equals', kind: 'Method', detail: 'boolean equals(Object o)', documentation: 'Compares the specified object with this list for equality', insertText: 'equals(${1:o})' },
        { label: 'hashCode', kind: 'Method', detail: 'int hashCode()', documentation: 'Returns the hash code value for this list', insertText: 'hashCode()' },
    ],

    // ── Map / HashMap ───────────────────────────────────────────
    'Map': [
        { label: 'put', kind: 'Method', detail: 'V put(K key, V value)', documentation: 'Associates the specified value with the specified key', insertText: 'put(${1:key}, ${2:value})' },
        { label: 'get', kind: 'Method', detail: 'V get(Object key)', documentation: 'Returns the value to which the specified key is mapped', insertText: 'get(${1:key})' },
        { label: 'getOrDefault', kind: 'Method', detail: 'V getOrDefault(Object key, V defaultValue)', documentation: 'Returns the value mapped to the key, or defaultValue', insertText: 'getOrDefault(${1:key}, ${2:defaultValue})' },
        { label: 'remove', kind: 'Method', detail: 'V remove(Object key)', documentation: 'Removes the mapping for the specified key', insertText: 'remove(${1:key})' },
        { label: 'containsKey', kind: 'Method', detail: 'boolean containsKey(Object key)', documentation: 'Returns true if this map contains a mapping for the specified key', insertText: 'containsKey(${1:key})' },
        { label: 'containsValue', kind: 'Method', detail: 'boolean containsValue(Object value)', documentation: 'Returns true if this map maps one or more keys to the specified value', insertText: 'containsValue(${1:value})' },
        { label: 'size', kind: 'Method', detail: 'int size()', documentation: 'Returns the number of key-value mappings', insertText: 'size()' },
        { label: 'isEmpty', kind: 'Method', detail: 'boolean isEmpty()', documentation: 'Returns true if this map contains no key-value mappings', insertText: 'isEmpty()' },
        { label: 'clear', kind: 'Method', detail: 'void clear()', documentation: 'Removes all mappings from this map', insertText: 'clear()' },
        { label: 'keySet', kind: 'Method', detail: 'Set<K> keySet()', documentation: 'Returns a Set view of the keys contained in this map', insertText: 'keySet()' },
        { label: 'values', kind: 'Method', detail: 'Collection<V> values()', documentation: 'Returns a Collection view of the values', insertText: 'values()' },
        { label: 'entrySet', kind: 'Method', detail: 'Set<Map.Entry<K,V>> entrySet()', documentation: 'Returns a Set view of the mappings', insertText: 'entrySet()' },
        { label: 'putAll', kind: 'Method', detail: 'void putAll(Map<? extends K, ? extends V> m)', documentation: 'Copies all mappings from the specified map', insertText: 'putAll(${1:map})' },
        { label: 'putIfAbsent', kind: 'Method', detail: 'V putIfAbsent(K key, V value)', documentation: 'Associates the value with the key if not already associated', insertText: 'putIfAbsent(${1:key}, ${2:value})' },
        { label: 'replace', kind: 'Method', detail: 'V replace(K key, V value)', documentation: 'Replaces the entry for the specified key only if currently mapped', insertText: 'replace(${1:key}, ${2:value})' },
        { label: 'forEach', kind: 'Method', detail: 'void forEach(BiConsumer<? super K, ? super V> action)', documentation: 'Performs the given action for each entry', insertText: 'forEach((${1:key}, ${2:value}) -> ${3})' },
        { label: 'merge', kind: 'Method', detail: 'V merge(K key, V value, BiFunction remappingFunction)', documentation: 'If key not present, associates with value. If present, applies function.', insertText: 'merge(${1:key}, ${2:value}, (${3:oldVal}, ${4:newVal}) -> ${5})' },
        { label: 'computeIfAbsent', kind: 'Method', detail: 'V computeIfAbsent(K key, Function mappingFunction)', documentation: 'If absent, attempts to compute the value using the given function', insertText: 'computeIfAbsent(${1:key}, ${2:k} -> ${3})' },
        { label: 'of', kind: 'Method', detail: 'static <K,V> Map<K,V> of(K k1, V v1, ...)', documentation: 'Returns an unmodifiable map containing the specified entries', insertText: 'of(${1:key}, ${2:value})' },
        { label: 'toString', kind: 'Method', detail: 'String toString()', documentation: 'Returns a string representation', insertText: 'toString()' },
    ],

    // ── Set / HashSet ───────────────────────────────────────────
    'Set': [
        { label: 'add', kind: 'Method', detail: 'boolean add(E e)', documentation: 'Adds the specified element to this set', insertText: 'add(${1:element})' },
        { label: 'remove', kind: 'Method', detail: 'boolean remove(Object o)', documentation: 'Removes the specified element', insertText: 'remove(${1:element})' },
        { label: 'contains', kind: 'Method', detail: 'boolean contains(Object o)', documentation: 'Returns true if this set contains the specified element', insertText: 'contains(${1:element})' },
        { label: 'size', kind: 'Method', detail: 'int size()', documentation: 'Returns the number of elements', insertText: 'size()' },
        { label: 'isEmpty', kind: 'Method', detail: 'boolean isEmpty()', documentation: 'Returns true if this set contains no elements', insertText: 'isEmpty()' },
        { label: 'clear', kind: 'Method', detail: 'void clear()', documentation: 'Removes all elements from this set', insertText: 'clear()' },
        { label: 'addAll', kind: 'Method', detail: 'boolean addAll(Collection<? extends E> c)', documentation: 'Adds all elements in the specified collection', insertText: 'addAll(${1:collection})' },
        { label: 'removeAll', kind: 'Method', detail: 'boolean removeAll(Collection<?> c)', documentation: 'Removes all elements that are also in the specified collection', insertText: 'removeAll(${1:collection})' },
        { label: 'retainAll', kind: 'Method', detail: 'boolean retainAll(Collection<?> c)', documentation: 'Retains only the elements contained in the specified collection', insertText: 'retainAll(${1:collection})' },
        { label: 'containsAll', kind: 'Method', detail: 'boolean containsAll(Collection<?> c)', documentation: 'Returns true if this set contains all elements of the specified collection', insertText: 'containsAll(${1:collection})' },
        { label: 'iterator', kind: 'Method', detail: 'Iterator<E> iterator()', documentation: 'Returns an iterator over the elements', insertText: 'iterator()' },
        { label: 'toArray', kind: 'Method', detail: 'Object[] toArray()', documentation: 'Returns an array containing all elements', insertText: 'toArray()' },
        { label: 'stream', kind: 'Method', detail: 'Stream<E> stream()', documentation: 'Returns a sequential Stream', insertText: 'stream()' },
        { label: 'forEach', kind: 'Method', detail: 'void forEach(Consumer<? super E> action)', documentation: 'Performs the given action for each element', insertText: 'forEach(${1:element} -> ${2})' },
        { label: 'of', kind: 'Method', detail: 'static <E> Set<E> of(E... elements)', documentation: 'Returns an unmodifiable set', insertText: 'of(${1:elements})' },
        { label: 'toString', kind: 'Method', detail: 'String toString()', documentation: 'Returns a string representation', insertText: 'toString()' },
    ],

    // ── Scanner ─────────────────────────────────────────────────
    'Scanner': [
        { label: 'nextLine', kind: 'Method', detail: 'String nextLine()', documentation: 'Advances past the current line and returns the input', insertText: 'nextLine()' },
        { label: 'next', kind: 'Method', detail: 'String next()', documentation: 'Finds and returns the next complete token', insertText: 'next()' },
        { label: 'nextInt', kind: 'Method', detail: 'int nextInt()', documentation: 'Scans the next token as an int', insertText: 'nextInt()' },
        { label: 'nextDouble', kind: 'Method', detail: 'double nextDouble()', documentation: 'Scans the next token as a double', insertText: 'nextDouble()' },
        { label: 'nextFloat', kind: 'Method', detail: 'float nextFloat()', documentation: 'Scans the next token as a float', insertText: 'nextFloat()' },
        { label: 'nextLong', kind: 'Method', detail: 'long nextLong()', documentation: 'Scans the next token as a long', insertText: 'nextLong()' },
        { label: 'nextBoolean', kind: 'Method', detail: 'boolean nextBoolean()', documentation: 'Scans the next token as a boolean', insertText: 'nextBoolean()' },
        { label: 'nextByte', kind: 'Method', detail: 'byte nextByte()', documentation: 'Scans the next token as a byte', insertText: 'nextByte()' },
        { label: 'nextShort', kind: 'Method', detail: 'short nextShort()', documentation: 'Scans the next token as a short', insertText: 'nextShort()' },
        { label: 'hasNext', kind: 'Method', detail: 'boolean hasNext()', documentation: 'Returns true if there is another token', insertText: 'hasNext()' },
        { label: 'hasNextLine', kind: 'Method', detail: 'boolean hasNextLine()', documentation: 'Returns true if there is another line', insertText: 'hasNextLine()' },
        { label: 'hasNextInt', kind: 'Method', detail: 'boolean hasNextInt()', documentation: 'Returns true if the next token can be interpreted as an int', insertText: 'hasNextInt()' },
        { label: 'hasNextDouble', kind: 'Method', detail: 'boolean hasNextDouble()', documentation: 'Returns true if the next token can be interpreted as a double', insertText: 'hasNextDouble()' },
        { label: 'useDelimiter', kind: 'Method', detail: 'Scanner useDelimiter(String pattern)', documentation: 'Sets this scanner\'s delimiting pattern', insertText: 'useDelimiter(${1:pattern})' },
        { label: 'close', kind: 'Method', detail: 'void close()', documentation: 'Closes this scanner', insertText: 'close()' },
    ],

    // ── StringBuilder ───────────────────────────────────────────
    'StringBuilder': [
        { label: 'append', kind: 'Method', detail: 'StringBuilder append(Object obj)', documentation: 'Appends the string representation of the argument', insertText: 'append(${1:obj})' },
        { label: 'insert', kind: 'Method', detail: 'StringBuilder insert(int offset, Object obj)', documentation: 'Inserts the string representation at the specified position', insertText: 'insert(${1:offset}, ${2:obj})' },
        { label: 'delete', kind: 'Method', detail: 'StringBuilder delete(int start, int end)', documentation: 'Removes the characters in a substring', insertText: 'delete(${1:start}, ${2:end})' },
        { label: 'deleteCharAt', kind: 'Method', detail: 'StringBuilder deleteCharAt(int index)', documentation: 'Removes the char at the specified position', insertText: 'deleteCharAt(${1:index})' },
        { label: 'replace', kind: 'Method', detail: 'StringBuilder replace(int start, int end, String str)', documentation: 'Replaces the characters in a substring', insertText: 'replace(${1:start}, ${2:end}, ${3:str})' },
        { label: 'reverse', kind: 'Method', detail: 'StringBuilder reverse()', documentation: 'Reverses the sequence of characters', insertText: 'reverse()' },
        { label: 'toString', kind: 'Method', detail: 'String toString()', documentation: 'Returns a string representation', insertText: 'toString()' },
        { label: 'length', kind: 'Method', detail: 'int length()', documentation: 'Returns the length (character count)', insertText: 'length()' },
        { label: 'charAt', kind: 'Method', detail: 'char charAt(int index)', documentation: 'Returns the char value at the specified index', insertText: 'charAt(${1:index})' },
        { label: 'indexOf', kind: 'Method', detail: 'int indexOf(String str)', documentation: 'Returns the index of the first occurrence', insertText: 'indexOf(${1:str})' },
        { label: 'substring', kind: 'Method', detail: 'String substring(int start, int end)', documentation: 'Returns a substring', insertText: 'substring(${1:start}, ${2:end})' },
        { label: 'capacity', kind: 'Method', detail: 'int capacity()', documentation: 'Returns the current capacity', insertText: 'capacity()' },
        { label: 'setCharAt', kind: 'Method', detail: 'void setCharAt(int index, char ch)', documentation: 'Sets the character at the specified index', insertText: 'setCharAt(${1:index}, ${2:ch})' },
    ],

    // ── File ────────────────────────────────────────────────────
    'File': [
        { label: 'exists', kind: 'Method', detail: 'boolean exists()', documentation: 'Tests whether the file or directory exists', insertText: 'exists()' },
        { label: 'getName', kind: 'Method', detail: 'String getName()', documentation: 'Returns the name of the file or directory', insertText: 'getName()' },
        { label: 'getPath', kind: 'Method', detail: 'String getPath()', documentation: 'Converts the pathname to a string', insertText: 'getPath()' },
        { label: 'getAbsolutePath', kind: 'Method', detail: 'String getAbsolutePath()', documentation: 'Returns the absolute pathname string', insertText: 'getAbsolutePath()' },
        { label: 'getParent', kind: 'Method', detail: 'String getParent()', documentation: 'Returns the parent pathname string', insertText: 'getParent()' },
        { label: 'isFile', kind: 'Method', detail: 'boolean isFile()', documentation: 'Tests whether it is a normal file', insertText: 'isFile()' },
        { label: 'isDirectory', kind: 'Method', detail: 'boolean isDirectory()', documentation: 'Tests whether it is a directory', insertText: 'isDirectory()' },
        { label: 'length', kind: 'Method', detail: 'long length()', documentation: 'Returns the length of the file in bytes', insertText: 'length()' },
        { label: 'delete', kind: 'Method', detail: 'boolean delete()', documentation: 'Deletes the file or directory', insertText: 'delete()' },
        { label: 'mkdir', kind: 'Method', detail: 'boolean mkdir()', documentation: 'Creates the directory', insertText: 'mkdir()' },
        { label: 'mkdirs', kind: 'Method', detail: 'boolean mkdirs()', documentation: 'Creates the directory including necessary parent directories', insertText: 'mkdirs()' },
        { label: 'listFiles', kind: 'Method', detail: 'File[] listFiles()', documentation: 'Returns an array of files in the directory', insertText: 'listFiles()' },
        { label: 'list', kind: 'Method', detail: 'String[] list()', documentation: 'Returns an array of names of files in the directory', insertText: 'list()' },
        { label: 'canRead', kind: 'Method', detail: 'boolean canRead()', documentation: 'Tests whether the application can read the file', insertText: 'canRead()' },
        { label: 'canWrite', kind: 'Method', detail: 'boolean canWrite()', documentation: 'Tests whether the application can modify the file', insertText: 'canWrite()' },
        { label: 'renameTo', kind: 'Method', detail: 'boolean renameTo(File dest)', documentation: 'Renames the file', insertText: 'renameTo(${1:dest})' },
        { label: 'createNewFile', kind: 'Method', detail: 'boolean createNewFile()', documentation: 'Atomically creates a new, empty file', insertText: 'createNewFile()' },
        { label: 'lastModified', kind: 'Method', detail: 'long lastModified()', documentation: 'Returns the time the file was last modified', insertText: 'lastModified()' },
        { label: 'toString', kind: 'Method', detail: 'String toString()', documentation: 'Returns the pathname string', insertText: 'toString()' },
    ],

    // ── Arrays ──────────────────────────────────────────────────
    'Arrays': [
        { label: 'sort', kind: 'Method', detail: 'static void sort(int[] a)', documentation: 'Sorts the specified array into ascending numerical order', insertText: 'sort(${1:array})' },
        { label: 'binarySearch', kind: 'Method', detail: 'static int binarySearch(int[] a, int key)', documentation: 'Searches for the specified value using binary search', insertText: 'binarySearch(${1:array}, ${2:key})' },
        { label: 'fill', kind: 'Method', detail: 'static void fill(int[] a, int val)', documentation: 'Assigns the specified value to each element', insertText: 'fill(${1:array}, ${2:value})' },
        { label: 'copyOf', kind: 'Method', detail: 'static int[] copyOf(int[] original, int newLength)', documentation: 'Copies the specified array, truncating or padding with zeros', insertText: 'copyOf(${1:original}, ${2:newLength})' },
        { label: 'copyOfRange', kind: 'Method', detail: 'static int[] copyOfRange(int[] original, int from, int to)', documentation: 'Copies the specified range of the array', insertText: 'copyOfRange(${1:original}, ${2:from}, ${3:to})' },
        { label: 'equals', kind: 'Method', detail: 'static boolean equals(int[] a, int[] a2)', documentation: 'Returns true if the two arrays are equal', insertText: 'equals(${1:array1}, ${2:array2})' },
        { label: 'deepEquals', kind: 'Method', detail: 'static boolean deepEquals(Object[] a1, Object[] a2)', documentation: 'Returns true if the two arrays are deeply equal', insertText: 'deepEquals(${1:array1}, ${2:array2})' },
        { label: 'toString', kind: 'Method', detail: 'static String toString(int[] a)', documentation: 'Returns a string representation of the array', insertText: 'toString(${1:array})' },
        { label: 'deepToString', kind: 'Method', detail: 'static String deepToString(Object[] a)', documentation: 'Returns a string representation of the deep contents', insertText: 'deepToString(${1:array})' },
        { label: 'asList', kind: 'Method', detail: 'static <T> List<T> asList(T... a)', documentation: 'Returns a fixed-size list backed by the specified array', insertText: 'asList(${1:elements})' },
        { label: 'stream', kind: 'Method', detail: 'static IntStream stream(int[] array)', documentation: 'Returns a sequential IntStream with the specified array', insertText: 'stream(${1:array})' },
        { label: 'parallelSort', kind: 'Method', detail: 'static void parallelSort(int[] a)', documentation: 'Sorts the array into ascending order using parallel sort', insertText: 'parallelSort(${1:array})' },
    ],

    // ── Collections ─────────────────────────────────────────────
    'Collections': [
        { label: 'sort', kind: 'Method', detail: 'static <T> void sort(List<T> list)', documentation: 'Sorts the specified list into ascending natural order', insertText: 'sort(${1:list})' },
        { label: 'reverse', kind: 'Method', detail: 'static void reverse(List<?> list)', documentation: 'Reverses the order of the elements', insertText: 'reverse(${1:list})' },
        { label: 'shuffle', kind: 'Method', detail: 'static void shuffle(List<?> list)', documentation: 'Randomly permutes the list', insertText: 'shuffle(${1:list})' },
        { label: 'max', kind: 'Method', detail: 'static <T> T max(Collection<T> coll)', documentation: 'Returns the maximum element of the given collection', insertText: 'max(${1:collection})' },
        { label: 'min', kind: 'Method', detail: 'static <T> T min(Collection<T> coll)', documentation: 'Returns the minimum element of the given collection', insertText: 'min(${1:collection})' },
        { label: 'frequency', kind: 'Method', detail: 'static int frequency(Collection<?> c, Object o)', documentation: 'Returns the number of elements equal to the specified object', insertText: 'frequency(${1:collection}, ${2:object})' },
        { label: 'swap', kind: 'Method', detail: 'static void swap(List<?> list, int i, int j)', documentation: 'Swaps the elements at the specified positions', insertText: 'swap(${1:list}, ${2:i}, ${3:j})' },
        { label: 'fill', kind: 'Method', detail: 'static <T> void fill(List<? super T> list, T obj)', documentation: 'Replaces all elements with the specified element', insertText: 'fill(${1:list}, ${2:element})' },
        { label: 'copy', kind: 'Method', detail: 'static <T> void copy(List<? super T> dest, List<? extends T> src)', documentation: 'Copies all elements from src into dest', insertText: 'copy(${1:dest}, ${2:src})' },
        { label: 'unmodifiableList', kind: 'Method', detail: 'static <T> List<T> unmodifiableList(List<? extends T> list)', documentation: 'Returns an unmodifiable view of the specified list', insertText: 'unmodifiableList(${1:list})' },
        { label: 'unmodifiableMap', kind: 'Method', detail: 'static <K,V> Map<K,V> unmodifiableMap(Map<? extends K, ? extends V> m)', documentation: 'Returns an unmodifiable view of the specified map', insertText: 'unmodifiableMap(${1:map})' },
        { label: 'unmodifiableSet', kind: 'Method', detail: 'static <T> Set<T> unmodifiableSet(Set<? extends T> s)', documentation: 'Returns an unmodifiable view of the specified set', insertText: 'unmodifiableSet(${1:set})' },
        { label: 'synchronizedList', kind: 'Method', detail: 'static <T> List<T> synchronizedList(List<T> list)', documentation: 'Returns a synchronized (thread-safe) list', insertText: 'synchronizedList(${1:list})' },
        { label: 'singletonList', kind: 'Method', detail: 'static <T> List<T> singletonList(T o)', documentation: 'Returns an immutable list containing only the specified object', insertText: 'singletonList(${1:element})' },
        { label: 'emptyList', kind: 'Method', detail: 'static <T> List<T> emptyList()', documentation: 'Returns an empty list (immutable)', insertText: 'emptyList()' },
        { label: 'emptyMap', kind: 'Method', detail: 'static <K,V> Map<K,V> emptyMap()', documentation: 'Returns an empty map (immutable)', insertText: 'emptyMap()' },
        { label: 'emptySet', kind: 'Method', detail: 'static <T> Set<T> emptySet()', documentation: 'Returns an empty set (immutable)', insertText: 'emptySet()' },
        { label: 'nCopies', kind: 'Method', detail: 'static <T> List<T> nCopies(int n, T o)', documentation: 'Returns an immutable list consisting of n copies of the specified object', insertText: 'nCopies(${1:n}, ${2:element})' },
        { label: 'disjoint', kind: 'Method', detail: 'static boolean disjoint(Collection<?> c1, Collection<?> c2)', documentation: 'Returns true if the two collections have no elements in common', insertText: 'disjoint(${1:collection1}, ${2:collection2})' },
        { label: 'binarySearch', kind: 'Method', detail: 'static <T> int binarySearch(List<T> list, T key)', documentation: 'Searches the list for the specified object using binary search', insertText: 'binarySearch(${1:list}, ${2:key})' },
    ],

    // ── Random ──────────────────────────────────────────────────
    'Random': [
        { label: 'nextInt', kind: 'Method', detail: 'int nextInt()', documentation: 'Returns the next pseudorandom int value', insertText: 'nextInt()' },
        { label: 'nextInt', kind: 'Method', detail: 'int nextInt(int bound)', documentation: 'Returns a pseudorandom int between 0 (inclusive) and the bound (exclusive)', insertText: 'nextInt(${1:bound})' },
        { label: 'nextDouble', kind: 'Method', detail: 'double nextDouble()', documentation: 'Returns the next pseudorandom double between 0.0 and 1.0', insertText: 'nextDouble()' },
        { label: 'nextFloat', kind: 'Method', detail: 'float nextFloat()', documentation: 'Returns the next pseudorandom float between 0.0 and 1.0', insertText: 'nextFloat()' },
        { label: 'nextLong', kind: 'Method', detail: 'long nextLong()', documentation: 'Returns the next pseudorandom long value', insertText: 'nextLong()' },
        { label: 'nextBoolean', kind: 'Method', detail: 'boolean nextBoolean()', documentation: 'Returns the next pseudorandom boolean value', insertText: 'nextBoolean()' },
        { label: 'nextGaussian', kind: 'Method', detail: 'double nextGaussian()', documentation: 'Returns the next pseudorandom Gaussian distributed double', insertText: 'nextGaussian()' },
        { label: 'setSeed', kind: 'Method', detail: 'void setSeed(long seed)', documentation: 'Sets the seed of this random number generator', insertText: 'setSeed(${1:seed})' },
    ],

    // ── Optional ────────────────────────────────────────────────
    'Optional': [
        { label: 'get', kind: 'Method', detail: 'T get()', documentation: 'If a value is present, returns the value', insertText: 'get()' },
        { label: 'isPresent', kind: 'Method', detail: 'boolean isPresent()', documentation: 'Returns true if a value is present', insertText: 'isPresent()' },
        { label: 'isEmpty', kind: 'Method', detail: 'boolean isEmpty()', documentation: 'Returns true if a value is not present', insertText: 'isEmpty()' },
        { label: 'ifPresent', kind: 'Method', detail: 'void ifPresent(Consumer<? super T> action)', documentation: 'If a value is present, performs the given action', insertText: 'ifPresent(${1:value} -> ${2})' },
        { label: 'orElse', kind: 'Method', detail: 'T orElse(T other)', documentation: 'Returns the value if present, otherwise returns other', insertText: 'orElse(${1:other})' },
        { label: 'orElseGet', kind: 'Method', detail: 'T orElseGet(Supplier<? extends T> supplier)', documentation: 'Returns the value if present, otherwise invokes supplier', insertText: 'orElseGet(() -> ${1})' },
        { label: 'orElseThrow', kind: 'Method', detail: 'T orElseThrow()', documentation: 'Returns the value if present, otherwise throws NoSuchElementException', insertText: 'orElseThrow()' },
        { label: 'map', kind: 'Method', detail: 'Optional<U> map(Function<? super T, ? extends U> mapper)', documentation: 'If a value is present, applies the mapping function', insertText: 'map(${1:value} -> ${2})' },
        { label: 'flatMap', kind: 'Method', detail: 'Optional<U> flatMap(Function<? super T, Optional<U>> mapper)', documentation: 'If present, applies the Optional-bearing mapping function', insertText: 'flatMap(${1:value} -> ${2})' },
        { label: 'filter', kind: 'Method', detail: 'Optional<T> filter(Predicate<? super T> predicate)', documentation: 'If present, and the value matches the predicate, returns this Optional', insertText: 'filter(${1:value} -> ${2})' },
        { label: 'of', kind: 'Method', detail: 'static <T> Optional<T> of(T value)', documentation: 'Returns an Optional describing the given non-null value', insertText: 'of(${1:value})' },
        { label: 'ofNullable', kind: 'Method', detail: 'static <T> Optional<T> ofNullable(T value)', documentation: 'Returns an Optional describing the given value, or empty if null', insertText: 'ofNullable(${1:value})' },
        { label: 'empty', kind: 'Method', detail: 'static <T> Optional<T> empty()', documentation: 'Returns an empty Optional instance', insertText: 'empty()' },
    ],

    // ── Queue / LinkedList ──────────────────────────────────────
    'Queue': [
        { label: 'add', kind: 'Method', detail: 'boolean add(E e)', documentation: 'Inserts the element, throwing IllegalStateException if full', insertText: 'add(${1:element})' },
        { label: 'offer', kind: 'Method', detail: 'boolean offer(E e)', documentation: 'Inserts the element if possible', insertText: 'offer(${1:element})' },
        { label: 'remove', kind: 'Method', detail: 'E remove()', documentation: 'Retrieves and removes the head, throwing if empty', insertText: 'remove()' },
        { label: 'poll', kind: 'Method', detail: 'E poll()', documentation: 'Retrieves and removes the head, or returns null if empty', insertText: 'poll()' },
        { label: 'element', kind: 'Method', detail: 'E element()', documentation: 'Retrieves but does not remove the head, throwing if empty', insertText: 'element()' },
        { label: 'peek', kind: 'Method', detail: 'E peek()', documentation: 'Retrieves but does not remove the head, or returns null if empty', insertText: 'peek()' },
        { label: 'size', kind: 'Method', detail: 'int size()', documentation: 'Returns the number of elements', insertText: 'size()' },
        { label: 'isEmpty', kind: 'Method', detail: 'boolean isEmpty()', documentation: 'Returns true if empty', insertText: 'isEmpty()' },
        { label: 'clear', kind: 'Method', detail: 'void clear()', documentation: 'Removes all elements', insertText: 'clear()' },
        { label: 'contains', kind: 'Method', detail: 'boolean contains(Object o)', documentation: 'Returns true if this queue contains the specified element', insertText: 'contains(${1:element})' },
    ],

    // ── Stack ───────────────────────────────────────────────────
    'Stack': [
        { label: 'push', kind: 'Method', detail: 'E push(E item)', documentation: 'Pushes an item onto the top of this stack', insertText: 'push(${1:item})' },
        { label: 'pop', kind: 'Method', detail: 'E pop()', documentation: 'Removes and returns the top element', insertText: 'pop()' },
        { label: 'peek', kind: 'Method', detail: 'E peek()', documentation: 'Looks at the top element without removing it', insertText: 'peek()' },
        { label: 'empty', kind: 'Method', detail: 'boolean empty()', documentation: 'Tests if this stack is empty', insertText: 'empty()' },
        { label: 'search', kind: 'Method', detail: 'int search(Object o)', documentation: 'Returns the 1-based position from the top of the stack', insertText: 'search(${1:o})' },
        { label: 'size', kind: 'Method', detail: 'int size()', documentation: 'Returns the number of elements', insertText: 'size()' },
        { label: 'isEmpty', kind: 'Method', detail: 'boolean isEmpty()', documentation: 'Returns true if empty', insertText: 'isEmpty()' },
        { label: 'contains', kind: 'Method', detail: 'boolean contains(Object o)', documentation: 'Returns true if this stack contains the element', insertText: 'contains(${1:element})' },
        { label: 'clear', kind: 'Method', detail: 'void clear()', documentation: 'Removes all elements', insertText: 'clear()' },
    ],

    // ── Iterator ────────────────────────────────────────────────
    'Iterator': [
        { label: 'hasNext', kind: 'Method', detail: 'boolean hasNext()', documentation: 'Returns true if the iteration has more elements', insertText: 'hasNext()' },
        { label: 'next', kind: 'Method', detail: 'E next()', documentation: 'Returns the next element in the iteration', insertText: 'next()' },
        { label: 'remove', kind: 'Method', detail: 'void remove()', documentation: 'Removes from the underlying collection the last element returned', insertText: 'remove()' },
    ],

    // ── Stream ──────────────────────────────────────────────────
    'Stream': [
        { label: 'filter', kind: 'Method', detail: 'Stream<T> filter(Predicate<? super T> predicate)', documentation: 'Returns a stream of elements that match the predicate', insertText: 'filter(${1:element} -> ${2})' },
        { label: 'map', kind: 'Method', detail: 'Stream<R> map(Function<? super T, ? extends R> mapper)', documentation: 'Returns a stream of results of applying the given function', insertText: 'map(${1:element} -> ${2})' },
        { label: 'flatMap', kind: 'Method', detail: 'Stream<R> flatMap(Function<? super T, ? extends Stream<? extends R>> mapper)', documentation: 'Returns a stream of results of replacing each element with a mapped stream', insertText: 'flatMap(${1:element} -> ${2})' },
        { label: 'forEach', kind: 'Method', detail: 'void forEach(Consumer<? super T> action)', documentation: 'Performs an action for each element', insertText: 'forEach(${1:element} -> ${2})' },
        { label: 'collect', kind: 'Method', detail: 'R collect(Collector<? super T, A, R> collector)', documentation: 'Performs a mutable reduction operation', insertText: 'collect(Collectors.${1:toList()})' },
        { label: 'reduce', kind: 'Method', detail: 'Optional<T> reduce(BinaryOperator<T> accumulator)', documentation: 'Performs a reduction on the elements', insertText: 'reduce((${1:a}, ${2:b}) -> ${3})' },
        { label: 'count', kind: 'Method', detail: 'long count()', documentation: 'Returns the count of elements', insertText: 'count()' },
        { label: 'findFirst', kind: 'Method', detail: 'Optional<T> findFirst()', documentation: 'Returns an Optional describing the first element', insertText: 'findFirst()' },
        { label: 'findAny', kind: 'Method', detail: 'Optional<T> findAny()', documentation: 'Returns an Optional describing any element', insertText: 'findAny()' },
        { label: 'anyMatch', kind: 'Method', detail: 'boolean anyMatch(Predicate<? super T> predicate)', documentation: 'Returns whether any elements match the predicate', insertText: 'anyMatch(${1:element} -> ${2})' },
        { label: 'allMatch', kind: 'Method', detail: 'boolean allMatch(Predicate<? super T> predicate)', documentation: 'Returns whether all elements match the predicate', insertText: 'allMatch(${1:element} -> ${2})' },
        { label: 'noneMatch', kind: 'Method', detail: 'boolean noneMatch(Predicate<? super T> predicate)', documentation: 'Returns whether no elements match the predicate', insertText: 'noneMatch(${1:element} -> ${2})' },
        { label: 'sorted', kind: 'Method', detail: 'Stream<T> sorted()', documentation: 'Returns a stream sorted according to natural order', insertText: 'sorted()' },
        { label: 'distinct', kind: 'Method', detail: 'Stream<T> distinct()', documentation: 'Returns a stream with distinct elements', insertText: 'distinct()' },
        { label: 'limit', kind: 'Method', detail: 'Stream<T> limit(long maxSize)', documentation: 'Returns a stream truncated to maxSize length', insertText: 'limit(${1:maxSize})' },
        { label: 'skip', kind: 'Method', detail: 'Stream<T> skip(long n)', documentation: 'Returns a stream with the first n elements discarded', insertText: 'skip(${1:n})' },
        { label: 'toArray', kind: 'Method', detail: 'Object[] toArray()', documentation: 'Returns an array containing the elements', insertText: 'toArray()' },
        { label: 'min', kind: 'Method', detail: 'Optional<T> min(Comparator<? super T> comparator)', documentation: 'Returns the minimum element', insertText: 'min(${1:comparator})' },
        { label: 'max', kind: 'Method', detail: 'Optional<T> max(Comparator<? super T> comparator)', documentation: 'Returns the maximum element', insertText: 'max(${1:comparator})' },
        { label: 'peek', kind: 'Method', detail: 'Stream<T> peek(Consumer<? super T> action)', documentation: 'Returns a stream that also performs the given action on each element', insertText: 'peek(${1:element} -> ${2})' },
        { label: 'of', kind: 'Method', detail: 'static <T> Stream<T> of(T... values)', documentation: 'Returns a sequential ordered stream', insertText: 'of(${1:values})' },
    ],

    // ── Date ────────────────────────────────────────────────────
    'Date': [
        { label: 'getTime', kind: 'Method', detail: 'long getTime()', documentation: 'Returns the number of milliseconds since epoch', insertText: 'getTime()' },
        { label: 'after', kind: 'Method', detail: 'boolean after(Date when)', documentation: 'Tests if this date is after the specified date', insertText: 'after(${1:when})' },
        { label: 'before', kind: 'Method', detail: 'boolean before(Date when)', documentation: 'Tests if this date is before the specified date', insertText: 'before(${1:when})' },
        { label: 'compareTo', kind: 'Method', detail: 'int compareTo(Date anotherDate)', documentation: 'Compares two Dates', insertText: 'compareTo(${1:anotherDate})' },
        { label: 'toString', kind: 'Method', detail: 'String toString()', documentation: 'Converts this Date to a String', insertText: 'toString()' },
        { label: 'toInstant', kind: 'Method', detail: 'Instant toInstant()', documentation: 'Converts this Date to an Instant', insertText: 'toInstant()' },
    ],

    // ── Class ───────────────────────────────────────────────────
    'Class': [
        { label: 'getName', kind: 'Method', detail: 'String getName()', documentation: 'Returns the name of the entity', insertText: 'getName()' },
        { label: 'getSimpleName', kind: 'Method', detail: 'String getSimpleName()', documentation: 'Returns the simple name of the underlying class', insertText: 'getSimpleName()' },
        { label: 'getMethods', kind: 'Method', detail: 'Method[] getMethods()', documentation: 'Returns an array containing Method objects', insertText: 'getMethods()' },
        { label: 'getFields', kind: 'Method', detail: 'Field[] getFields()', documentation: 'Returns an array containing Field objects', insertText: 'getFields()' },
        { label: 'getConstructors', kind: 'Method', detail: 'Constructor<?>[] getConstructors()', documentation: 'Returns an array containing Constructor objects', insertText: 'getConstructors()' },
        { label: 'isInterface', kind: 'Method', detail: 'boolean isInterface()', documentation: 'Determines if the specified Class object represents an interface', insertText: 'isInterface()' },
        { label: 'isAssignableFrom', kind: 'Method', detail: 'boolean isAssignableFrom(Class<?> cls)', documentation: 'Determines if the class or interface represented by this Class object is either the same as, or is a superclass or superinterface of, the class or interface represented by the specified Class parameter', insertText: 'isAssignableFrom(${1:cls})' },
        { label: 'newInstance', kind: 'Method', detail: 'T newInstance()', documentation: 'Creates a new instance of the class', insertText: 'newInstance()' },
    ],

    // ── Exception / Throwable ───────────────────────────────────
    'Exception': [
        { label: 'getMessage', kind: 'Method', detail: 'String getMessage()', documentation: 'Returns the detail message string', insertText: 'getMessage()' },
        { label: 'getLocalizedMessage', kind: 'Method', detail: 'String getLocalizedMessage()', documentation: 'Creates a localized description', insertText: 'getLocalizedMessage()' },
        { label: 'getCause', kind: 'Method', detail: 'Throwable getCause()', documentation: 'Returns the cause of this throwable', insertText: 'getCause()' },
        { label: 'printStackTrace', kind: 'Method', detail: 'void printStackTrace()', documentation: 'Prints this throwable and its backtrace', insertText: 'printStackTrace()' },
        { label: 'getStackTrace', kind: 'Method', detail: 'StackTraceElement[] getStackTrace()', documentation: 'Provides programmatic access to the stack trace', insertText: 'getStackTrace()' },
        { label: 'addSuppressed', kind: 'Method', detail: 'void addSuppressed(Throwable exception)', documentation: 'Appends the specified exception to the exceptions that were suppressed', insertText: 'addSuppressed(${1:exception})' },
    ],

    // ── Enum ────────────────────────────────────────────────────
    'Enum': [
        { label: 'name', kind: 'Method', detail: 'String name()', documentation: 'Returns the name of this enum constant', insertText: 'name()' },
        { label: 'ordinal', kind: 'Method', detail: 'int ordinal()', documentation: 'Returns the ordinal of this enumeration constant', insertText: 'ordinal()' },
        { label: 'compareTo', kind: 'Method', detail: 'int compareTo(E o)', documentation: 'Compares this enum with the specified object for order', insertText: 'compareTo(${1:o})' },
        { label: 'getDeclaringClass', kind: 'Method', detail: 'Class<E> getDeclaringClass()', documentation: 'Returns the Class object corresponding to this enum constant\'s enum type', insertText: 'getDeclaringClass()' },
        { label: 'valueOf', kind: 'Method', detail: 'static <T extends Enum<T>> T valueOf(Class<T> enumType, String name)', documentation: 'Returns the enum constant of the specified enum type with the specified name', insertText: 'valueOf(${1:enumType}, ${2:name})' },
    ],

    // ── Thread ──────────────────────────────────────────────────
    'Thread': [
        { label: 'start', kind: 'Method', detail: 'void start()', documentation: 'Causes this thread to begin execution', insertText: 'start()' },
        { label: 'run', kind: 'Method', detail: 'void run()', documentation: 'If this thread was constructed using a separate Runnable run object, then that Runnable object\'s run method is called', insertText: 'run()' },
        { label: 'sleep', kind: 'Method', detail: 'static void sleep(long millis)', documentation: 'Causes the currently executing thread to sleep', insertText: 'sleep(${1:millis})' },
        { label: 'join', kind: 'Method', detail: 'void join()', documentation: 'Waits for this thread to die', insertText: 'join()' },
        { label: 'interrupt', kind: 'Method', detail: 'void interrupt()', documentation: 'Interrupts this thread', insertText: 'interrupt()' },
        { label: 'isInterrupted', kind: 'Method', detail: 'boolean isInterrupted()', documentation: 'Tests whether this thread has been interrupted', insertText: 'isInterrupted()' },
        { label: 'isAlive', kind: 'Method', detail: 'boolean isAlive()', documentation: 'Tests if this thread is alive', insertText: 'isAlive()' },
        { label: 'getName', kind: 'Method', detail: 'String getName()', documentation: 'Returns this thread\'s name', insertText: 'getName()' },
        { label: 'setName', kind: 'Method', detail: 'void setName(String name)', documentation: 'Changes the name of this thread', insertText: 'setName(${1:name})' },
        { label: 'setDaemon', kind: 'Method', detail: 'void setDaemon(boolean on)', documentation: 'Marks this thread as either a daemon thread or a user thread', insertText: 'setDaemon(${1:on})' },
        { label: 'currentThread', kind: 'Method', detail: 'static Thread currentThread()', documentation: 'Returns a reference to the currently executing thread object', insertText: 'currentThread()' },
    ],

    // ── Runnable ────────────────────────────────────────────────
    'Runnable': [
        { label: 'run', kind: 'Method', detail: 'void run()', documentation: 'When an object implementing interface Runnable is used to create a thread, starting the thread causes the object\'s run method to be called', insertText: 'run()' },
    ],

    // ── Collection (Base Interface) ─────────────────────────────
    'Collection': [
        { label: 'size', kind: 'Method', detail: 'int size()', documentation: 'Returns the number of elements in this collection', insertText: 'size()' },
        { label: 'isEmpty', kind: 'Method', detail: 'boolean isEmpty()', documentation: 'Returns true if this collection contains no elements', insertText: 'isEmpty()' },
        { label: 'contains', kind: 'Method', detail: 'boolean contains(Object o)', documentation: 'Returns true if this collection contains the specified element', insertText: 'contains(${1:o})' },
        { label: 'iterator', kind: 'Method', detail: 'Iterator<E> iterator()', documentation: 'Returns an iterator over the elements in this collection', insertText: 'iterator()' },
        { label: 'toArray', kind: 'Method', detail: 'Object[] toArray()', documentation: 'Returns an array containing all of the elements in this collection', insertText: 'toArray()' },
        { label: 'add', kind: 'Method', detail: 'boolean add(E e)', documentation: 'Ensures that this collection contains the specified element', insertText: 'add(${1:e})' },
        { label: 'remove', kind: 'Method', detail: 'boolean remove(Object o)', documentation: 'Removes a single instance of the specified element from this collection', insertText: 'remove(${1:o})' },
        { label: 'containsAll', kind: 'Method', detail: 'boolean containsAll(Collection<?> c)', documentation: 'Returns true if this collection contains all of the elements in the specified collection', insertText: 'containsAll(${1:c})' },
        { label: 'addAll', kind: 'Method', detail: 'boolean addAll(Collection<? extends E> c)', documentation: 'Adds all of the elements in the specified collection to this collection', insertText: 'addAll(${1:c})' },
        { label: 'removeAll', kind: 'Method', detail: 'boolean removeAll(Collection<?> c)', documentation: 'Removes all of this collection\'s elements that are also contained in the specified collection', insertText: 'removeAll(${1:c})' },
        { label: 'retainAll', kind: 'Method', detail: 'boolean retainAll(Collection<?> c)', documentation: 'Retains only the elements in this collection that are contained in the specified collection', insertText: 'retainAll(${1:c})' },
        { label: 'clear', kind: 'Method', detail: 'void clear()', documentation: 'Removes all of the elements from this collection', insertText: 'clear()' },
        { label: 'stream', kind: 'Method', detail: 'Stream<E> stream()', documentation: 'Returns a sequential Stream with this collection as its source', insertText: 'stream()' },
    ],

    // ── Iterator / Iterable ─────────────────────────────────────
    'Iterator': [
        { label: 'hasNext', kind: 'Method', detail: 'boolean hasNext()', documentation: 'Returns true if the iteration has more elements', insertText: 'hasNext()' },
        { label: 'next', kind: 'Method', detail: 'E next()', documentation: 'Returns the next element in the iteration', insertText: 'next()' },
        { label: 'remove', kind: 'Method', detail: 'void remove()', documentation: 'Removes from the underlying collection the last element returned by this iterator', insertText: 'remove()' },
        { label: 'forEachRemaining', kind: 'Method', detail: 'void forEachRemaining(Consumer<? super E> action)', documentation: 'Performs the given action for each remaining element until all elements have been processed or the action throws an exception', insertText: 'forEachRemaining(${1:action})' },
    ],
    'Iterable': [
        { label: 'iterator', kind: 'Method', detail: 'Iterator<T> iterator()', documentation: 'Returns an iterator over elements of type T', insertText: 'iterator()' },
        { label: 'forEach', kind: 'Method', detail: 'void forEach(Consumer<? super T> action)', documentation: 'Performs the given action for each element of the Iterable until all elements have been processed or the action throws an exception', insertText: 'forEach(${1:action})' },
        { label: 'spliterator', kind: 'Method', detail: 'Spliterator<T> spliterator()', documentation: 'Creates a Spliterator over the elements described by this Iterable', insertText: 'spliterator()' },
    ],

    // ── Collections ─────────────────────────────────────────────
    'Collections': [
        { label: 'sort', kind: 'Method', detail: 'static <T extends Comparable<? super T>> void sort(List<T> list)', documentation: 'Sorts the specified list into ascending order, according to the natural ordering of its elements', insertText: 'sort(${1:list})' },
        { label: 'reverse', kind: 'Method', detail: 'static void reverse(List<?> list)', documentation: 'Reverses the order of the elements in the specified list', insertText: 'reverse(${1:list})' },
        { label: 'shuffle', kind: 'Method', detail: 'static void shuffle(List<?> list)', documentation: 'Randomly permutes the specified list using a default source of randomness', insertText: 'shuffle(${1:list})' },
        { label: 'binarySearch', kind: 'Method', detail: 'static <T> int binarySearch(List<? extends Comparable<? super T>> list, T key)', documentation: 'Searches the specified list for the specified object using the binary search algorithm', insertText: 'binarySearch(${1:list}, ${2:key})' },
        { label: 'max', kind: 'Method', detail: 'static <T extends Object & Comparable<? super T>> T max(Collection<? extends T> coll)', documentation: 'Returns the maximum element of the given collection, according to the natural ordering of its elements', insertText: 'max(${1:coll})' },
        { label: 'min', kind: 'Method', detail: 'static <T extends Object & Comparable<? super T>> T min(Collection<? extends T> coll)', documentation: 'Returns the minimum element of the given collection, according to the natural ordering of its elements', insertText: 'min(${1:coll})' },
        { label: 'singletonList', kind: 'Method', detail: 'static <T> List<T> singletonList(T o)', documentation: 'Returns an immutable list containing only the specified object', insertText: 'singletonList(${1:o})' },
        { label: 'emptyList', kind: 'Method', detail: 'static <T> List<T> emptyList()', documentation: 'Returns an empty list (immutable)', insertText: 'emptyList()' },
        { label: 'unmodifiableList', kind: 'Method', detail: 'static <T> List<T> unmodifiableList(List<? extends T> list)', documentation: 'Returns an unmodifiable view of the specified list', insertText: 'unmodifiableList(${1:list})' },
        { label: 'synchronizedList', kind: 'Method', detail: 'static <T> List<T> synchronizedList(List<T> list)', documentation: 'Returns a synchronized (thread-safe) list backed by the specified list', insertText: 'synchronizedList(${1:list})' },
    ],

    // ── Arrays ──────────────────────────────────────────────────
    'Arrays': [
        { label: 'asList', kind: 'Method', detail: 'static <T> List<T> asList(T... a)', documentation: 'Returns a fixed-size list backed by the specified array', insertText: 'asList(${1:a})' },
        { label: 'sort', kind: 'Method', detail: 'static void sort(int[] a)', documentation: 'Sorts the specified array into ascending numerical order', insertText: 'sort(${1:a})' },
        { label: 'binarySearch', kind: 'Method', detail: 'static int binarySearch(int[] a, int key)', documentation: 'Searches the specified array of ints for the specified value using the binary search algorithm', insertText: 'binarySearch(${1:a}, ${2:key})' },
        { label: 'equals', kind: 'Method', detail: 'static boolean equals(int[] a, int[] a2)', documentation: 'Returns true if the two specified arrays of ints are equal to one another', insertText: 'equals(${1:a}, ${2:a2})' },
        { label: 'fill', kind: 'Method', detail: 'static void fill(int[] a, int val)', documentation: 'Assigns the specified int value to each element of the specified array of ints', insertText: 'fill(${1:a}, ${2:val})' },
        { label: 'copyOf', kind: 'Method', detail: 'static int[] copyOf(int[] original, int newLength)', documentation: 'Copies the specified array, truncating or padding with zeros so the copy has the specified length', insertText: 'copyOf(${1:original}, ${2:newLength})' },
        { label: 'copyOfRange', kind: 'Method', detail: 'static int[] copyOfRange(int[] original, int from, int to)', documentation: 'Copies the specified range of the specified array into a new array', insertText: 'copyOfRange(${1:original}, ${2:from}, ${3:to})' },
        { label: 'toString', kind: 'Method', detail: 'static String toString(int[] a)', documentation: 'Returns a string representation of the contents of the specified array', insertText: 'toString(${1:a})' },
        { label: 'stream', kind: 'Method', detail: 'static IntStream stream(int[] array)', documentation: 'Returns a sequential IntStream with the specified array as its source', insertText: 'stream(${1:array})' },
    ],
};

// Type aliases — implementations share the same methods as their interface
JAVA_TYPE_DB['ArrayList'] = JAVA_TYPE_DB['List'];
JAVA_TYPE_DB['LinkedList'] = [...JAVA_TYPE_DB['List'], ...JAVA_TYPE_DB['Queue'],
    { label: 'getFirst', kind: 'Method', detail: 'E getFirst()', documentation: 'Returns the first element', insertText: 'getFirst()' },
    { label: 'getLast', kind: 'Method', detail: 'E getLast()', documentation: 'Returns the last element', insertText: 'getLast()' },
    { label: 'removeFirst', kind: 'Method', detail: 'E removeFirst()', documentation: 'Removes and returns the first element', insertText: 'removeFirst()' },
    { label: 'removeLast', kind: 'Method', detail: 'E removeLast()', documentation: 'Removes and returns the last element', insertText: 'removeLast()' },
    { label: 'addFirst', kind: 'Method', detail: 'void addFirst(E e)', documentation: 'Inserts the element at the beginning', insertText: 'addFirst(${1:e})' },
    { label: 'addLast', kind: 'Method', detail: 'void addLast(E e)', documentation: 'Appends the element to the end', insertText: 'addLast(${1:e})' },
];
JAVA_TYPE_DB['HashMap'] = JAVA_TYPE_DB['Map'];
JAVA_TYPE_DB['TreeMap'] = [...JAVA_TYPE_DB['Map'],
    { label: 'firstKey', kind: 'Method', detail: 'K firstKey()', documentation: 'Returns the first (lowest) key currently in this map', insertText: 'firstKey()' },
    { label: 'lastKey', kind: 'Method', detail: 'K lastKey()', documentation: 'Returns the last (highest) key currently in this map', insertText: 'lastKey()' },
    { label: 'headMap', kind: 'Method', detail: 'SortedMap<K,V> headMap(K toKey)', documentation: 'Returns a view of the portion of this map whose keys are strictly less than toKey', insertText: 'headMap(${1:toKey})' },
    { label: 'tailMap', kind: 'Method', detail: 'SortedMap<K,V> tailMap(K fromKey)', documentation: 'Returns a view of the portion of this map whose keys are greater than or equal to fromKey', insertText: 'tailMap(${1:fromKey})' },
];
JAVA_TYPE_DB['LinkedHashMap'] = JAVA_TYPE_DB['Map'];
JAVA_TYPE_DB['HashSet'] = JAVA_TYPE_DB['Set'];
JAVA_TYPE_DB['TreeSet'] = [...JAVA_TYPE_DB['Set'],
    { label: 'first', kind: 'Method', detail: 'E first()', documentation: 'Returns the first (lowest) element currently in this set', insertText: 'first()' },
    { label: 'last', kind: 'Method', detail: 'E last()', documentation: 'Returns the last (highest) element currently in this set', insertText: 'last()' },
    { label: 'headSet', kind: 'Method', detail: 'SortedSet<E> headSet(E toElement)', documentation: 'Returns a view of the portion of this set whose elements are strictly less than toElement', insertText: 'headSet(${1:toElement})' },
    { label: 'tailSet', kind: 'Method', detail: 'SortedSet<E> tailSet(E fromElement)', documentation: 'Returns a view of the portion of this set whose elements are greater than or equal to fromElement', insertText: 'tailSet(${1:fromElement})' },
];
JAVA_TYPE_DB['LinkedHashSet'] = JAVA_TYPE_DB['Set'];
JAVA_TYPE_DB['StringBuffer'] = JAVA_TYPE_DB['StringBuilder'];
JAVA_TYPE_DB['PriorityQueue'] = JAVA_TYPE_DB['Queue'];
JAVA_TYPE_DB['ArrayDeque'] = [...JAVA_TYPE_DB['Queue'],
    { label: 'push', kind: 'Method', detail: 'void push(E e)', documentation: 'Pushes an element onto the stack represented by this deque', insertText: 'push(${1:element})' },
    { label: 'pop', kind: 'Method', detail: 'E pop()', documentation: 'Pops an element from the stack represented by this deque', insertText: 'pop()' },
    { label: 'getFirst', kind: 'Method', detail: 'E getFirst()', documentation: 'Retrieves the first element', insertText: 'getFirst()' },
    { label: 'getLast', kind: 'Method', detail: 'E getLast()', documentation: 'Retrieves the last element', insertText: 'getLast()' },
    { label: 'addFirst', kind: 'Method', detail: 'void addFirst(E e)', documentation: 'Inserts the element at the front', insertText: 'addFirst(${1:element})' },
    { label: 'addLast', kind: 'Method', detail: 'void addLast(E e)', documentation: 'Inserts the element at the end', insertText: 'addLast(${1:element})' },
    { label: 'removeFirst', kind: 'Method', detail: 'E removeFirst()', documentation: 'Retrieves and removes the first element', insertText: 'removeFirst()' },
    { label: 'removeLast', kind: 'Method', detail: 'E removeLast()', documentation: 'Retrieves and removes the last element', insertText: 'removeLast()' },
];
JAVA_TYPE_DB['Throwable'] = JAVA_TYPE_DB['Exception'];
JAVA_TYPE_DB['RuntimeException'] = JAVA_TYPE_DB['Exception'];


// ═══════════════════════════════════════════════════════════════════
// Smart Variable Type Resolver
// ═══════════════════════════════════════════════════════════════════

const JavaTypeResolver = {
    // Well-known static-access paths
    STATIC_PATHS: {
        'System.out': 'PrintStream',
        'System.err': 'PrintStream',
        'System.in': 'InputStream',
    },

    // Well-known classes that can be used with dot notation (static methods)
    STATIC_CLASSES: new Set([
        'System', 'Math', 'Integer', 'Double', 'Long', 'Float', 'Boolean',
        'Character', 'Byte', 'Short', 'String', 'Arrays', 'Collections',
        'Optional', 'Stream', 'Objects',
    ]),

    /**
     * Given the full editor text and a token before the dot,
     * resolves what Java type that token represents.
     * @param {string} text - The full editor source code
     * @param {string} token - The text before the dot (e.g. 'myString', 'System', 'System.out')
     * @param {number} lineNumber - Current cursor line (1-indexed)
     * @returns {string|null} - The resolved Java type name, or null
     */
    resolve(text, token, lineNumber, userClasses = {}) {
        if (!token) return null;

        // Check for method chains: obj.method() or list.get(0)
        const methodChainMatch = token.match(/^([a-zA-Z0-9_.]+)\.([a-zA-Z0-9_]+)\([^)]*\)$/);
        if (methodChainMatch) {
            const baseObj = methodChainMatch[1];
            const methodCall = methodChainMatch[2];
            
            // Resolve the type of baseObj
            const baseType = this.resolve(text, baseObj, lineNumber, userClasses);
            if (baseType) {
                // If it's a known collection type getting an element, try to find generic type
                if (methodCall === 'get' && (baseType === 'List' || baseType === 'ArrayList' || baseType === 'Map' || baseType === 'HashMap')) {
                    const genericType = this.extractGenericType(text, baseObj, lineNumber);
                    if (genericType) return genericType;
                }
                
                // Otherwise look up the method's return type in DB
                const members = userClasses[baseType] || JAVA_TYPE_DB[baseType];
                if (members) {
                    const methodInfo = members.find(m => m.label === methodCall);
                    if (methodInfo && methodInfo.detail) {
                        const retMatch = methodInfo.detail.match(/^([A-Z][A-Za-z0-9_]*|int|double|float|long|boolean|char|byte|short)/);
                        if (retMatch && retMatch[1] !== 'void') {
                            const returnType = retMatch[1];
                            const primitiveMap = { 'int': 'Integer', 'double': 'Double', 'float': 'Float', 'long': 'Long', 'boolean': 'Boolean', 'char': 'Character', 'byte': 'Byte', 'short': 'Short' };
                            return primitiveMap[returnType] || returnType;
                        }
                    }
                }
            }
        }

        // 1. Check well-known static paths first (e.g. System.out → PrintStream)
        if (this.STATIC_PATHS[token]) {
            return this.STATIC_PATHS[token];
        }

        // 2. Check if it's a known static class (e.g. Math, Integer, System)
        if (this.STATIC_CLASSES.has(token) && JAVA_TYPE_DB[token]) {
            return token;
        }

        // 3. Check if it's a class name in our DB directly or in userClasses
        if ((JAVA_TYPE_DB[token] || userClasses[token]) && /^[A-Z]/.test(token)) {
            return token;
        }

        // 4. Resolve variable type from declarations in the source
        return this.resolveFromDeclarations(text, token, lineNumber);
    },

    extractGenericType(text, varName, lineNumber) {
        const lines = text.split('\n');
        const escapedVar = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchEndLine = Math.min(lineNumber, lines.length);
        
        for (let i = searchEndLine - 1; i >= 0; i--) {
            const line = lines[i];
            
            // Map generic pattern (take value type V) Map<K, V>
            const mapGenericPattern = new RegExp(`(?:[A-Za-z0-9_]+)\\s*<\\s*[A-Z][A-Za-z0-9_]*\\s*,\\s*([A-Z][A-Za-z0-9_]*)\\s*>\\s+${escapedVar}\\s*[=;,)]`);
            const mapMatch = line.match(mapGenericPattern);
            if (mapMatch && mapMatch[1]) {
                return mapMatch[1];
            }

            // Single generic pattern List<T>
            const genericPattern = new RegExp(`(?:[A-Za-z0-9_]+)\\s*<\\s*([A-Z][A-Za-z0-9_]*)\\s*>\\s+${escapedVar}\\s*[=;,)]`);
            const match = line.match(genericPattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        return 'Object'; // Fallback
    },

    parseUserClasses(text) {
        const userTypes = {};
        const classPattern = /class\s+([A-Z][A-Za-z0-9_]*)\s*(?:extends\s+[A-Za-z0-9_]+)?\s*(?:implements\s+[A-Za-z0-9_,\s]+)?\s*\{([\s\S]*?)\}/g;
        let classMatch;
        while ((classMatch = classPattern.exec(text)) !== null) {
            const className = classMatch[1];
            const classBody = classMatch[2];
            const members = [];
            
            const fieldPattern = /(?:public|private|protected|static|final|\s)*\b([A-Z][A-Za-z0-9_]*|int|double|float|long|boolean|char|byte|short)\s+([a-z][A-Za-z0-9_]*)\s*[=;]/g;
            let fieldMatch;
            while ((fieldMatch = fieldPattern.exec(classBody)) !== null) {
                members.push({
                    label: fieldMatch[2],
                    kind: 'Field',
                    detail: fieldMatch[1] + ' ' + fieldMatch[2],
                    insertText: fieldMatch[2]
                });
            }
            
            const methodPattern = /(?:public|private|protected|static|final|\s)*\b([A-Z][A-Za-z0-9_]*|int|double|float|long|boolean|char|byte|short|void)\s+([a-z][A-Za-z0-9_]*)\s*\(([^)]*)\)\s*\{/g;
            let methodMatch;
            while ((methodMatch = methodPattern.exec(classBody)) !== null) {
                members.push({
                    label: methodMatch[2],
                    kind: 'Method',
                    detail: methodMatch[1] + ' ' + methodMatch[2] + '(' + methodMatch[3] + ')',
                    insertText: methodMatch[2] + '()'
                });
            }
            
            userTypes[className] = members;
        }
        return userTypes;
    },

    resolveFromDeclarations(text, varName, lineNumber) {
        const lines = text.split('\n');
        const escapedVar = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Pattern 1: Explicit type declaration
        //   Type<Generic> varName = ...
        //   Type varName = ...
        //   Type varName;
        const declPatterns = [
            // With generics: List<String> items = ...
            new RegExp(`(?:final\\s+)?([A-Z][A-Za-z0-9_]*)\\s*<[^>]*>\\s+${escapedVar}\\s*[=;,)]`),
            // Without generics: String name = ...
            new RegExp(`(?:final\\s+)?([A-Z][A-Za-z0-9_]*)\\s+${escapedVar}\\s*[=;,)]`),
            // Array type: String[] names = ...
            new RegExp(`(?:final\\s+)?([A-Z][A-Za-z0-9_]*)\\[\\]\\s+${escapedVar}\\s*[=;,)]`),
            // Method parameter: (Type varName)
            new RegExp(`\\(\\s*(?:[^)]*,\\s*)?([A-Z][A-Za-z0-9_]*)(?:\\s*<[^>]*>)?\\s+${escapedVar}\\s*[,)]`),
            // Enhanced for loop: for (Type varName : collection)
            new RegExp(`for\\s*\\(\\s*(?:final\\s+)?([A-Z][A-Za-z0-9_]*)(?:\\s*<[^>]*>)?\\s+${escapedVar}\\s*:`),
        ];

        // Search backwards from current line to find the most recent declaration
        const searchEndLine = Math.min(lineNumber, lines.length);
        for (let i = searchEndLine - 1; i >= 0; i--) {
            const line = lines[i];
            for (const pattern of declPatterns) {
                const match = line.match(pattern);
                if (match && match[1]) {
                    const declaredType = match[1];
                    // Check if this is assigned with `new ConcreteType()`
                    const newPattern = new RegExp(`${escapedVar}\\s*=\\s*new\\s+([A-Z][A-Za-z0-9_]*)`);
                    const newMatch = line.match(newPattern);
                    if (newMatch && newMatch[1] && JAVA_TYPE_DB[newMatch[1]]) {
                        return newMatch[1]; // Use the concrete type
                    }
                    if (JAVA_TYPE_DB[declaredType]) {
                        return declaredType;
                    }
                    // For unknown types, return Object as fallback
                    return declaredType;
                }
            }
        }

        // Pattern 2: Primitive types that have been autoboxed
        const primitiveMap = {
            'int': 'Integer', 'double': 'Double', 'float': 'Float',
            'long': 'Long', 'boolean': 'Boolean', 'char': 'Character',
            'byte': 'Byte', 'short': 'Short'
        };

        for (let i = searchEndLine - 1; i >= 0; i--) {
            const line = lines[i];
            for (const [prim, wrapper] of Object.entries(primitiveMap)) {
                const primPattern = new RegExp(`(?:^|[\\s(])${prim}(?:\\[\\])?\\s+${escapedVar}\\s*[=;,)]`);
                if (primPattern.test(line)) {
                    // Primitives don't have methods, but the user might expect wrapper methods
                    return wrapper;
                }
            }
        }

        // Pattern 3: String literal assignment (var inferred)
        for (let i = searchEndLine - 1; i >= 0; i--) {
            const line = lines[i];
            const varPattern = new RegExp(`var\\s+${escapedVar}\\s*=\\s*"`);
            if (varPattern.test(line)) return 'String';
            const varPatternNew = new RegExp(`var\\s+${escapedVar}\\s*=\\s*new\\s+([A-Z][A-Za-z0-9_]*)`);
            const m = line.match(varPatternNew);
            if (m && m[1]) return JAVA_TYPE_DB[m[1]] ? m[1] : m[1];
        }

        return null;
    },

    /**
     * Extracts the text before the dot from the current line.
     * Handles chained expressions like: System.out, myList, str
     * @param {string} lineText - The text of the current line
     * @param {number} dotColumn - Column position of the dot (1-indexed)
     * @returns {string} - The token before the dot
     */
    getTokenBeforeDot(lineText, dotColumn) {
        // Get text up to (but not including) the dot
        const textBeforeDot = lineText.substring(0, dotColumn - 1);

        // Walk backwards to capture the full token (including dots for chains like System.out)
        let token = '';
        let parenDepth = 0;
        for (let i = textBeforeDot.length - 1; i >= 0; i--) {
            const ch = textBeforeDot[i];
            if (ch === ')') {
                parenDepth++;
                token = ch + token;
            } else if (ch === '(') {
                if (parenDepth > 0) {
                    parenDepth--;
                    token = ch + token;
                } else {
                    break;
                }
            } else if (parenDepth > 0) {
                token = ch + token;
            } else if (/[a-zA-Z0-9_.]/.test(ch)) {
                token = ch + token;
            } else {
                break;
            }
        }

        return token.trim();
    }
};

const IDE = {
    init() {
        this.initMonaco();
        this.initUI();
        this.initEvents();
        this.loadInitialFile();
    },

    initMonaco() {
        require.config({ paths: { vs: '/static/lib/node_modules/monaco-editor/min/vs' } });
        require(['vs/editor/editor.main'], () => {
            monaco.editor.defineTheme('intellij-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                    { token: 'comment', foreground: '8888a0', fontStyle: 'italic' },
                    { token: 'keyword', foreground: '8b5cf6' },
                    { token: 'string', foreground: '4ade80' },
                    { token: 'number', foreground: '3b82f6' },
                    { token: 'type', foreground: 'fcd34d' },
                    { token: 'identifier', foreground: 'e8e8f0' },
                    { token: 'delimiter', foreground: '8888a0' },
                ],
                colors: {
                    'editor.background': '#0a0a0f1a', // 0.1 opacity
                    'editor.foreground': '#e8e8f0',
                    'editor.lineHighlightBackground': '#ffffff0a', // very subtle highlight
                    'editor.selectionBackground': '#3b82f655',
                    'editor.inactiveSelectionBackground': '#3b82f633',
                    'editorCursor.foreground': '#6366f1',
                    'editorLineNumber.foreground': '#55556a',
                    'editorLineNumber.activeForeground': '#818cf8',
                    'editor.selectionHighlightBackground': '#3b82f633',
                    'editorBracketMatch.background': '#1a1a28',
                    'editorBracketMatch.border': '#6366f1',
                    'editorGutter.background': '#0a0a0f1a', // 0.1 opacity
                    'editorWidget.background': '#1a1a28',
                    'editorWidget.border': '#ffffff14',
                    'editorSuggestWidget.background': '#1a1a28',
                    'editorSuggestWidget.border': '#ffffff14',
                    'editorSuggestWidget.selectedBackground': '#6366f133',
                    'editorHoverWidget.background': '#1a1a28',
                    'editorHoverWidget.border': '#ffffff14',
                    'editorMarkerNavigation.background': '#1a1a28',
                    'editorError.foreground': '#ef4444',
                    'editorWarning.foreground': '#fcd34d',
                    'editorInfo.foreground': '#3b82f6',
                    'minimap.background': '#0a0a0f',
                }
            });
            // ── Consolidated keyword + snippet + class completion provider ──
            monaco.languages.registerCompletionItemProvider('java', {
                provideCompletionItems: function(model, position) {
                    const word = model.getWordUntilPosition(position);
                    const range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn
                    };

                    // Don't provide keyword suggestions after a dot
                    const lineText = model.getLineContent(position.lineNumber);
                    const charBeforeWord = lineText.charAt(word.startColumn - 2);
                    if (charBeforeWord === '.') return { suggestions: [] };

                    const text = model.getValue();
                    let importInsertLine = 1;
                    const packageMatch = text.match(/^\s*package\s+[a-zA-Z0-9_.]+;/m);
                    if (packageMatch) {
                        importInsertLine = model.getPositionAt(text.indexOf(packageMatch[0]) + packageMatch[0].length).lineNumber + 1;
                    }

                    const suggestions = [
                        // ─ IntelliJ-style live templates ─
                        { label: 'sout', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'System.out.println(${1});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Print to standard output', detail: 'System.out.println()', range: range, sortText: '0_sout' },
                        { label: 'soutv', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'System.out.println("${1:var} = " + ${1:var});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Print variable with name', detail: 'System.out.println("var = " + var)', range: range, sortText: '0_soutv' },
                        { label: 'souf', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'System.out.printf("${1:%s}\\n", ${2});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Formatted print', detail: 'System.out.printf()', range: range, sortText: '0_souf' },
                        { label: 'serr', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'System.err.println(${1});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Print to standard error', detail: 'System.err.println()', range: range, sortText: '0_serr' },
                        { label: 'psvm', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'public static void main(String[] args) {\n\t${1}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Main method', detail: 'main method', range: range, sortText: '0_psvm' },
                        { label: 'psf', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'public static final ${1:String} ${2:NAME} = ${3};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Public static final field', detail: 'public static final', range: range, sortText: '0_psf' },
                        { label: 'fori', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:max}; ${1:i}++) {\n\t${3}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Indexed for-loop', detail: 'for (int i = 0; ...)', range: range, sortText: '0_fori' },
                        { label: 'foreach', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for (${1:Type} ${2:item} : ${3:collection}) {\n\t${4}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Enhanced for-each loop', detail: 'for (Type item : collection)', range: range, sortText: '0_foreach' },
                        { label: 'iter', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for (${1:Object} ${2:item} : ${3:iterable}) {\n\t${4}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Iterate (same as foreach)', detail: 'for (Object item : iterable)', range: range, sortText: '0_iter' },
                        { label: 'itar', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3:Object} ${4:element} = ${2:array}[${1:i}];\n\t${5}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Iterate array with index', detail: 'for (int i = 0; i < arr.length; ...)', range: range, sortText: '0_itar' },
                        { label: 'trycatch', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'try {\n\t${1}\n} catch (${2:Exception} ${3:e}) {\n\t${4:e.printStackTrace();}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Try-catch block', detail: 'try { } catch { }', range: range, sortText: '0_trycatch' },
                        { label: 'tryf', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'try {\n\t${1}\n} catch (${2:Exception} ${3:e}) {\n\t${4:e.printStackTrace();}\n} finally {\n\t${5}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Try-catch-finally block', detail: 'try { } catch { } finally { }', range: range, sortText: '0_tryf' },
                        { label: 'ifn', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'if (${1:var} == null) {\n\t${2}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'If null check', detail: 'if (var == null)', range: range, sortText: '0_ifn' },
                        { label: 'inn', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'if (${1:var} != null) {\n\t${2}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'If not null check', detail: 'if (var != null)', range: range, sortText: '0_inn' },
                        { label: 'toar', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '${1:collection}.toArray(new ${2:Object}[0])', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Collection to array', detail: 'collection.toArray(new Type[0])', range: range, sortText: '0_toar' },
                        { label: 'lst', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'List<${1:String}> ${2:list} = new ArrayList<>();', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Create ArrayList', detail: 'List<T> list = new ArrayList<>()', range: range, sortText: '0_lst' },
                        { label: 'map', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'Map<${1:String}, ${2:Object}> ${3:map} = new HashMap<>();', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Create HashMap', detail: 'Map<K,V> map = new HashMap<>()', range: range, sortText: '0_map' },

                        // ─ Keywords ─
                        { label: 'public', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'public', range: range },
                        { label: 'private', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'private', range: range },
                        { label: 'protected', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'protected', range: range },
                        { label: 'class', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'class', range: range },
                        { label: 'interface', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'interface', range: range },
                        { label: 'enum', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'enum', range: range },
                        { label: 'abstract', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'abstract', range: range },
                        { label: 'static', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'static', range: range },
                        { label: 'final', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'final', range: range },
                        { label: 'void', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'void', range: range },
                        { label: 'extends', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'extends', range: range },
                        { label: 'implements', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'implements', range: range },
                        { label: 'import', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'import', range: range },
                        { label: 'package', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'package', range: range },
                        { label: 'throws', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'throws', range: range },
                        { label: 'throw', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'throw', range: range },
                        { label: 'instanceof', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'instanceof', range: range },
                        { label: 'synchronized', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'synchronized', range: range },
                        { label: 'volatile', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'volatile', range: range },
                        { label: 'transient', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'transient', range: range },

                        // ─ Types ─
                        { label: 'int', kind: monaco.languages.CompletionItemKind.Type, insertText: 'int', range: range },
                        { label: 'String', kind: monaco.languages.CompletionItemKind.Class, insertText: 'String', range: range },
                        { label: 'boolean', kind: monaco.languages.CompletionItemKind.Type, insertText: 'boolean', range: range },
                        { label: 'double', kind: monaco.languages.CompletionItemKind.Type, insertText: 'double', range: range },
                        { label: 'float', kind: monaco.languages.CompletionItemKind.Type, insertText: 'float', range: range },
                        { label: 'long', kind: monaco.languages.CompletionItemKind.Type, insertText: 'long', range: range },
                        { label: 'char', kind: monaco.languages.CompletionItemKind.Type, insertText: 'char', range: range },
                        { label: 'byte', kind: monaco.languages.CompletionItemKind.Type, insertText: 'byte', range: range },
                        { label: 'short', kind: monaco.languages.CompletionItemKind.Type, insertText: 'short', range: range },
                        { label: 'var', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'var', range: range },

                        // ─ Control flow keywords ─
                        { label: 'if', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'if (${1:condition}) {\n\t${2}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range: range },
                        { label: 'else', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'else {\n\t${1}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range: range },
                        { label: 'else if', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'else if (${1:condition}) {\n\t${2}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range: range },
                        { label: 'for', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${3}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range: range },
                        { label: 'while', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'while (${1:condition}) {\n\t${2}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range: range },
                        { label: 'do', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'do {\n\t${1}\n} while (${2:condition});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range: range },
                        { label: 'switch', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'switch (${1:expression}) {\n\tcase ${2:value}:\n\t\t${3}\n\t\tbreak;\n\tdefault:\n\t\t${4}\n\t\tbreak;\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range: range },
                        { label: 'try', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'try {\n\t${1}\n} catch (${2:Exception} ${3:e}) {\n\t${4:e.printStackTrace();}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range: range },
                        { label: 'catch', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'catch (${1:Exception} ${2:e}) {\n\t${3}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range: range },
                        { label: 'finally', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'finally {\n\t${1}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range: range },
                        { label: 'return', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'return ', range: range },
                        { label: 'new', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'new ', range: range },
                        { label: 'this', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'this', range: range },
                        { label: 'super', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'super', range: range },
                        { label: 'null', kind: monaco.languages.CompletionItemKind.Constant, insertText: 'null', range: range },
                        { label: 'true', kind: monaco.languages.CompletionItemKind.Constant, insertText: 'true', range: range },
                        { label: 'false', kind: monaco.languages.CompletionItemKind.Constant, insertText: 'false', range: range },

                        // ─ Common classes ─
                        { label: 'System', kind: monaco.languages.CompletionItemKind.Class, insertText: 'System', range: range },
                        { label: 'System.out.println', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'System.out.println(${1});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'void println(Object x)', range: range },
                        { label: 'System.out.print', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'System.out.print(${1});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'void print(Object obj)', range: range },
                        { label: 'public static void main', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'public static void main(String[] args) {\n\t${1}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range: range },
                        { label: 'private static final', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'private static final ${1} ${2} = ${3};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range: range },
                        { label: '@Override', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '@Override\n', range: range },
                        { label: '@Deprecated', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '@Deprecated\n', range: range },
                        { label: '@SuppressWarnings', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '@SuppressWarnings("${1:unchecked}")\n', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range: range },
                        { label: '@FunctionalInterface', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '@FunctionalInterface\n', range: range },
                    ];

                    // ─ Auto-import common classes ─
                    const commonClasses = {
                        'List': 'java.util.List',
                        'ArrayList': 'java.util.ArrayList',
                        'LinkedList': 'java.util.LinkedList',
                        'Map': 'java.util.Map',
                        'HashMap': 'java.util.HashMap',
                        'TreeMap': 'java.util.TreeMap',
                        'LinkedHashMap': 'java.util.LinkedHashMap',
                        'Set': 'java.util.Set',
                        'HashSet': 'java.util.HashSet',
                        'TreeSet': 'java.util.TreeSet',
                        'LinkedHashSet': 'java.util.LinkedHashSet',
                        'Queue': 'java.util.Queue',
                        'PriorityQueue': 'java.util.PriorityQueue',
                        'ArrayDeque': 'java.util.ArrayDeque',
                        'Stack': 'java.util.Stack',
                        'Scanner': 'java.util.Scanner',
                        'Random': 'java.util.Random',
                        'Optional': 'java.util.Optional',
                        'Collections': 'java.util.Collections',
                        'Arrays': 'java.util.Arrays',
                        'Iterator': 'java.util.Iterator',
                        'Stream': 'java.util.stream.Stream',
                        'Collectors': 'java.util.stream.Collectors',
                        'Date': 'java.util.Date',
                        'File': 'java.io.File',
                        'IOException': 'java.io.IOException',
                        'BufferedReader': 'java.io.BufferedReader',
                        'FileReader': 'java.io.FileReader',
                        'FileWriter': 'java.io.FileWriter',
                        'PrintWriter': 'java.io.PrintWriter',
                        'StringBuilder': 'java.lang.StringBuilder',
                        'StringBuffer': 'java.lang.StringBuffer',
                        'Math': 'java.lang.Math',
                    };

                    for (const [className, fullPackage] of Object.entries(commonClasses)) {
                        const importStatement = `import ${fullPackage};\n`;
                        const hasImport = text.includes(`import ${fullPackage};`);
                        const isJavaLang = fullPackage.startsWith('java.lang.');

                        const item = {
                            label: className,
                            kind: monaco.languages.CompletionItemKind.Class,
                            insertText: className,
                            detail: fullPackage,
                            range: range
                        };

                        if (!hasImport && !isJavaLang) {
                            item.additionalTextEdits = [{
                                range: new monaco.Range(importInsertLine, 1, importInsertLine, 1),
                                text: importStatement
                            }];
                        }
                        suggestions.push(item);
                    }

                    // ─ Scan current file for user-defined classes, methods, and variables ─
                    const userClassPattern = /\bclass\s+([A-Z][A-Za-z0-9_]*)\b/g;
                    const userMethodPattern = /\b(?:public|private|protected|static|\s)+\s+(?:[A-Za-z0-9_<>,\s]+)\s+([a-z][A-Za-z0-9_]*)\s*\(/g;
                    const userVarPattern = /\b(?:[A-Z][A-Za-z0-9_<>,]*|int|double|float|long|boolean|char|byte|short|var)\s+([a-z][A-Za-z0-9_]*)\s*[=;,)]/g;
                    const seenLabels = new Set(suggestions.map(s => s.label));

                    let match;
                    while ((match = userClassPattern.exec(text)) !== null) {
                        if (!seenLabels.has(match[1])) {
                            seenLabels.add(match[1]);
                            suggestions.push({ label: match[1], kind: monaco.languages.CompletionItemKind.Class, insertText: match[1], detail: 'User class', range: range });
                        }
                    }
                    while ((match = userMethodPattern.exec(text)) !== null) {
                        if (!seenLabels.has(match[1])) {
                            seenLabels.add(match[1]);
                            suggestions.push({ label: match[1], kind: monaco.languages.CompletionItemKind.Method, insertText: match[1] + '(${1})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, detail: 'User method', range: range });
                        }
                    }
                    while ((match = userVarPattern.exec(text)) !== null) {
                        if (!seenLabels.has(match[1])) {
                            seenLabels.add(match[1]);
                            suggestions.push({ label: match[1], kind: monaco.languages.CompletionItemKind.Variable, insertText: match[1], detail: 'Variable', range: range });
                        }
                    }

                    return { suggestions: suggestions };
                }
            });

            // ── Dot-triggered completion provider (IntelliJ-like method suggestions) ──
            monaco.languages.registerCompletionItemProvider('java', {
                triggerCharacters: ['.'],
                provideCompletionItems: function(model, position) {
                    const lineText = model.getLineContent(position.lineNumber);
                    const textBeforeCursor = lineText.substring(0, position.column - 1);

                    if (!textBeforeCursor.endsWith('.')) {
                        return { suggestions: [] };
                    }

                    const tokenBeforeDot = JavaTypeResolver.getTokenBeforeDot(lineText, position.column - 1);
                    if (!tokenBeforeDot) return { suggestions: [] };

                    const fullText = model.getValue();
                    const userClasses = JavaTypeResolver.parseUserClasses(fullText);
                    const resolvedType = JavaTypeResolver.resolve(fullText, tokenBeforeDot, position.lineNumber, userClasses);
                    
                    if (!resolvedType) return { suggestions: [] };

                    let members = userClasses[resolvedType] || JAVA_TYPE_DB[resolvedType];
                    if (!members) {
                        if (/^[A-Z]/.test(resolvedType)) {
                            members = JAVA_TYPE_DB['Object'];
                        }
                        if (!members) return { suggestions: [] };
                    }

                    const word = model.getWordUntilPosition(position);
                    const range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn
                    };

                    const seenLabels = new Set();
                    const suggestions = [];

                    members.forEach((member, idx) => {
                        const key = member.label;
                        if (seenLabels.has(key)) return;
                        seenLabels.add(key);

                        const kindMap = {
                            'Method': monaco.languages.CompletionItemKind.Method,
                            'Field': monaco.languages.CompletionItemKind.Field,
                            'Constant': monaco.languages.CompletionItemKind.Constant,
                            'Property': monaco.languages.CompletionItemKind.Property,
                        };

                        const item = {
                            label: member.label,
                            kind: kindMap[member.kind] || monaco.languages.CompletionItemKind.Method,
                            detail: member.detail || '',
                            documentation: member.documentation || '',
                            insertText: member.insertText || member.label,
                            range: range,
                            sortText: String(idx).padStart(4, '0'),
                        };

                        if (member.insertText && member.insertText.includes('${')) {
                            item.insertTextRules = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
                        }

                        suggestions.push(item);
                    });

                    return { suggestions: suggestions };
                }
            });

            editor = monaco.editor.create(document.getElementById('monaco-editor'), {
                value: '',
                language: 'java',
                theme: 'intellij-dark',
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', monospace",
                lineNumbers: 'on',
                minimap: { enabled: true, scale: 1 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                insertSpaces: true,
                wordWrap: 'off',
                bracketPairColorization: { enabled: true },
                renderWhitespace: 'selection',
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                padding: { top: 8 },
                folding: true,
                foldingHighlight: true,
                foldingStrategy: 'indentation',
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                parameterHints: { enabled: true },
                formatOnPaste: true,
                semanticHighlighting: { enabled: true },
                'semanticHighlighting.enabled': true,
                selectionClipboard: false,
                lightbulb: { enabled: true },
                codeLens: true,
                inlayHints: { enabled: 'on' },
                guides: { indentation: true, bracketPairs: true },
                hover: { enabled: true, delay: 300 },
                suggest: { snippetsPreventQuickSuggestions: false },
                multiCursorModifier: 'ctrlCmd',
                copyWithSyntaxHighlighting: true,
                mouseWheelZoom: true,
                dragAndDrop: true,
                emptySelectionClipboard: false,
            });

            editor.addAction({
                id: 'ide-run',
                label: 'Run Java',
                keybindings: [monaco.KeyMod.Shift | monaco.KeyCode.F10],
                run: () => IDE.runProject()
            });

            editor.addAction({
                id: 'ide-save',
                label: 'Save',
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
                run: () => IDE.saveFile()
            });

            editor.addAction({
                id: 'ide-format',
                label: 'Format Code',
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyL],
                run: () => IDE.formatCode()
            });

            editor.onDidChangeCursorPosition((e) => {
                document.getElementById('status-position').textContent = `Ln ${e.position.lineNumber}, Col ${e.position.column}`;
                document.getElementById('statusbar-ln').textContent = `Ln ${e.position.lineNumber}`;
                document.getElementById('statusbar-col').textContent = `Col ${e.position.column}`;
            });

            editor.onDidChangeModelContent(() => {
                const currentPath = activeFilePath;
                if (currentPath && editorModel) {
                    currentFileContent[currentPath] = editor.getValue();
                }
                const tab = openTabs.find(t => t.path === activeFilePath);
                if (tab && !tab.modified) {
                    tab.modified = true;
                    IDE.updateTabUI(tab);
                }
            });


            IDE.loadInitialFile();
        });
    },

    initUI() {
        this.renderFileTree(fileTreeData);
    },

    initEvents() {
        document.querySelectorAll('.menu-item[data-menu]').forEach(item => {
            item.addEventListener('click', (e) => {
                const menu = item.dataset.menu;
                IDE.toggleDropdown(`dropdown-${menu}`, item);
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.menu-item') && !e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            }
        });

        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.dataset.action;
                if (action) IDE.handleAction(action);
                document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            });
        });

        document.querySelectorAll('.activity-icon').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.dataset.action;
                if (action) IDE.handleAction(action);
            });
        });

        document.getElementById('toolbar-run').addEventListener('click', () => IDE.runProject());
        document.getElementById('toolbar-debug').addEventListener('click', () => IDE.runProject());
        document.getElementById('toolbar-stop').addEventListener('click', () => {});
        document.getElementById('toolbar-build').addEventListener('click', () => IDE.runProject());
        document.getElementById('toolbar-save').addEventListener('click', () => IDE.saveFile());
        document.getElementById('toolbar-new').addEventListener('click', () => IDE.showModal('modal-new-file'));
        document.getElementById('toolbar-undo').addEventListener('click', () => editor?.trigger('keyboard', 'undo'));
        document.getElementById('toolbar-redo').addEventListener('click', () => editor?.trigger('keyboard', 'redo'));
        document.getElementById('toolbar-format').addEventListener('click', () => IDE.formatCode());
        document.getElementById('toolbar-comment').addEventListener('click', () => editor?.trigger('keyboard', 'editor.action.commentLine'));

        document.getElementById('save-btn').addEventListener('click', () => IDE.saveFile());
        document.getElementById('undo-btn').addEventListener('click', () => editor?.trigger('keyboard', 'undo'));
        document.getElementById('redo-btn').addEventListener('click', () => editor?.trigger('keyboard', 'redo'));

        document.getElementById('new-file-btn').addEventListener('click', () => IDE.showModal('modal-new-file'));
        document.getElementById('new-dir-btn').addEventListener('click', () => IDE.showModal('modal-new-dir'));
        document.getElementById('close-project-btn').addEventListener('click', () => {
            if (document.getElementById('project-toolwindow').style.display !== 'none') {
                document.getElementById('project-toolwindow').style.display = 'none';
            }
        });

        document.getElementById('console-clear').addEventListener('click', () => {
            document.getElementById('console-output').innerHTML = '';
        });
        document.getElementById('console-scroll').addEventListener('click', () => {
            const el = document.getElementById('console-output');
            el.scrollTop = el.scrollHeight;
        });

        document.querySelectorAll('.bottom-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const panel = tab.dataset.panel;
                document.querySelectorAll('.bottom-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.bottom-panel').forEach(p => p.classList.remove('active'));
                document.getElementById(`panel-${panel}`).classList.add('active');
            });
        });

        document.querySelectorAll('.modal-close').forEach(el => {
            el.addEventListener('click', () => IDE.hideModals());
        });

        document.getElementById('modal-create-file').addEventListener('click', () => IDE.createNewFile());
        document.getElementById('modal-create-dir').addEventListener('click', () => IDE.createNewDir());

        document.getElementById('welcome-new').addEventListener('click', () => IDE.showModal('modal-new-file'));
        document.getElementById('welcome-open').addEventListener('click', () => {
            document.getElementById('project-toolwindow').style.display = '';
        });

        document.getElementById('close-right-panel').addEventListener('click', () => {
            document.getElementById('right-toolwindow').style.display = 'none';
        });
        
        const closeVideo = document.getElementById('close-video-panel');
        if (closeVideo) {
            closeVideo.addEventListener('click', () => {
                document.getElementById('video-toolwindow').style.display = 'none';
            });
        }

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                IDE.saveFile();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                IDE.showModal('modal-new-file');
            }
            if (e.key === 'F5' || (e.shiftKey && e.key === 'F10')) {
                e.preventDefault();
                IDE.runProject();
            }
        });

        const newFileName = document.getElementById('new-file-name');
        if (newFileName) {
            newFileName.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') IDE.createNewFile();
            });
        }
    },

    toggleDropdown(id, menuItem) {
        const dropdown = document.getElementById(id);
        const isActive = dropdown.classList.contains('active');
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        if (!isActive) {
            const rect = menuItem.getBoundingClientRect();
            dropdown.style.left = rect.left + 'px';
            dropdown.style.top = rect.bottom + 'px';
            dropdown.classList.add('active');
        }
    },

    handleAction(action) {
        switch(action) {
            case 'new-file': this.showModal('modal-new-file'); break;
            case 'new-dir': this.showModal('modal-new-dir'); break;
            case 'save': this.saveFile(); break;
            case 'save-all': this.saveFile(); break;
            case 'delete': this.deleteCurrentFile(); break;
            case 'close': this.closeCurrentTab(); break;
            case 'undo': editor?.trigger('keyboard', 'undo'); break;
            case 'redo': editor?.trigger('keyboard', 'redo'); break;
            case 'cut': editor?.trigger('keyboard', 'editor.action.clipboardCutAction'); break;
            case 'copy': editor?.trigger('keyboard', 'editor.action.clipboardCopyAction'); break;
            case 'paste': editor?.trigger('keyboard', 'editor.action.clipboardPasteAction'); break;
            case 'find': editor?.trigger('keyboard', 'actions.find'); break;
            case 'replace': editor?.trigger('keyboard', 'editor.action.startFindReplaceAction'); break;
            case 'run': this.runProject(); break;
            case 'debug': this.runProject(); break;
            case 'stop': break;
            case 'format': this.formatCode(); break;
            case 'comment': editor?.trigger('keyboard', 'editor.action.commentLine'); break;
            case 'uncomment': editor?.trigger('keyboard', 'editor.action.commentLine'); break;
            case 'toggle-video':
                const vw = document.getElementById('video-toolwindow');
                vw.style.display = vw.style.display === 'none' ? 'flex' : 'none';
                break;
            case 'toggle-project': 
                const pw = document.getElementById('project-toolwindow');
                pw.style.display = pw.style.display === 'none' ? '' : 'none';
                break;
            case 'toggle-console':
                const bp = document.getElementById('bottom-panel');
                bp.style.display = bp.style.display === 'none' ? '' : 'none';
                break;
            case 'fullscreen':
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
                break;
            case 'terminal': this.showToast('Terminal coming soon', 'info'); break;
            case 'tasks': this.showToast('Tasks coming soon', 'info'); break;
            case 'about': this.showModal('modal-about'); break;
            case 'shortcuts': this.showModal('modal-shortcuts'); break;
        }
    },

    showModal(id) {
        document.getElementById('modal-overlay').style.display = 'flex';
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        document.getElementById(id).style.display = 'block';
    },

    hideModals() {
        document.getElementById('modal-overlay').style.display = 'none';
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    },

    loadInitialFile() {
        const treeEl = document.getElementById('project-tree');
        if (!treeEl) return;
        const initialPath = treeEl.dataset.initialPath;
        if (initialPath) {
            this.openFile(initialPath);
        }
    },

    renderFileTree(treeData) {
        if (!treeData) {
            this.fetchTree();
            return;
        }
        const container = document.getElementById('project-tree');
        if (!container) return;
        container.innerHTML = '';
        const ul = this.buildTreeDOM(treeData, '');
        container.appendChild(ul);
    },

    fetchTree() {
        fetch('/api/tree')
            .then(r => r.json())
            .then(data => {
                fileTreeData = data;
                this.renderFileTree(data);
                if (data.children && data.children.length > 0) {
                    this.findAndOpenFirstJava(data);
                }
            })
            .catch(err => console.error('Failed to load file tree:', err));
    },

    findAndOpenFirstJava(node) {
        if (!node.isDirectory && node.name.endsWith('.java') && node.content) {
            this.openFile(node.path, node.content, true);
            return true;
        }
        if (node.children) {
            for (const child of node.children) {
                if (this.findAndOpenFirstJava(child)) return true;
            }
        }
        return false;
    },

    getMaterialIcon(name, isDir) {
        name = name.toLowerCase();
        if (isDir) {
            if (name === 'src' || name === 'source') return '<i class="fas fa-folder" style="color: #4CAF50;"></i>';
            if (name === 'test' || name === 'tests') return '<i class="fas fa-folder" style="color: #8BC34A;"></i>';
            if (name === 'target' || name === 'build' || name === 'out') return '<i class="fas fa-folder" style="color: #FF9800;"></i>';
            if (name === 'resources' || name === 'assets') return '<i class="fas fa-folder" style="color: #00BCD4;"></i>';
            if (name === 'music' || name === 'audio') return '<i class="fas fa-folder" style="color: #E91E63;"></i>';
            if (name.startsWith('.')) return '<i class="fas fa-folder" style="color: #78909C;"></i>';
            return '<i class="fas fa-folder" style="color: #FFA000;"></i>';
        } else {
            if (name.endsWith('.java')) return '<i class="fab fa-java" style="color: #F44336;"></i>';
            if (name.endsWith('.xml')) return '<i class="fas fa-code" style="color: #FF9800;"></i>';
            if (name.endsWith('.properties') || name.endsWith('.conf') || name.endsWith('.yml') || name.endsWith('.yaml')) return '<i class="fas fa-sliders-h" style="color: #607D8B;"></i>';
            if (name.endsWith('.md')) return '<i class="fab fa-markdown" style="color: #2196F3;"></i>';
            if (name.endsWith('.json')) return '<i class="fas fa-brackets-curly" style="color: #FFC107;"></i>'; // Or fa-code
            if (name.endsWith('.html') || name.endsWith('.htm')) return '<i class="fab fa-html5" style="color: #E65100;"></i>';
            if (name.endsWith('.css')) return '<i class="fab fa-css3-alt" style="color: #0277BD;"></i>';
            if (name.endsWith('.js')) return '<i class="fab fa-js" style="color: #FFD600;"></i>';
            if (name.endsWith('.txt')) return '<i class="fas fa-file-alt" style="color: #9E9E9E;"></i>';
            if (name.endsWith('.mp3') || name.endsWith('.wav')) return '<i class="fas fa-file-audio" style="color: #E91E63;"></i>';
            if (name.endsWith('.jar') || name.endsWith('.zip')) return '<i class="fas fa-file-archive" style="color: #F44336;"></i>';
            return '<i class="fas fa-file" style="color: #9E9E9E;"></i>';
        }
    },

    buildTreeDOM(node, parentPath) {
        const ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.padding = '0';
        ul.style.margin = '0';

        if (!node.children || node.children.length === 0) {
            if (!node.isDirectory) {
                const li = this.createFileNode(node, parentPath);
                ul.appendChild(li);
            }
            return ul;
        }

        node.children.forEach(child => {
            const li = document.createElement('li');
            li.style.listStyle = 'none';

            if (child.isDirectory) {
                const header = document.createElement('div');
                header.className = 'tree-node';
                header.dataset.path = child.path;

                const arrow = document.createElement('span');
                arrow.className = 'tree-arrow expanded';
                arrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
                header.appendChild(arrow);

                const icon = document.createElement('span');
                icon.className = 'tree-icon';
                icon.innerHTML = this.getMaterialIcon(child.name, true);
                header.appendChild(icon);

                const name = document.createElement('span');
                name.className = 'tree-name';
                name.textContent = child.name;
                header.appendChild(name);

                header.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const childContainer = li.querySelector('.tree-children');
                    if (childContainer) {
                        childContainer.style.display = childContainer.style.display === 'none' ? '' : 'none';
                        arrow.classList.toggle('expanded');
                    }
                });

                header.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showContextMenu(e.clientX, e.clientY, child.path, true);
                });

                li.appendChild(header);

                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'tree-children';
                const childTree = this.buildTreeDOM(child, child.path);
                childrenContainer.appendChild(childTree);
                li.appendChild(childrenContainer);
            } else {
                const nodeEl = this.createFileNode(child, parentPath);
                li.appendChild(nodeEl);
            }

            ul.appendChild(li);
        });

        return ul;
    },

    createFileNode(node, parentPath) {
        const div = document.createElement('div');
        div.className = 'tree-node';
        div.dataset.path = node.path;

        const icon = document.createElement('span');
        icon.className = 'tree-icon';
        icon.innerHTML = this.getMaterialIcon(node.name, false);
        div.appendChild(icon);

        const name = document.createElement('span');
        name.className = 'tree-name';
        name.textContent = node.name;
        div.appendChild(name);

        div.addEventListener('click', () => {
            this.openFile(node.path);
        });

        div.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showContextMenu(e.clientX, e.clientY, node.path, false);
        });

        return div;
    },

    showContextMenu(x, y, path, isDir) {
        const existing = document.querySelector('.tree-context-menu');
        if (existing) existing.remove();

        const menu = document.createElement('div');
        menu.className = 'tree-context-menu active';

        if (!isDir) {
            menu.innerHTML = `
                <div class="dropdown-item" data-action="ctx-open"><i class="fas fa-file"></i> Open</div>
                <div class="dropdown-separator"></div>
                <div class="dropdown-item" data-action="ctx-rename"><i class="fas fa-pencil-alt"></i> Rename...</div>
                <div class="dropdown-item" data-action="ctx-delete" style="color:var(--red-bright);"><i class="fas fa-trash"></i> Delete</div>
            `;
        } else {
            menu.innerHTML = `
                <div class="dropdown-item" data-action="ctx-new-file"><i class="fas fa-file"></i> New File</div>
                <div class="dropdown-item" data-action="ctx-new-dir"><i class="fas fa-folder"></i> New Directory</div>
                <div class="dropdown-separator"></div>
                <div class="dropdown-item" data-action="ctx-delete" style="color:var(--red-bright);"><i class="fas fa-trash"></i> Delete</div>
            `;
        }

        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        document.body.appendChild(menu);

        menu.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                this.handleContextAction(action, path, isDir);
                menu.remove();
            });
        });

        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 10);
    },

    handleContextAction(action, path, isDir) {
        switch(action) {
            case 'ctx-open': this.openFile(path); break;
            case 'ctx-new-file': 
                document.getElementById('new-file-dir').value = path;
                this.showModal('modal-new-file');
                break;
            case 'ctx-new-dir':
                document.getElementById('new-dir-parent').value = path;
                this.showModal('modal-new-dir');
                break;
            case 'ctx-delete':
                if (confirm(`Delete ${isDir ? 'directory' : 'file'} "${path}"?`)) {
                    this.deletePath(path);
                }
                break;
            case 'ctx-rename':
                const newName = prompt('New name:', path.split('/').pop());
                if (newName) {
                    this.showToast('Rename coming soon', 'info');
                }
                break;
        }
    },

    openFile(path, content, skipFetch) {
        if (!path) return;

        const existingTab = openTabs.find(t => t.path === path);
        if (existingTab) {
            this.activateTab(existingTab);
            return;
        }

        if (content) {
            this.addTab(path, content);
            return;
        }

        fetch(`/api/file?path=${encodeURIComponent(path)}`)
            .then(r => r.json())
            .then(data => {
                if (data.content !== undefined) {
                    this.addTab(path, data.content);
                } else if (data.error) {
                    this.showToast(`Error: ${data.error}`, 'error');
                }
            })
            .catch(err => this.showToast('Failed to open file', 'error'));
    },

    addTab(path, content) {
        const name = path.split('/').pop();
        const tab = { path, name, content, modified: false };

        openTabs.push(tab);
        currentFileContent[path] = content;

        this.renderTabs();
        this.activateTab(tab);
    },

    renderTabs() {
        const container = document.getElementById('tabs-container');
        if (!container) return;
        container.innerHTML = '';

        openTabs.forEach(tab => {
            const tabEl = document.createElement('div');
            tabEl.className = 'editor-tab' + (tab.path === activeFilePath ? ' active' : '');
            tabEl.dataset.path = tab.path;

            tabEl.innerHTML = `
                <span class="tab-icon"><i class="fab fa-java"></i></span>
                <span class="tab-name">${tab.name}</span>
                <span class="tab-close"><i class="fas fa-times"></i></span>
            `;

            tabEl.addEventListener('click', (e) => {
                if (e.target.closest('.tab-close')) {
                    this.closeTab(tab.path);
                } else {
                    this.activateTab(tab);
                }
            });

            container.appendChild(tabEl);
        });
    },

    updateTabUI(tab) {
        const container = document.getElementById('tabs-container');
        const existing = container?.querySelector(`[data-path="${tab.path}"]`);
        if (existing) {
            const nameEl = existing.querySelector('.tab-name');
            if (nameEl) {
                nameEl.textContent = tab.modified ? tab.name + ' ÃƒÂ¢Ã¢â‚¬â€Ã‚Â' : tab.name;
            }
        }
    },

    activateTab(tab) {
        if (!tab) return;
        activeFilePath = tab.path;

        document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
        const tabEl = document.querySelector(`[data-path="${tab.path}"]`);
        if (tabEl) tabEl.classList.add('active');

        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('monaco-editor').style.display = '';

        const content = currentFileContent[tab.path] || tab.content || '';

        if (editor) {
            const model = editor.getModel();
            const uri = monaco.Uri.parse(`file:///${tab.path}`);
            let newModel = monaco.editor.getModel(uri);
            if (!newModel) {
                newModel = monaco.editor.createModel(content, 'java', uri);
            } else if (newModel.getValue() !== content) {
                newModel.setValue(content);
            }
            editor.setModel(newModel);
            editorModel = newModel;
        }

        document.getElementById('breadcrumb-file').textContent = tab.name;

        document.querySelectorAll('.tree-node').forEach(n => n.classList.remove('active'));
        const treeNode = document.querySelector(`.tree-node[data-path="${tab.path}"]`);
        if (treeNode) treeNode.classList.add('active');
    },

    closeTab(path) {
        const idx = openTabs.findIndex(t => t.path === path);
        if (idx === -1) return;

        const tab = openTabs[idx];
        if (tab.modified) {
            if (!confirm(`"${tab.name}" has unsaved changes. Save before closing?`)) {
                return;
            }
            this.saveFile();
        }

        openTabs.splice(idx, 1);
        delete currentFileContent[path];

        if (editorModel) {
            const uri = editorModel.uri;
            if (uri && uri.path === path) {
                editorModel.dispose();
                editorModel = null;
            }
        }

        if (openTabs.length > 0) {
            const newIdx = Math.min(idx, openTabs.length - 1);
            this.activateTab(openTabs[newIdx]);
        } else {
            activeFilePath = null;
            if (editor) editor.setValue('');
            document.getElementById('welcome-screen').style.display = '';
            document.getElementById('monaco-editor').style.display = 'none';
        }

        this.renderTabs();
    },

    closeCurrentTab() {
        if (activeFilePath) this.closeTab(activeFilePath);
    },

    saveFile() {
        if (!activeFilePath) {
            this.showToast('No file open to save', 'warning');
            return;
        }

        const content = editor ? editor.getValue() : '';
        const path = activeFilePath;

        currentFileContent[path] = content;

        fetch('/api/file/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path, content })
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                const tab = openTabs.find(t => t.path === path);
                if (tab) {
                    tab.modified = false;
                    this.updateTabUI(tab);
                }
                this.showToast('File saved', 'success');
            } else {
                this.showToast('Save failed: ' + (data.error || 'unknown error'), 'error');
            }
        })
        .catch(() => this.showToast('Network error saving file', 'error'));
    },

    createNewFile() {
        const name = document.getElementById('new-file-name').value.trim();
        const dir = document.getElementById('new-file-dir').value.trim();
        if (!name) { this.showToast('Please enter a file name', 'warning'); return; }
        if (!name.endsWith('.java')) {
            document.getElementById('new-file-name').value = name + '.java';
        }

        const path = dir ? `${dir}/${name.endsWith('.java') ? name : name + '.java'}` : name.endsWith('.java') ? name : name + '.java';

        fetch('/api/file/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path })
        })
        .then(r => r.json())
        .then(data => {
            if (data.path) {
                this.hideModals();
                this.showToast('File created', 'success');
                this.openFile(data.path, data.content);
                this.fetchTree();
            }
        })
        .catch(() => this.showToast('Failed to create file', 'error'));
    },

    createNewDir() {
        const name = document.getElementById('new-dir-name').value.trim();
        const parent = document.getElementById('new-dir-parent').value.trim();
        if (!name) { this.showToast('Please enter a directory name', 'warning'); return; }

        const path = parent ? `${parent}/${name}` : name;

        fetch('/api/directory/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path })
        })
        .then(r => r.json())
        .then(data => {
            if (data.path) {
                this.hideModals();
                this.showToast('Directory created', 'success');
                this.fetchTree();
            }
        })
        .catch(() => this.showToast('Failed to create directory', 'error'));
    },

    deletePath(path) {
        fetch('/api/file/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path })
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                this.showToast('Deleted successfully', 'success');
                this.closeTab(path); // Close if open
                this.fetchTree();
            } else {
                this.showToast('Failed to delete: ' + (data.error || 'Unknown error'), 'error');
            }
        })
        .catch(() => this.showToast('Network error while deleting', 'error'));
    },

    deleteCurrentFile() {
        if (!activeFilePath) {
            this.showToast('No file open to delete', 'warning');
            return;
        }
        if (confirm(`Delete file "${activeFilePath}"?`)) {
            this.deletePath(activeFilePath);
        }
    },


    runProject() {
        if (isRunning) {
            this.showToast('Already running', 'warning');
            return;
        }

        if (activeFilePath) {
            this.saveFile();
        }

        isRunning = true;
        document.getElementById('toolbar-run').disabled = true;
        document.getElementById('toolbar-run').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
        document.getElementById('statusbar-run-status').innerHTML = '<i class="fas fa-circle" style="color:var(--yellow);font-size:8px;"></i> Running...';

        this.appendConsole('Running Java project...', 'console-info');
        this.showBottomPanel('console');

        const stdinData = document.getElementById('console-input') ? document.getElementById('console-input').value : '';

        fetch('/api/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                activeFilePath: activeFilePath,
                stdin: stdinData
            })
        })
        .then(r => r.json())
        .then(result => {
            this.handleRunResult(result);
        })
        .catch(err => {
            this.appendConsole(`Error: ${err.message}`, 'console-error');
            this.showToast('Run failed', 'error');
        })
        .finally(() => {
            isRunning = false;
            document.getElementById('toolbar-run').disabled = false;
            document.getElementById('toolbar-run').innerHTML = '<i class="fas fa-play"></i> Run';
            document.getElementById('statusbar-run-status').innerHTML = '<i class="fas fa-circle" style="color:var(--green);font-size:8px;"></i> Ready';
        });
    },

    handleRunResult(result) {
        if (result.success) {
            this.appendConsole('Execution completed successfully', 'console-success');
            this.appendConsole(result.executionTime || '', 'console-timestamp');
            this.appendConsole('');

            if (result.output) {
                const lines = result.output.split('\n');
                lines.forEach(line => {
                    if (line.trim()) this.appendConsole(line, 'console-output');
                });
            }

            document.getElementById('build-output').textContent = 'Build successful.\n' + (result.executionTime || '');
            this.showToast('Execution completed', 'success');
        } else {
            this.appendConsole('Compilation failed', 'console-error');
            if (result.errors) {
                const lines = result.errors.split('\n');
                lines.forEach(line => {
                    if (line.trim()) this.appendConsole(line, 'console-error');
                });
            }
            if (result.errorDetails && result.errorDetails.length > 0) {
                this.showProblems(result.errorDetails);
            }
            this.showToast('Compilation failed', 'error');
            document.getElementById('build-output').textContent = 'Build failed.\n' + (result.errors || '');
        }
    },

    showProblems(errors) {
        const list = document.getElementById('problems-list');
        const count = document.getElementById('problems-count');
        const badge = document.getElementById('problems-badge');

        list.innerHTML = '';
        const errCount = errors.filter(e => e.type === 'error').length;
        const warnCount = errors.filter(e => e.type === 'warning').length;

        count.textContent = `${errCount} errors, ${warnCount} warnings`;
        badge.textContent = errCount + warnCount;

        errors.forEach(err => {
            const div = document.createElement('div');
            div.className = 'problem-item';
            const type = err.type === 'error' ? 'error' : 'warning';
            div.innerHTML = `
                <span class="problem-icon ${type}"><i class="fas fa-${type === 'error' ? 'times-circle' : 'exclamation-triangle'}"></i></span>
                <span class="problem-msg">${err.message}</span>
                <span class="problem-loc">Line ${err.line}${err.column ? ', Col ' + err.column : ''}</span>
            `;
            div.addEventListener('click', () => {
                if (editor) {
                    editor.revealLineInCenter(err.line);
                    editor.setPosition({ lineNumber: err.line, column: err.column || 1 });
                    editor.focus();
                }
                this.showBottomPanel('problems');
            });
            list.appendChild(div);
        });

        this.showBottomPanel('problems');
    },

    formatCode() {
        if (!editor) return;
        editor.getAction('editor.action.formatDocument')?.run();
        this.showToast('Code formatted', 'success');
    },

    appendConsole(text, className) {
        const el = document.getElementById('console-output');
        const line = document.createElement('span');
        line.className = className || '';
        line.textContent = text;
        el.appendChild(line);
        el.appendChild(document.createElement('br'));
        el.scrollTop = el.scrollHeight;
    },

    showBottomPanel(panel) {
        document.querySelectorAll('.bottom-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.panel === panel);
        });
        document.querySelectorAll('.bottom-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(`panel-${panel}`).classList.add('active');
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
        toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 200);
        }, 3000);
    },

    fetchTree() {
        const treeData = document.getElementById('project-tree').dataset.treeInitial;
        if (treeData) {
            try {
                fileTreeData = JSON.parse(treeData);
                this.renderFileTree(fileTreeData);
            } catch(e) {}
        }

        fetch('/api/tree')
            .then(r => r.json())
            .then(data => {
                fileTreeData = data;
                this.renderFileTree(data);
            })
            .catch(() => {});
    }
};

const VideoPlayer = {
    audioContext: null,
    source: null,
    bassFilter: null,
    trebleFilter: null,
    videoEl: null,
    playlist: [],
    currentIndex: -1,
    isPlaying: false,
    currentFetchController: null,
    currentObjectUrl: null,

    init() {
        this.videoEl = document.getElementById('live-wallpaper');
        if (!this.videoEl) return;

        this.bindEvents();
        this.fetchPlaylist();
    },

    initAudioContext() {
        if (this.audioContext) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            this.source = this.audioContext.createMediaElementSource(this.videoEl);
            
            this.bassFilter = this.audioContext.createBiquadFilter();
            this.bassFilter.type = 'lowshelf';
            this.bassFilter.frequency.value = 200;
            this.bassFilter.gain.value = document.getElementById('video-bass').value;

            this.trebleFilter = this.audioContext.createBiquadFilter();
            this.trebleFilter.type = 'highshelf';
            this.trebleFilter.frequency.value = 3000;
            this.trebleFilter.gain.value = document.getElementById('video-treble').value;

            this.source.connect(this.bassFilter);
            this.bassFilter.connect(this.trebleFilter);
            this.trebleFilter.connect(this.audioContext.destination);

            this.videoEl.volume = document.getElementById('video-vol').value;
        } catch (e) {
            console.error("Web Audio API not supported", e);
        }
    },

    bindEvents() {
        document.getElementById('video-play').addEventListener('click', () => this.togglePlay());
        document.getElementById('video-prev').addEventListener('click', () => this.playPrev());
        document.getElementById('video-next').addEventListener('click', () => this.playNext());

        document.getElementById('video-vol').addEventListener('input', (e) => {
            if (this.videoEl) this.videoEl.volume = e.target.value;
        });

        document.getElementById('video-bass').addEventListener('input', (e) => {
            if (this.bassFilter) this.bassFilter.gain.value = e.target.value;
        });

        document.getElementById('video-treble').addEventListener('input', (e) => {
            if (this.trebleFilter) this.trebleFilter.gain.value = e.target.value;
        });

        document.getElementById('video-blur').addEventListener('input', (e) => {
            if (this.videoEl) {
                this.videoEl.style.filter = `blur(${e.target.value}px)`;
            }
        });

        document.getElementById('video-seek').addEventListener('input', (e) => {
            if (this.videoEl && this.videoEl.duration) {
                this.videoEl.currentTime = (e.target.value / 100) * this.videoEl.duration;
            }
        });

        this.videoEl.addEventListener('timeupdate', () => {
            if (this.videoEl.duration) {
                const progress = (this.videoEl.currentTime / this.videoEl.duration) * 100;


        document.getElementById('video-seek').value = progress;
                document.getElementById('video-time').textContent = 
                    `${this.formatTime(this.videoEl.currentTime)} / ${this.formatTime(this.videoEl.duration)}`;
            }
        });

        this.videoEl.addEventListener('ended', () => this.playNext());

        this.videoEl.addEventListener('waiting', () => {
            const loader = document.getElementById('video-loader');
            if (loader) loader.style.display = 'block';
        });

        this.videoEl.addEventListener('playing', () => {
            const loader = document.getElementById('video-loader');
            if (loader) loader.style.display = 'none';
        });

        this.videoEl.addEventListener('canplay', () => {
            if (!this.isPlaying) {
                const loader = document.getElementById('video-loader');
                if (loader) loader.style.display = 'none';
            }
        });
    },

    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec.toString().padStart(2, '0')}`;
    },

    fetchPlaylist() {
        fetch('/api/video/list')
            .then(r => r.json())
            .then(data => {
                this.playlist = data;
                this.renderPlaylist();
                // Removed playTrack(0, false) so it doesn't load the first video automatically
            })
            .catch(e => console.error('Failed to load video list', e));
    },

    renderPlaylist() {
        const container = document.getElementById('video-playlist');
        container.innerHTML = '';
        this.playlist.forEach((video, index) => {
            const div = document.createElement('div');
            div.className = 'playlist-item';
            div.innerHTML = `<i class="fas fa-play"></i> ${video}`;
            div.addEventListener('click', () => this.playTrack(index, true));
            container.appendChild(div);
        });
    },

    playTrack(index, autoPlay = true) {
        if (index < 0 || index >= this.playlist.length) return;
        
        if (autoPlay) {
            this.initAudioContext();
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }

        if (this.currentFetchController) {
            this.currentFetchController.abort();
        }
        this.currentFetchController = new AbortController();

        if (this.currentObjectUrl) {
            URL.revokeObjectURL(this.currentObjectUrl);
            this.currentObjectUrl = null;
        }

        this.currentIndex = index;
        const video = this.playlist[index];
        const url = `/api/video/stream?file=${encodeURIComponent(video)}`;
        
        const loader = document.getElementById('video-loader');
        if (loader) loader.style.display = 'block';
        
        this.updateUI(); // Update UI immediately to show selected track

        fetch(url, { signal: this.currentFetchController.signal })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch video");
                return res.blob();
            })
            .then(blob => {
                this.currentObjectUrl = URL.createObjectURL(blob);
                this.videoEl.src = this.currentObjectUrl;

                if (autoPlay) {
                    this.videoEl.play().then(() => {
                        this.isPlaying = true;
                        this.updateUI();
                    }).catch(e => {
                        console.error("Playback failed", e);
                        if (loader) loader.style.display = 'none';
                    });
                } else {
                    this.isPlaying = false;
                    this.updateUI();
                    if (loader) loader.style.display = 'none';
                }
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    console.error('Failed to download video', err);
                    if (loader) loader.style.display = 'none';
                }
            });
    },

    togglePlay() {
        if (this.playlist.length === 0) return;
        
        this.initAudioContext();
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        if (this.currentIndex === -1) {
            this.playTrack(0, true);
            return;
        }

        if (this.isPlaying) {
            this.videoEl.pause();
            this.isPlaying = false;
        } else {
            this.videoEl.play();
            this.isPlaying = true;
        }
        this.updateUI();
    },

    playNext() {
        if (this.playlist.length === 0) return;
        let nextIdx = this.currentIndex + 1;
        if (nextIdx >= this.playlist.length) nextIdx = 0;
        this.playTrack(nextIdx, true);
    },

    playPrev() {
        if (this.playlist.length === 0) return;
        let prevIdx = this.currentIndex - 1;
        if (prevIdx < 0) prevIdx = this.playlist.length - 1;
        this.playTrack(prevIdx, true);
    },

    updateUI() {
        document.getElementById('video-play').innerHTML = this.isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';

        if (this.currentIndex >= 0) {
            document.getElementById('video-title').textContent = this.playlist[this.currentIndex];
        }

        const items = document.querySelectorAll('.playlist-item');
        items.forEach((item, idx) => {
            if (idx === this.currentIndex) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }
};

const PanelResizer = {
    init() {
        this.bindResizer('resizer-left', 'project-toolwindow', 'horizontal', true);
        this.bindResizer('resizer-right', 'right-toolwindow', 'horizontal', false);
        this.bindResizer('resizer-right', 'video-toolwindow', 'horizontal', false);
        this.bindResizer('resizer-bottom', 'bottom-panel', 'vertical', false);
    },

    bindResizer(resizerId, targetId, direction, isLeftOrTop) {
        const resizer = document.getElementById(resizerId);
        if (!resizer) return;

        let isDragging = false;
        let startPos = 0;
        let startSize = 0;

        resizer.addEventListener('mousedown', (e) => {
            const target = document.getElementById(targetId);
            if (!target || target.style.display === 'none') return;
            
            isDragging = true;
            resizer.classList.add('dragging');
            document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
            
            if (direction === 'horizontal') {
                startPos = e.clientX;
                startSize = target.getBoundingClientRect().width;
            } else {
                startPos = e.clientY;
                startSize = target.getBoundingClientRect().height;
            }
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const target = document.getElementById(targetId);
            if (!target) return;

            let newSize;
            if (direction === 'horizontal') {
                const diff = e.clientX - startPos;
                newSize = isLeftOrTop ? startSize + diff : startSize - diff;
                if (newSize > 100 && newSize < window.innerWidth - 100) {
                    target.style.width = `${newSize}px`;
                    target.style.flex = 'none';
                }
            } else {
                const diff = e.clientY - startPos;
                // For bottom panel, dragging UP (negative diff) increases height
                newSize = startSize - diff;
                if (newSize > 50 && newSize < window.innerHeight - 100) {
                    target.style.height = `${newSize}px`;
                    target.style.flex = 'none';
                }
            }

            if (IDE.editor) {
                IDE.editor.layout();
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                resizer.classList.remove('dragging');
                document.body.style.cursor = '';
                if (IDE.editor) {
                    IDE.editor.layout();
                }
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    IDE.init();
    VideoPlayer.init();
    PanelResizer.init();
});
