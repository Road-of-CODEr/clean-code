# 10장 클래스

깨끗한 클래스를 어떻게 만들까? 🍡  

## 구성

1. [클래스 체계](#클래스 체계)
2. [클래스는 작아야 한다](#클래스는 작아야 한다)
3. [변경하기 쉬운 클래스](#변경하기 쉬운 클래스)



## 클래스 체계

클래스를 정의하는 표준이 정해져 있다  

책에 있는 내용은 Java 위주로 설명이 많더라구요  

Java를 주로 사용하시는 분들은 아시겠지만, Javascript 개발자 분들도 계시니 한번 설명해드릴게요  

```java
public class Library {
  // static (정적 변수 먼저) -> 인스턴스 변수 -> 생성자 -> 메서드
  public static final int NUMBER = 1;
	private static final String NAME = "huisam";
  
  // 순서는 public -> package-private -> protected -> private 순
  protected final String book;
  private final int price;
  
  public Library() {}
  
  public String getAuthorBy(String book) {
   	return "author";
  }
}
```

요렇게 작성하는 것이 기본 표준입니다  

그래서 코드가 마치 신문기사처럼 위에서부터 아래로 읽혀지는 것이죠 

> 사실 별로 동의 못하겠습니다. 신문기사는 무슨

#### 캡슐화

사실 클래스를 설계할 때 제일 중요한 것은 `캡슐화`입니다  

최대한 공개하지 않는 것이죠  

하지만 테스트를 진행하다보면 정말 어쩔수 없이 `캡슐화`를 무너뜨려야 하는 상황이 올 수도 있어요  

이런 상황이 온다면?  

꼭 내가 **설계한 코드가 잘못된 것**이 아닌지 한번 더 생각하고, `캡슐화`를 신중하게 무너뜨려야 합니다   

> 예를 들면 private -> protected 아니면 package-private 으로요.!

## 클래스는 작아야 한다

클래스는 만들 때 최대한 작아야 한다  

> 사실 되게 애매하죠? 뭐 얼마나 작아야되고, 무슨 클래스에 Line 제한을 두라는 것도 아니고

기본적으로 `작게` 라는 말은, **클래스가 맡은 책임을 적게 가져가라** 라는 의미입니다  

```java
public class SuperDashBoard extends JFrame implements MetaDataUser {
  public String getCustomizerLanguagePath();
  public String getSystemConfigDocument();
  public boolean getGuruState();
  public boolean getNoviceState();
  public int getMajorVersionNumber();
  public int getMinorVersionNumber();
  public int getBuildNumber();
  ... etc
} // 아래 생략
```

벌써부터 혼란스럽습니다😱  

이름부터 혼란스럽네요 **SuperDashBoard** 라뇨 ㅋㅋㅋㅋ

저희 중에는 이렇게 하시는 분이 없으리라 굳게 믿고 있습니다  

그래서 책에서는 클래스를 설명할 때

```text
만일("if"), 그리고("and") -(하)며("or"), 하지만("but")을 사용하지 않고
25단어 내외로 가능해야 합니다
```

라고 설명하고 있습니다  

그만큼 단일책임원칙(SRP)를 꼭 지키라는 의미죠

### 단일책임원칙(SRP)

사실 이 원칙도 [이 게시글 설명](https://huisam.tistory.com/entry/SRP)을 강추드립니다

> 누가 설명했는지는 몰라도 참 잘되어있네요 ㅎㅎ

`SRP`는 **클래스나 모듈을 변경할 이유가 하나, 단 하나뿐**이어야 한다는 원칙입니다  

그래서 위와 같은 `SuperDashBoard`에서 아래 클래스로 파생되어야 한다는 것이죠   

```java
public class Version {
  public int getMajorVersionNumber();
  public int getMinorVersionNumber();
  public int getBuildNumber();
}
```

흔히 현업에서 일하다보면 많은 개발자들이 어기는 원칙중에 하나입니다  

대다수의 사람들은 `깨끗하고 체계적인 소프트웨어` 보다 `돌아가는 소프트웨어` 에 초점을 맞추기 때문이죠  

그러니까 저희만큼은 꼭 원칙을 지켰으면 좋겠어요🙏

`SRP`를 지키고 싶지 않은 반대파들은 이렇게 말합니다  

```text
단일 책임 클래스가 많아지면 큰 그림을 이해하기가 어렵다
큰 그림을 이해하려면 이 클래스 저 클래스를 수없이 넘나들어야 된다
```

하지만 그저 변명에 불과합니다.  

어차피 거대한 시스템이 돌아가기 위해서는 **다양한 도구가 서로 협력**해야 되고,  

**최종적인 부품의 수는 비슷하기 때문이죠**  

그래서 이분들께는 이렇게 말하면 됩니다  

```text
도구 상자를 어떻게 관리하고 싶으신가요?
작은 서랍을 많이 두고 기능과 이름이 명확한 컴포넌트를 나눠 넣고 싶으신가요?
혹은 큰 서랍 몇 개를 두고 모두 던져 넣고 싶으신가요?
```

꼭 다시 말씀드리고 싶습니다  

:white_check_mark: **큰 클래스 몇 개가 아니라 작은 클래스 여럿으로 이뤄진 시스템이 더 바람직하다**  

:white_check_mark: ​**작은 클래스는 각자 맡은 책임이 하나며, 변경할 이유가 하나며, 다른 작은 클래스와 협력해 시스템에 필요한 동작을 수행합니다**. 

### 응집도(Cohesion)

클래스의 인스턴스 변수 수가 작아야 합니다  

클래스에서 메서드가 인스턴스 변수를 많이 사용할 수록 응집도가 높은 설계라 볼 수 있죠!  

그래서 **응집도가 높다는 말은 클래스에 속한 메서드와 변수가 서로 의존하며 논리적인 단위로 묶인다는 의미** 입니다!!

```java
public class Stack {
  private int topOfStack = 0;
  List<Integer> elements = new LinkedList<>();
  
  public int size() {
    return topOfStack;
  }
  
  public void push(int element) {
    topOfStack++;
    elements.add(element);
  }
  
  public int pop() throws PoppedWhenEmpty {
    if (topOfStack == 0) {
      throw new PoppedWhenEmpty();
    }
    
    int element = elements.get(--topOfStack);
    elements.remove(topOfStack);
    return element;
  }
}
```

위와 같은 클래스는 모든 메서드에 모든 인스턴스 변수가 사용되고 있는  

아주 바람직한 응집도 높은 클래스라 볼 수 있죠!

응집도가 높은 클래스를 설계하기 위해서는 다음과 같은 원칙을 지키면 됩니다  

```text
함수를 작게, 매개변수 목록을 짧게
```

그렇게 하다보면 클래스를 계속 쪼개고 쪼개야 되기 때문이죠.!  

한번 제약을 두고 코딩해보시는 것을 추천해요   

```text
1. 메서드의 인덴트는 depth 가 2이하로 해야 된다 (if문 하나 => depth 1)
2. 메서드의 총 길이는 15줄 이내어야 한다
3. 클래스의 인스턴스 변수는 오로지 1개만 허용한다
```

연습하다 보면 본인의 설계능력이 많이 올라가는 것을 느낄 것입니다 ㅎㅎ  

실제 책에서는 연습 예제가 있는데  한번 링크 :computer: 로 같이 가볼게요~!  

1. [리팩토링 전](https://github.com/ludwiggj/CleanCode/blob/master/src/clean/code/chapter10/original/PrintPrimes.java)
2. 리팩토링 후
   1. [PrimePrinter](https://github.com/ludwiggj/CleanCode/blob/master/src/clean/code/chapter10/refactored/PrimePrinter.java)
   2. [RowColumnPagePrinter](https://github.com/ludwiggj/CleanCode/blob/master/src/clean/code/chapter10/refactored/RowColumnPagePrinter.java)
   3. [PrimeGenerator](https://github.com/ludwiggj/CleanCode/blob/master/src/clean/code/chapter10/refactored/PrimeGenerator.java)

요약하자면. 

1. `PrimePrinter`는 main 함수만 포함하며 실행 환경을 책임집니다
2. `RowColumnPagePrinter`는 숫자 목록을 주어진 행과 열에 맞춰 페이지에 출력하는 방법을 책임집니다
3. `PrimeGenerator`는 소수 목록을 생성하는 방법을 책임집니다

위와 같은 리팩토링을 진행하기 위해서는  

반드시 **테스트 코드**가 있어야 하고, 테스트 코드를 바탕으로 `SRP` 를 준수한 코드로 진행하면 됩니다

가끔 `리팩토링`이 되게 잡일 같다고 느끼시는 분들이 있으실 겁니다

> 사실 잡일 맞습니다. 되게 복잡하고 고단할 수도 있거든요

저는 회사에 있으면서 많이 리팩토링을 진행했지만, 하면서 느꼈던 것은

```text
지금 고생해서 바꾼 결과가, 앞으로 더 고생할 시간을 단축시켜줍니다
```

라는 결론이었습니다~!  

여러분들도 꼭 실천하면 좋겠네요👍   

## 변경하기 쉬운 클래스

대다수의 시스템은 지속적인 변경이 가해지기 때문에 변경하기 쉬운 클래스를 설계해야 됩니다  

새로운 기능이 추가되어야 하는데, 아래와 같은 클래스가 있으면 어떻게 하실 건가요?

```java
public class Sql {
  public Sql(String table, Column[] columns);
  public String create();
  public String insert(Object[] fields);
  public String selectAll();
  public String findByKey(String keyColumn, String keyValue);
  public String select(Column column, String pattern);
  public String select(Criteria criteria);
  public String preparedInsert();
  private String columnList(Column[] columns);
  private String valuesList(Object[] fields, final Column[] columns);
  private String selectWithCriteria(String criteria);
  private String placeholderList(Column[] columns);
}
```

> 저 같은 경우는 일단 한숨💭 부터 쉬고 시작합니다

어떤점이 참 암담하게 느껴질까요?  

`selectWithCriteria` 라는 private 메서드는 select에서만 사용되고 있는데,  

보통 경험상 이러한 private 메서드는 코드를 개선할 잠재적인 여지를 시사하는 편입니다. 

> 관심사가 select에 한정되어 있기 때문이죠.

그래서 우리는 `SRP` 와 `OCP`를 지키기 위해서 쪼개고 또 쪼개야 합니다

> 잠깐 [OCP](https://huisam.tistory.com/entry/OCP)란?  
>
> 확장에 개방적이고, 수정에 폐쇄적이어야 한다는 원칙

```java
abstract public class Sql {
   public Sql(String table, Column[] columns) {};
   abstract public String generate();
}

class CreateSql extends Sql {
   public CreateSql(String table, Column[] columns) { super(table, columns); }
   @Override public String generate() { return ""; }
}

class SelectSql extends Sql {
   public SelectSql(String table, Column[] columns) { super(table, columns); }
   @Override public String generate() { return ""; }
}

class InsertSql extends Sql {
   public InsertSql(String table, Column[] columns, Object[] fields) { super(table, columns); }
   @Override public String generate() { return ""; }
   private String valuesList(Object[] fields, final Column[] columns) { return ""; }
}

class SelectWithCriteriaSql extends Sql {
   public SelectWithCriteriaSql(
      String table, Column[] columns, Criteria criteria) { super(table, columns); }
   @Override public String generate() { return ""; }
}

class SelectWithMatchSql extends Sql {
   public SelectWithMatchSql(
      String table, Column[] columns, Column column, String pattern) { super(table, columns); }
   @Override public String generate() { return ""; }
}

class FindByKeySql extends Sql {
   public FindByKeySql(
      String table, Column[] columns, String keyColumn, String keyValue) { super(table, columns); }
   @Override public String generate() { return ""; }
}

class PreparedInsertSql extends Sql {
   public PreparedInsertSql(String table, Column[] columns) { super(table, columns); }
   @Override public String generate() {return ""; }
   private String placeholderList(Column[] columns) { return ""; }
}

class Where {
   public Where(String criteria) {}
   public String generate() { return ""; }
}

class ColumnList {
   public ColumnList(Column[] columns) {}
   public String generate() { return ""; }
}
```

이렇게 쪼개개되면 관심사 별로 기능추가하기가 정말 쉽습니다  

Update 문이 추가된다면?  

**UpdateSql 을 상속받아서 구현만 하면 되기 때문이죠**  

> 아까 슈퍼 클래스 Sql 에서는?  
>
> 메서드 하나씩 다 살펴보면서 어디다 추가해야 되지.... 한참을 고민해야 합니다

이렇게 쪼개고 쪼갤수록 변화에 유동적인 시스템을 만들 수 있습니다!!  

### 변경으로부터 격리

상세한 구현에 의존하는 클라이언트 클래스는 구현이 바뀌면 위험에 빠집니다  

또한 상세한 구현에 의존하는 코드는 테스트가 어렵죠  

한번 예시를 들어볼까요  

`Portfolio` 라는 클래스를 만들고 싶은데, 이 클래스는 **외부 API를 사용**해 포트폴리오 값을 계산합니다  

그리고 이 외부 API는 5분마다 시세 바뀐다고 가정해볼까요?  

그렇다면 우리의 테스트 코드는 외부 API의 시세 변화에 영향을 받겠죠  

이럴때는 **직접 외부 인터페이스(API)에 의존하지 않고, Stock(or Mock)**을 만들어주면 쉽습니다  

```java
interface StockExchange {
  Money currentPrice(String symbol);
}
```

위와 같은 인터페이스를 만들고, `Portfolio` 객체에 의존성주입을 해주는 방법이죠.!  

```java
public Portfolio {
  private StockExchange stockExchange;
  
  public Portfolio(StockExchange stockExchange) {
    this.stockExchange = stockExchange;
  }
  // ...
}
```

그렇다면 테스트가 쉬워집니다  

```java
public class PortfolioTest {
  private StockExchange exchange;
  private Portfolio portfolio;
  
  @Before
  protected void setUp() throws Exception {
    exchange = new FixedStockExchangeStub();
    exchange.fix("MSFT", 100);
    portfolio = new Portfolio(exchange);
  }
  
  @Test
  public void GivenFiveMSFTTotalShouldBe500() throws Exception {
    portfolio.add(5, "MSFT");
    assertThat(portfolio.value()).isEqualTo(500)
  }
}
```

요렇게 말이죠.!  

이 원칙이 바로 [DIP(Dependency Inversion Principle)](https://huisam.tistory.com/entry/DIP) 입니다

> 추상화는 상세한 구현이 아니라 추상화에 의존해야 한다는 원칙입니다  

결국에 우리가 객체지향 원칙들을 지키면 지킬수록  

```text
유연성과 재사용성이 높아지고, 응집도가 높은 클래스를 설계할 수 있다
```

라는 결론에 도달하게 되었군요 ㅎㅎ  

고생하셨습니다 :)