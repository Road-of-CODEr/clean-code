# JUnit 들여다보기

## 목차
- [JUnit 들여다보기](#chapter-15-junit-들여다보기)
  - [목차](#목차)
  - [JUnit 프레임워크](#junit-프레임워크)
    - [ComparisonCompactor 모듈](#comparisoncompactor-모듈)
    - [개선 1) 인코딩을 피하라[N6]](#개선-1-인코딩을-피하라n6)
    - [개선 2) 조건을 캡슐화하라[G28]](#개선-2-조건을-캡슐화하라g28)
    - [개선 3) 가능하다면 표준 명명법을 사용하라[N3]](#개선-3-가능하다면-표준-명명법을-사용하라n3)
    - [개선 4) 부정 조건은 피하라[G29]](#개선-4-부정-조건은-피하라g29)
    - [개선 5) 이름으로 부수 효과를 설명하라[N7]](#개선-5-이름으로-부수-효과를-설명하라n7)
    - [개선 6) 함수는 한 가지만 해야한다[G30]](#개선-6-함수는-한-가지만-해야한다g30)
    - [개선 7) 일관성 부족[G11]](#개선-7-일관성-부족g11)
    - [개선 8)서술적인 이름을 사용하라[N1]](#개선-8서술적인-이름을-사용하라n1)
    - [개선 9) 숨겨진 시각적인 결합[G31]](#개선-9-숨겨진-시각적인-결합g31)
    - [개선 10) 일관성을 유지하라[G32]](#개선-10-일관성을-유지하라g32)
    - [개선 11) 경계 조건을 캡슐화 하라 [G33]](#개선-11-경계-조건을-캡슐화-하라-g33)
    - [개선 12) 죽은 코드[G9]](#개선-12-죽은-코드g9)
    - [최종 코드](#최종-코드)
  - [결론](#결론)


## JUnit 프레임워크
JUnit은 저자가 많다 하지만 시작은 켄트 백, 에릭 감마 두 사람이 애틀랜타행 비행기를 타고 가다 JUnit을 만들었다.
이 장에서 살펴볼 모듈은 문자열 비교 오류를 파악할 때 유용한 ComparisonCompactor라는 모듈로 영리하게 짜인 코드이다.
테스트 구조를 분석해보고 좀 더 단순하게 혹은 좀 더 명백하게 개선할 수 있는지 알아보자

### ComparisonCompactor 모듈
ComparisonCompactor 모듈은 두 문자열을 받아 차이를 반환한다.
- `ABCED`와 `ABXDE`를 받아 `<...B[X]D...>`를 반환한다.

```java
package junit.tests.framework;

import junit.framework.ComparisonCompactor;
import junit.framework.TestCase;

public class ComparisonCompactorTest extends TestCase {

    public void testMessage() {
        String failure = new ComparisonCompactor(0, "b", "c").compact("a");
        assertTrue("a expected:<[b]> but was:<[c]>".equals(failure));
    }

    public void testStartSame() {
        String failure = new ComparisonCompactor(1, "ba", "bc").compact(null);
        assertEquals("expected:<b[a]> but was:<b[c]>", failure);
    }

    public void testEndSame() {
        String failure = new ComparisonCompactor(1, "ab", "cb").compact(null);
        assertEquals("expected:<[a]b> but was:<[c]b>", failure);
    }

    public void testSame() {
        String failure = new ComparisonCompactor(1, "ab", "ab").compact(null);
        assertEquals("expected:<ab> but was:<ab>", failure);
    }

    public void testNoContextStartAndEndSame() {
        String failure = new ComparisonCompactor(0, "abc", "adc").compact(null);
        assertEquals("expected:<...[b]...> but was:<...[d]...>", failure);
    }

    public void testStartAndEndContext() {
        String failure = new ComparisonCompactor(1, "abc", "adc").compact(null);
        assertEquals("expected:<a[b]c> but was:<a[d]c>", failure);
    }

    public void testStartAndEndContextWithEllipses() {
        String failure = new ComparisonCompactor(1, "abcde", "abfde").compact(null);
        assertEquals("expected:<...b[c]d...> but was:<...b[f]d...>", failure);
    }

    public void testComparisonErrorStartSameComplete() {
        String failure = new ComparisonCompactor(2, "ab", "abc").compact(null);
        assertEquals("expected:<ab[]> but was:<ab[c]>", failure);
    }

    public void testComparisonErrorEndSameComplete() {
        String failure = new ComparisonCompactor(0, "bc", "abc").compact(null);
        assertEquals("expected:<[]...> but was:<[a]...>", failure);
    }

    public void testComparisonErrorEndSameCompleteContext() {
        String failure = new ComparisonCompactor(2, "bc", "abc").compact(null);
        assertEquals("expected:<[]bc> but was:<[a]bc>", failure);
    }

    public void testComparisonErrorOverlappingMatches() {
        String failure = new ComparisonCompactor(0, "abc", "abbc").compact(null);
        assertEquals("expected:<...[]...> but was:<...[b]...>", failure);
    }

    public void testComparisonErrorOverlappingMatchesContext() {
        String failure = new ComparisonCompactor(2, "abc", "abbc").compact(null);
        assertEquals("expected:<ab[]c> but was:<ab[b]c>", failure);
    }

    public void testComparisonErrorOverlappingMatches2() {
        String failure = new ComparisonCompactor(0, "abcdde", "abcde").compact(null);
        assertEquals("expected:<...[d]...> but was:<...[]...>", failure);
    }

    public void testComparisonErrorOverlappingMatches2Context() {
        String failure = new ComparisonCompactor(2, "abcdde", "abcde").compact(null);
        assertEquals("expected:<...cd[d]e> but was:<...cd[]e>", failure);
    }

    public void testComparisonErrorWithActualNull() {
        String failure = new ComparisonCompactor(0, "a", null).compact(null);
        assertEquals("expected:<a> but was:<null>", failure);
    }

    public void testComparisonErrorWithActualNullContext() {
        String failure = new ComparisonCompactor(2, "a", null).compact(null);
        assertEquals("expected:<a> but was:<null>", failure);
    }

    public void testComparisonErrorWithExpectedNull() {
        String failure = new ComparisonCompactor(0, null, "a").compact(null);
        assertEquals("expected:<null> but was:<a>", failure);
    }

    public void testComparisonErrorWithExpectedNullContext() {
        String failure = new ComparisonCompactor(2, null, "a").compact(null);
        assertEquals("expected:<null> but was:<a>", failure);
    }

    public void testBug609972() {
        String failure = new ComparisonCompactor(10, "S&P500", "0").compact(null);
        assertEquals("expected:<[S&P50]0> but was:<[]0>", failure);
    }
}
```
위 테스트 케이스로 ComparisonCompactor 테스트 커버리지는 100%를 달성한다.

ComparisonCompactor 코드를 보자

```java
package junit.framework;

public class ComparisonCompactor {

    private static final String ELLIPSIS = "...";
    private static final String DELTA_END = "]";
    private static final String DELTA_START = "[";

    private int fContextLength;
    private String fExpected;
    private String fActual;
    private int fPrefix;
    private int fSuffix;

    public ComparisonCompactor(int contextLength, String expected, String actual) {
        fContextLength = contextLength;
        fExpected = expected;
        fActual = actual;
    }

    public String compact(String message) {
        if (fExpected == null || fActual == null || areStringsEqual()) {
            return Assert.format(message, fExpected, fActual);
        }

        findCommonPrefix();
        findCommonSuffix();
        String expected = compactString(fExpected);
        String actual = compactString(fActual);
        return Assert.format(message, expected, actual);
    }

    private String compactString(String source) {
        String result = DELTA_START + source.substring(fPrefix, source.length() - fSuffix + 1) + DELTA_END;
        if (fPrefix > 0) {
            result = computeCommonPrefix() + result;
        }
        if (fSuffix > 0) {
            result = result + computeCommonSuffix();
        }
        return result;
    }

    private void findCommonPrefix() {
        fPrefix = 0;
        int end = Math.min(fExpected.length(), fActual.length());
        for (; fPrefix < end; fPrefix++) {
            if (fExpected.charAt(fPrefix) != fActual.charAt(fPrefix)) {
                break;
            }
        }
    }

    private void findCommonSuffix() {
        int expectedSuffix = fExpected.length() - 1;
        int actualSuffix = fActual.length() - 1;
        for (; actualSuffix >= fPrefix && expectedSuffix >= fPrefix; actualSuffix--, expectedSuffix--) {
            if (fExpected.charAt(expectedSuffix) != fActual.charAt(actualSuffix)) {
                break;
            }
        }
        fSuffix = fExpected.length() - expectedSuffix;
    }

    private String computeCommonPrefix() {
        return (fPrefix > fContextLength ? ELLIPSIS : "") + fExpected.substring(Math.max(0, fPrefix - fContextLength), fPrefix);
    }

    private String computeCommonSuffix() {
        int end = Math.min(fExpected.length() - fSuffix + 1 + fContextLength, fExpected.length());
        return fExpected.substring(fExpected.length() - fSuffix + 1, end) + (fExpected.length() - fSuffix + 1 < fExpected.length() - fContextLength ? ELLIPSIS : "");
    }

    private boolean areStringsEqual() {
        return fExpected.equals(fActual);
    }
}
```
긴 표현식 몇 개와 이상한 +1 등이 눈에 띄지만 전반적으로 휼륭한 모듈이다.

저자들이 아주 좋은 상태로 모듈을 남겨두었지만 **보이스카우트 규칙**에 따르면 우리는
처음 왔을 때보다 더 깨끗하게 해놓고 떠나야 한다.

다음과 같이 개선하여보자

### 개선 1) 인코딩을 피하라[N6]
멤버 변수 앞에 붙인 접두어 f는 불필요하다.
개발 환경에서는 이처럼 변수 이름에 범위를 명시할 필요가 없다.

```java
// Bad
private int fContextLength;
private String fExpected;
private String fActual;
private int fPrefix;
private int fSuffix;
```

```java
// Good
private int contextLength;
private String expected;
private String actual;
private int prefix;
private int suffix;
```

### 개선 2) 조건을 캡슐화하라[G28]
`compact` 함수 시작부에 캡슐화되지 않은 조건문이 보인다.
의도를 명확하게 표현하려면 조건문을 메서드로 뽑아내 적절한 이름을 붙여 캡슐화한다.

```java
// Bad
public String compact(String message) {
    if (expected == null || actual == null || areStringsEqual()) {
        return Assert.format(message, expected, actual);
    }

    findCommonPrefix();
    findCommonSuffix();
    String expected = compactString(this.expected);
    String actual = compactString(this.actual);
    return Assert.format(message, expected, actual);
}
```

```java
// Good
public String compact(String message) {
    if (shouldNotCompact()) {
        return Assert.format(message, expected, actual);
    }

    findCommonPrefix();
    findCommonSuffix();
    String expected = compactString(this.expected);
    String actual = compactString(this.actual);
    return Assert.format(message, expected, actual);
}

private boolean shouldNotCompact() {
    return expected == null || actual == null || areStringsEqual();
}
```

### 개선 3) 가능하다면 표준 명명법을 사용하라[N3]
`compact` 함수에서 사용하는 `this.expected` 와 `this.actual` 도 이미 지역 변수가 있기 때문에 눈에 거슬린다.
`fExpected` 에서 f를 빼어버린 바람에 생긴 결과다.
함수에서 멤버 변수와 이름이 똑같은 변수를 사용할 필요는 없다.
서로 다른 의미라면 이름은 명확하게 붙인다.

```java
// Bad
String expected = compactString(this.expected);
String actual = compactString(this.actual);
```

```java
// Good
String compactExpected = compactString(expected);
String compactActual = compactString(actual);
```

### 개선 4) 부정 조건은 피하라[G29]
부정문은 긍정문보다 이해하기 약간 더 어렵다. 그러므로 첫 문장 if를 긍정으로 만들어 조건문을 반전한다.

```java
// Bad
public String compact(String message) {
    if (shouldNotCompact()) {
        return Assert.format(message, expected, actual);
    }

    findCommonPrefix();
    findCommonSuffix();
    String compactExpected = compactString(expected);
    String compactActual = compactString(actual);
    return Assert.format(message, expected, actual);
}

private boolean shouldNotCompact() {
    return expected == null || actual == null || areStringsEqual();
}
```

```java
// Good
public String compact(String message) {
    if (canBeCompacted()) {
        findCommonPrefix();
        findCommonSuffix();
        String compactExpected = compactString(expected);
        String compactActual = compactString(actual);
        return Assert.format(message, compactExpected, compactActual);
    } else {
        return Assert.format(message, expected, actual);
    }       
}

private boolean canBeCompacted() {
    return expected != null && actual != null && !areStringsEqual();
}
```

### 개선 5) 이름으로 부수 효과를 설명하라[N7]
`compact` 라는 함수 이름이 이상하다. 문자열을 압축하는 함수라지만 실제로 `canBeCompacted` 가 `false`이면 압축하지 않는다.
오류 점검이라는 부가 단계가 숨겨지는 것이다. 그리고 단순한 압축 문자열이 아닌 형식이 갖춰진 문자열을 반환하기에
실제로는 `formatCompactedComparison` 이라는 이름이 적절하다. 
인수를 고려하면 가독성이 훨씬 좋아진다.

```java
// Bad
public String compact(String message) {
    ...
}
```

```java
// Good
public String formatCompactedComparison(String message) {
    ...
}
```

### 개선 6) 함수는 한 가지만 해야한다[G30]
if 문 안에서 예상 문자열과 실제 문자열을 진짜로 압축한다. 
이부분을 빼내 `compactExpectedAndActual` 이라는 메서드로 만들고 형식을 맞추는 작업은 `formatCompactedComparison`에게 맡긴다. 
그리고 `compactExpectedAndActual` 은 압축만 수행한다.

```java
// Bad
public String formatCompactedComparison(String message) {
    if (canBeCompacted()) {
        findCommonPrefix();
        findCommonSuffix();
        String compactExpected = compactString(expected);
        String compactActual = compactString(actual);
        return Assert.format(message, compactExpected, compactActual);
    } else {
        return Assert.format(message, expected, actual);
    }       
}

private boolean canBeCompacted() {
    return expected != null && actual != null && !areStringsEqual();
}
```

```java
// Good
...

private String compactExpected;
private String compactActual;

...

public String formatCompactedComparison(String message) {
    if (canBeCompacted()) {
        compactExpectedAndActual();
        return Assert.format(message, compactExpected, compactActual);
    } else {
        return Assert.format(message, expected, actual);
    }       
}

private compactExpectedAndActual() {
    findCommonPrefix();
    findCommonSuffix();
    compactExpected = compactString(expected);
    compactActual = compactString(actual);
}
```

### 개선 7) 일관성 부족[G11]
위에서 `compactExpected` 와 `compactActual` 을 멤버 변수로 승격했다는 사실에 주의한다. 
새 함수에서 마지막 두 줄은 변수를 반환하지만 첫째 줄과 둘째 줄은 반환 값이 없다. 
그래서 `findCommonPrefix` 와 `findCommonSuffix` 를 변경해 접두어 값과 접미어 값을 반환한다.
 
```java
private compactExpectedAndActual() {
    prefixIndex = findCommonPrefix();
    suffixIndex = findCommonSuffix();
    String compactExpected = compactString(expected);
    String compactActual = compactString(actual);
}

private int findCommonPrefix() {
    int prefixIndex = 0;
    int end = Math.min(expected.length(), actual.length());
    for (; prefixIndex < end; prefixIndex++) {
        if (expected.charAt(prefixIndex) != actual.charAt(prefixIndex)) {
            break;
        }
    }
    return prefixIndex;
}

private int findCommonSuffix() {
    int expectedSuffix = expected.length() - 1;
    int actualSuffix = actual.length() - 1;
    for (; actualSuffix >= prefixIndex && expectedSuffix >= prefix; actualSuffix--, expectedSuffix--) {
        if (expected.charAt(expectedSuffix) != actual.charAt(actualSuffix)) {
            break;
        }
    }
    return expected.length() - expectedSuffix;
}
```

### 개선 8)서술적인 이름을 사용하라[N1]
위 7) 과정에서 생략되었지만 멤버 변수의 이름이 색인 위치를 나타내기 때문에 
각각 `prefix`, `suffix` 에서 `prefixIndex`, `suffixIndex` 로 수정되었다.

```java
private int prefixIndex;
private int suffixIndex;
```

### 개선 9) 숨겨진 시각적인 결합[G31]
`findCommonSuffix` 를 주의 깊게 살펴보면 숨겨진 시간적인 결합(hidden temporal coupling)이 존재한다. 
다시 말해, `findCommonSuffix` 는 `findCommonPrefix`가 `prefixIndex`를 계산한다는 사실에 의존한다. 
만약 잘못된 순서로 호출하면 밤샘 디버깅이라는 고생문이 열린다. 
그래서 시간 결합을 외부에 노출하고자 `findCommonPrefix`를 고쳐 `prefixIndex`를 인수로 넘겼다.

```java
private compactExpectedAndActual() {
    prefixIndex = findCommonPrefix();
    suffixIndex = findCommonSuffix(prefixIndex);
    String compactExpected = compactString(expected);
    String compactActual = compactString(actual);
}

private int findCommonSuffix(int prefixIndex) {
    int expectedSuffix = expected.length() - 1;
    int actualSuffix = actual.length() - 1;
    for (; actualSuffix >= prefixIndex && expectedSuffix >= prefix; actualSuffix--, expectedSuffix--) {
        if (expected.charAt(expectedSuffix) != actual.charAt(actualSuffix)) {
            break;
        }
    }
    return expected.length() - expectedSuffix;
}
```

### 개선 10) 일관성을 유지하라[G32]
위 9)의 방식이 썩 내키지는 않는다. prefixIndex를 인수로 전달하는 방식은 다소 자의적이다. 
함수 호출 순서는 확실히 정해지지만 인수가 필요한 이유가 분명히 드러나지 않는다. 
따라서 다른 프로그래머가 원래대로 되돌려 놓을지도 모른다. 
이번에는 다른 방식을 고안해 보자 `findCommonPrefix` 와 `findCommonSuffix`를 원래대로 되돌리고 `findCommonSuffix` 라는 이름을 `findCommonPrefixAndSuffix` 로 바꾸고, `findCommonPrefixAndSuffix`에서 가장 먼저 `findCommonPrefix`를 호출한다. 
이 경우 호출하는 순서가 앞서 고친 코드 보다 훨씬 더 분명해진다. 
또한 `findCommonPrefixAndSuffix` 함수가 얼마나 지저분한지도 드러난다. 

```java
private compactExpectedAndActual() {
    findCommonPrefixAndSuffix();
    String compactExpected = compactString(expected);
    String compactActual = compactString(actual);
}

private void findCommonPrefixAndSuffix() {
    findCommonPrefix();
    int expectedSuffix = expected.length() - 1;
    int actualSuffix = actual.length() - 1;
    for (; actualSuffix >= prefixIndex && expectedSuffix >= prefix; actualSuffix--, expectedSuffix--) {
        if (expected.charAt(expectedSuffix) != actual.charAt(actualSuffix)) {
            break;
        }
    }
    suffixIndex = expected.length() - expectedSuffix;
}

private void findCommonPrefix() {
    int prefixIndex = 0;
    int end = Math.min(expected.length(), actual.length());
    for (; prefixIndex < end; prefixIndex++) {
        if (expected.charAt(prefixIndex) != actual.charAt(prefixIndex)) {
            break;
        }
    }
}
```

그리고 지저분한 `findCommonPrefixAndSuffix` 함수를 정리해 보자.

```java
private void findCommonPrefixAndSuffix() {
    findCommonPrefix();
    int suffixLength = 1;
    for (; suffixOverlapsPrefix(suffixLength); suffixLength++) {
        if (charFromEnd(expected, suffixLength) != charFromEnd(actual, suffixLength)) {
            break;
        }
    }
    suffixIndex = suffixLength;
}

private char charFromEnd(String s, int i) {
    return s.charAt(s.length() - i);
}

private boolean suffixOverlapsPrefix(int suffixLength) {
    return actual.length() = suffixLength < prefixLength || expected.length() - suffixLength < prefixLength;
}
```

### 개선 11) 경계 조건을 캡슐화 하라 [G33]
위의 코드 10)을 고치면서 `suffixIndex` 가 실제로는 접미어 길이라는 사실이 드러난다. 
`prefixIndex` 도 마찬가지로 이 경우 "index"와 "length"가 동의어다. 
비록 그렇다고 하더라구 "length"가 더 합당하다. 실제로 `suffixIndex` 는 0이 아닌 1에서 시작하므로 진정한 길이가 아니다.
 `computeCommSuffix` 에 +1 하는 것이 곳곳에 등장하는 이유도 여기 있다.  

ComparisonCompactor.java (중간버전)
```java
 public class ComparisonCompactor {
    ...
    private int suffixLength;
    ...

    private void findCommonPrefixAndSuffix() {
        findCommonPrefix();
        suffixLength = 0;
        for (; suffixOverlapsPrefix(suffixLength); suffixLength++) {
            if (charFromEnd(expected, suffixLength) != charFromEnd(actual, suffixLength)) {
                break;
            }
        }
    }

    private char charFromEnd(String s, int i) {
        return s.charAt(s.length() - i - 1);
    }

    private boolean suffixOverlapsPrefix(int suffixLength) {
        return actual.length() = suffixLength <= prefixLength || expected.length() - suffixLength <= prefixLength;
    }

    ...
    private String compactString(String source) {
        String result = DELTA_START + source.substring(prefixLength, source.length() - suffixLength) + DELTA_END;
        if (prefixLength > 0) {
            result = computeCommonPrefix() + result;
        }
        if (suffixLength > 0) {
            result = result + computeCommonSuffix();
        }
        return result;
    }

    ...
    private String computeCommonSuffix() {
        int end = Math.min(expected.length() - suffixLength + contextLength, expected.length());
        return expected.substring(expected.length() - suffixLength, end) + (expected.length() - suffixLength < expected.length() - contextLength ? ELLIPSIS : "");
    }
}
```
`computeCommonSuffix` 에서 +1을 없애고 `charFromEnd` 에 -1을 추가하고 `suffixOverlapsPrefix` 에 <=를 사용했다. 
그 다음 `suffixIndex`를 `suffixLength` 로 바꾸었다. 그런데 문제가 하나 생겼다. 
+1을 제거하던 중 `compactString`에서 다음행을 발견하였다.

```java
if (suffixLength > 0) {
```

위 행을 찾아보면 `suffixLength` 가 이제 1씩 감소했으므로 당연히 `>` 연산자를 `>=` 연산자로 고쳐야 마땅하다. 
하지만 >= 연산자는 말이 안되므로 그대로 `>` 연산자가 맞다! 즉, 원래 코드가 틀렸으며 필경 버그라는 말이다.  
아니, 엄밀하게 버그는 아니다. 코드를 좀 더 분석해 보면 이제 if 문은 길이가 0인 접미어를 걸러내 첨부하지 않는다. 
원래 코드는 언제나 `suffixIndex` 가 1 이상이었으므로 if 문이 무의미 했다.

### 개선 12) 죽은 코드[G9]
이후에 `compactString`에 있는 if 문이 둘 다 의심스러워진다. 살펴보면 둘 다 필요가 없다. 
두 문장 다 주석 처리한 후 테스트를 돌려보아도 통과하므로 불필요한 부분을 제거하고 구조를 좀 더 다듬어보자.

```java
private String compactString(String source) {
        return computeCommonPrefix() + DELTA_START +  source.substring(prefixLength, source.length() - suffixLength) + DELTA_END + computeCommonSuffix();
}
```

### 최종 코드
사소하게 다른 것들도 손본 후에 최종 코드를 보자
코드가 상당히 깔끔해졌다. 모듈은 일련의 분석 함수와 조합 함수로 나뉜다. 전체 함수는 위상적으로 정렬했으므로 각 함수가 사용된 직후에 정의된다.
분석 함수가 먼저 나오고 조합 함수가 그 뒤를 이어서 나온다.
코드를 주의 깊게 살펴보면 초반에 내렸던 결정을 일부 번복했다는 사실을 알 수 있다.
예를 들면 처음 추출했던 메서드 몇 개를 다시 `formatCompactedComparison`에 집어넣었다.
또한 `shouldNotBeCompacted` 조건도 원래대로 돌렸다. 코드를 리팩터링 하다 보면 흔히 원래 했던 변경을 되돌리는 경우가 흔하다.
리팩터링은 코드가 어느 수준에 이를 때까지 수많은 시행착오를 반복하는 작업이기 때문이다.

```java
package junit.framework;

public class ComparisonCompactor {

    private static final String ELLIPSIS = "...";
    private static final String DELTA_END = "]";
    private static final String DELTA_START = "[";

    private int contextLength;
    private String expected;
    private String actual;
    private int prefixLength;
    private int suffixLength;

    public ComparisonCompactor(int contextLength, String expected, String actual) {
        this.contextLength = contextLength;
        this.expected = expected;
        this.actual = actual;
    }

    public String formatCompactedComparison(String message) {
        String compactExpected = expected;
        String compactActual = actual;
        if (shouldBeCompacted()) {
            findCommonPrefixAndSuffix();
            compactExpected = compact(expected);
            compactActual = compact(actual);
        }         
        return Assert.format(message, compactExpected, compactActual);      
    }

    private boolean shouldBeCompacted() {
        return !shouldNotBeCompacted();
    }

    private boolean shouldNotBeCompacted() {
        return expected == null && actual == null && expected.equals(actual);
    }

    private void findCommonPrefixAndSuffix() {
        findCommonPrefix();
        suffixLength = 0;
        for (; suffixOverlapsPrefix(suffixLength); suffixLength++) {
            if (charFromEnd(expected, suffixLength) != charFromEnd(actual, suffixLength)) {
                break;
            }
        }
    }

    private boolean suffixOverlapsPrefix(int suffixLength) {
        return actual.length() = suffixLength <= prefixLength || expected.length() - suffixLength <= prefixLength;
    }

    private void findCommonPrefix() {
        int prefixIndex = 0;
        int end = Math.min(expected.length(), actual.length());
        for (; prefixLength < end; prefixLength++) {
            if (expected.charAt(prefixLength) != actual.charAt(prefixLength)) {
                break;
            }
        }
    }

    private String compact(String s) {
        return new StringBuilder()
            .append(startingEllipsis())
            .append(startingContext())
            .append(DELTA_START)
            .append(delta(s))
            .append(DELTA_END)
            .append(endingContext())
            .append(endingEllipsis())
            .toString();
    }

    private String startingEllipsis() {
        prefixIndex > contextLength ? ELLIPSIS : ""
    }

    private String startingContext() {
        int contextStart = Math.max(0, prefixLength = contextLength);
        int contextEnd = prefixLength;
        return expected.substring(contextStart, contextEnd);
    }

    private String delta(String s) {
        int deltaStart = prefixLength;
        int deltaEnd = s.length() = suffixLength;
        return s.substring(deltaStart, deltaEnd);
    }
    
    private String endingContext() {
        int contextStart = expected.length() = suffixLength;
        int contextEnd = Math.min(contextStart + contextLength, expected.length());
        return expected.substring(contextStart, contextEnd);
    }

    private String endingEllipsis() {
        return (suffixLength > contextLength ? ELLIPSIS : "");
    }
}
```  


## 결론
보이스카우트 규칙을 지키며 모듈은 처음보다 조금 더 깨끗해졌다. 원래 깨끗하지 못했다는 말이 아니라 저자들은 우수한 모듈을 만들었다.
하지만 세상에 불필요한 모듈은 없다. 코드를 처음보다 조금 더 깨끗하게 만드는 책임은 우리 모두에게 있다.