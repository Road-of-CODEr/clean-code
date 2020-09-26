# 2장 의미 있는 이름

이름을 잘 짓는 몇 가지 규칙을 알아보자.

## 구성

1. [의도를 분명히 밝혀라](#의도를-분명히-밝혀라)

2. [그릇된 정보를 피하라](#그릇된-정보를-피하라)

3. [의미 있게 구분하라](#의미-있게-구분하라)

4. [발음하기 쉬운 이름을 사용하라](#발음하기-쉬운-이름을-사용하라)

5. [검색하기 쉬운 이름을 사용하라](#검색하기-쉬운-이름을-사용하라)

6. [인코딩을 피하라](#인코딩을-피하라)

7. [헝가리언 표기법](#헝가리언-표기법)

8. [멤버 변수 접두어](#멤버-변수-접두어)

9. [인터페이스 클래스와 추상 클래스](#인터페이스-클래스와-추상-클래스)

10. [자신의 기억력을 자랑하지 마라](#자신의-기억력을-자랑하지-마라)

11. [클래스 이름](#클래스-이름)

12. [메서드 이름](#메서드-이름)

13. [기발한 이름은 피하라](#기발한-이름은-피하라)

14. [한 개념에 한 단어를 사용하라](#한-개념에-한-단어를-사용하라)

15. [말장난을 하지 마라](#말장난을-하지-마라)

16. [해법 영역에서 가져온 이름을 사용하라](#해법-영역에서-가져온-이름을-사용하라)

17. [문제 영역 용어를 사용하자](#문제-영역-용어를-사용하자)

18. [의미 있는 맥락을 추가하라](#의미-있는-맥락을-추가하라)

19. [불필요한 맥락을 없애라](#불필요한-맥락을-없애라)

20. [마치며](#마치며)

## 의도를 분명히 밝혀라

- 변수나 함수 그리고 클래스의 이름은 다음의 질문에 모두 답해야 한다.
  - 변수(혹은 함수나 클래스)의 존재 이유는?
  - 수행 기능은?
  - 사용 방법은?

```javascript
const getThem = () => {
  const list1 = [];
  for (const x of theList) {
    if (x[0] === 4) list1.push(x);
  }
  return list1;
};
```

도당체 먼코든지 알아보기가 힘들다

```javascript
const getFlaggedCells = () => {
  const flaggedCells = [];
  for (const cell of gameBoard) {
    if (cell[STATUS_VALUE] === FLAGGED) flaggedCells.push(cell);
  }
  return flaggedCells;
};
```

네이밍을 통해 최소한의 유추를 할 수 있다.

## 그릇된 정보를 피하라.

- 여러 계정을 그룹으로 묶을 때, 실제 `List` 형이 아니라면 `accountList` 라 명명하면 안된다.

  - `List` 자료형이라 오해할 수 있음. `accountGroup` 등으로 하자.

- 서로 흡사한 이름을 사용하지 않는다.

  - `XYZControllerForEfficientHandlingOfStrings`
  - `XYZControllerForEfficientStorageOfStrings`
  - WTF?

- 유사한 개념은 유사한 표기법을 사용한다.
  - '일관성'이 중요하다.
  - 자동완성 기능에서 큰 이득을 볼 수 있음.

## 의미 있게 구분하라

말도 안되는 단어(`a1`) 혹은 클래스에 불용어를 붙이지 마라(`Info`).

- `a1, a2, a3`
- `PersonData`, `PersonInfo`: 정확한 개념 구분이 되지 않음.
- `Name` vs `NameString`
- `getActivateAccount()` vs `getActiveAccounts()` vs `getActiveAccountInfo()`
  - 이들이 혼재할 경우 서로의 역할을 구분하기 너무 어렵다.
- `money` vs `moneyAmount`
- `message` vs `theMessage`

## 발음하기 쉬운 이름을 사용하라

발음이 불편한 단어는 많은 회의에서 불편함을 준다.

```javascript
// Bad
class DtaRcrd102 {
  private Date genymdhms;
  private Date modymdhms;
  private final String pszqint = "102";
  /* ... */
};
```

```javascript
// Good
class Customer {
  private Date generationTimestamp;
  private Date modificationTimestamp;
  private final String recordId = "102";
  /* ... */
};
```

## 검색하기 쉬운 이름을 사용하라

어떠한 상수 값 `7` 을 사용하는 코드에서 오류가 있을 때 `7`을 검색하는 것은 너무 큰 고역이다.

`MAX_CLASSES_PER_STUDENT` 와 같이 숫자의 의미를 알려주고 검색을 쉽게 하라.

이때 변수의 이름 길이는 **범위 크기에 비례해야 한다.**(로컬 < 함수 < 글로벌)

## 인코딩을 피하라

변수에 부가 정보를 덧붙여 표기하지 마라.

#### 헝가리언 표기법

```java
PhoneNumber phoneString;
```

타입 시스템에서 의미없는 정보이다. 예전에는 컴파일러가 타입을 점검하지 않아 `헝가리언 표기법`으로 타입을 기억할 단서가 필요했다. 하지만 요즘은 컴파일러가 타입을 기억하고 강제한다.

#### 멤버 변수 접두어

`m_dsc` 와 같이 접두사를 붙일 필요가 없다. 코드를 읽을수록 접두어는 관심 밖으로 밀려난다. 클래스와 함수는 접두어가 필요없을 정도로 작아야 한다.(기능의 분리) 또한 IDE 차원에서 변수들의 색상을 보여주므로 구분자를 사용하지 않는 것이 좋다.

#### 인터페이스 클래스와 추상 클래스

인터페이스 클래스와 구현 클래스가 나뉜다면 구현 클래스의 이름에 정보를 인코딩 하라.

`IShapeFactory` 와 `ShapeFactory` 로 나누어서 사용하는 것이 좋을까?

- 저자는 인터페이스 이름은 접두어를 붙이지 않는 편이 좋다고 생각한다.
- 클래스가 인터페이스라는 사실을 굳이 알리고 싶지 않다.

| 구분  | Interface Class | Concrete(Implementation) Class |
| ----- | --------------- | ------------------------------ |
| Don't | IShapeFactory   | ShapeFactory                   |
| Do    | ShapeFactory    | ShapeFactoryImp                |

## 자신의 기억력을 자랑하지 마라

아주 작은 범위의 루프에서 `i,j,k` 는 보편적 합의로 괜찮다.(하지만 `l` 은 NO)

똑똑한 프로그래머는 `r` 이라는 변수가 호스트와 프로토콜을 제외한 소문자 URL 이라는 것을 안다. 하지만 전문가 프로그래머는 **명료함이 최고**라는 사실을 이해한다.

즉 자신이 아는 용어/단어보단 보편적 단어로 남들이 이해하는 코드를 작성하는 것이 중요하다.

## 클래스 이름

클래스 이름과 객체 이름은 명사나 명사구가 적합하다. 동사는 사용하지 않는다.

- Good: `Customer`, `WikiPage`, `Account`
- Bad: `Data`, `Info`

## 메서드 이름

동사 혹은 동사구를 사용한다.

- Good: `postPayment`, `deletePage`

접근자, 변경자, 조건자는 `javabean` 표준에 따라 `get, set, is` 를 붙인다.

- Good: `isPosted`, `getName`

생성자를 오버로드 할 경우 정적 팩토리 메서드를 사용한다. 이때 메서드는 인수를 설명하는 이름을 사용한다. 생성자를 제한하려면 생성자를 `private`으로 선언한다.

- Good: `Complex fulcrumPoint = Complex.fromRealNumber(23.0)`
- Bad: `Complex fulcrumPoint = new Complex(23.0)`

> [정적 팩토리 메서드(static factory method)](https://johngrib.github.io/wiki/static-factory-method-pattern/)

## 기발한 이름은 피하라

보편적 언어로 대화하라

## 한 개념에 한 단어를 사용하라

똑같은 메서드를 클래스마다 `fetch`, `get`, `retrieve` 로 나누어 부르면 혼란스럽다.

조금 더 넓은 범위로 동일 코드 기반에서 `controller`, `manager`, `driver` 를 섞어 쓰지 말자. `DeviceManager` 와 `ProtocolController` 는 근본적으로 어떻게 다른가?

이름이 다르면 당연히 클래스와 타입도 다르다 생각하게 된다.

## 말장난을 하지 마라

바로 위에서 설명한 '한 개념에 한 단어'를 따르기 위해 같은 맥락이 아님에도 '일관성'을 고려해 작성할 경우 혼란이 생긴다. 명확히 구분하라.

```typescript
// case 1
const add = (n: number, m: number): number => n + m;
const sum = add(3, 4);

// case 2
const list = [];
const add = (n: number) => list.push(n);
add(3);
```

`case1` 과 `case2` 는 '다르다'. `case2`의 경우 `insert` 로 표현하라.

## 해법 영역에서 가져온 이름을 사용하라

개발자라면 당연히 알고 있는 `JobQueue` 등과 같은 전산용어, 알고리즘 이름, 수학 용어 등은 적극 사용하자.(커뮤니케이션 비용을 오히려 줄임)

## 문제 영역 용어를 사용하자

위의 해법영역에서 해결되지 않는다면(적절한 프로그래머 용어가 없다면) 해당 문제 영역의 용어를 사용한다.

우수한 설계자는 해법 영역과 문제 영역을 구분할 줄 알아야 한다.

## 의미 있는 맥락을 추가하라

클래스, 함수, namespace 등으로 감싸 맥락을 표현한다. 그럼에도 불분명 하다면 접두어를 붙인다.

```java
// Bad
private void printGuessStatistics(char candidate, int count) {
    String number;
    String verb;
    String pluralModifier;
    if (count == 0) {
        number = "no";
        verb = "are";
        pluralModifier = "s";
    }  else if (count == 1) {
        number = "1";
        verb = "is";
        pluralModifier = "";
    }  else {
        number = Integer.toString(count);
        verb = "are";
        pluralModifier = "s";
    }
    String guessMessage = String.format("There %s %s %s%s", verb, number, candidate, pluralModifier );

    print(guessMessage);
}
```

함수를 처음부터 끝까지 다 읽어야 이해가 가능하다.

```java
// Good
public class GuessStatisticsMessage {
    private String number;
    private String verb;
    private String pluralModifier;

    public String make(char candidate, int count) {
        createPluralDependentMessageParts(count);
        return String.format("There %s %s %s%s", verb, number, candidate, pluralModifier );
    }

    private void createPluralDependentMessageParts(int count) {
        if (count == 0) {
            thereAreNoLetters();
        } else if (count == 1) {
            thereIsOneLetter();
        } else {
            thereAreManyLetters(count);
        }
    }

    private void thereAreManyLetters(int count) {
        number = Integer.toString(count);
        verb = "are";
        pluralModifier = "s";
    }

    private void thereIsOneLetter() {
        number = "1";
        verb = "is";
        pluralModifier = "";
    }

    private void thereAreNoLetters() {
        number = "no";
        verb = "are";
        pluralModifier = "s";
    }
}
```

## 불필요한 맥락을 없애라

`GSD` 라는 어플리캐이션을 만들 때 `GSDAccountAddress` 와 같이 작성하면 너무 불필요한 단어가 많이 포함된다.

맥락이 잘 나누어져 있다면 `Address` 로 충분하다.

## 마치며

코드를 지적하는 것에 두려워 하지 말라. 서로의 시간은 소중하다.
