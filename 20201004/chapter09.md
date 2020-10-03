# 단위 테스트

## 구성

- [단위 테스트](#단위-테스트)
  - [구성](#구성)
  - [TDD 법칙 세 가지](#tdd-법칙-세-가지)
  - [깨끗한 테스트 코드 유지하기](#깨끗한-테스트-코드-유지하기)
    - [테스트는 유연성, 유지보수성, 재사용성을 제공한다](#테스트는-유연성-유지보수성-재사용성을-제공한다)
  - [깨끗한 테스트 코드](#깨끗한-테스트-코드)
    - [이중 표준](#이중-표준)
  - [테스트 당 assert 하나](#테스트-당-assert-하나)
    - [테스트당 개념 하나](#테스트당-개념-하나)
  - [F.I.R.S.T](#first)
  - [결론](#결론)

## TDD 법칙 세 가지

요즘엔 TDD가 실제 코드를 짜기 전에 단위 테스트부터 짜라고 요구한다는 사실을 모르는 사람은 없으리라. 하지만 이 규칙은 빙산의 일각에 불과하다. 다음 세 가지 법칙을 살펴보자.

1. 실패하는 단위 테스트를 작성할 때까지 실제 코드를 작성하지 않는다.
2. 컴파일은 실패하지 않으면서 실행이 실패하는 정도로만 단위 테스트를 작성한다.
3. 현재 실패하는 테스트를 통과할 정도로만 실제 코드를 작성한다.

위 세 가지 규칙을 따르면 개발과 테스트가 대략 30초 주기로 묶인다. 테스트 코드와 실제 코드가 함께 나올뿐더러 테스트 코드가 실제 코드보다 불과 몇 초 전에 나온다.

이렇게 일하면 매일 수십 개, 매달 수백 개, 매년 수천 개에 달하는 테스트 케이스가 나온다. 실제 코드를 사실상 전부 테스트하는 테스트 케이스가 나온다. 하지만 실제 코드와 맞먹을 정도로 방대한 테스트 코드는 심각한 관리 문제를 유발하기도 한다.

## 깨끗한 테스트 코드 유지하기

테스트 코드가 지저분하면 할수록 변경하기 어려워진다. 이 경우 실제 코드를 짜는 시간보다 테스트 케이스를 추가하는 시간이 더 걸리기 십상이다.

실제 코드를 변경해 기존 테스트 케이스가 실패하기 시작하면, 지저분한 코드로 인해 실패하는 테스트 케이스를 점점 더 통과시키기 어려워진다. 그래서 테스트 코드는 계속해서 늘어나는 부담이 되버린다.

새 버전을 출시할 때마다 팀이 테스트 케이스를 유지하고 보수하는 비용도 늘어난다. 점차 테스트 코드는 개발자 사이에서 가장 큰 불만으로 자리잡게 되고, 관리자가 예측값이 너무 큰 이유를 물어보면 팀은 테스트 코드를 비난한다. 결국 테스트 슈트를 폐기하지 않으면 안 되는 상황에 처한다.

의도하지 않은 결함 수가 많아지면 개발자는 변경을 주저한다. 변경하면 득보다 해가 크다 생각해 더 이상 코드를 정리하지 않는다. 그러면서 코드가 망가지기 시작한다. 결국 테스트 슈트도 없고, 얼기설기 뒤섞인 코드에, 좌절한 고객과, 테스트에 쏟아 부은 노력이 허사였다는 실망감만 남는다.

위 이야기에서 전하는 교훈은 다음과 같다. **테스트 코드는 실제 코드 못지 않게 중요하다.** 테스트 코드는 이류 시민이 아니다. 테스트 코드는 사고와 설계와 주의가 필요하다. 실제 코드 못지 않게 깨끗하게 짜야 한다.

### 테스트는 유연성, 유지보수성, 재사용성을 제공한다

코드에 유연성, 유지보수성, 재사용성을 제공하는 버팀목이 바로 단위 테스트다. 

테스트 케이스가 있으면 변경이 두렵지 않으니까! 테스트 케이스가 없다면 모든 변경이 잠정적인 버그다. 아키텍쳐가 아무리 유연하더라도, 설계를 아무리 잘 나눴더라도, 테스트 케이스가 없으면 개발자는 변경을 주저한다. 버그가 숨어들까 두렵기 때문이다.

그러므로 실제 코드를 점검하는 자동화된 단위 테스트 슈트는 설계와 아키텍쳐를 최대한 깨끗하게 보존하는 열쇠다. 테스트는 유연성, 유지보수성, 재사용성을 제공한다. **테스트 케이스가 있으면 변경이 쉬워지기** 때문이다.

따라서 테스트 코드가 지저분하면 코드를 변경하는 능력이 떨어지며 코드 구조를 개선하는 능력도 떨어진다. 테스트 코드가 지저분할수록 실제 코드도 지저분해진다. 결국 테스트 코드를 잃어버리고 실제 코드도 망가진다.

## 깨끗한 테스트 코드

깨끗한 테스트 코드는 세 가지가 필요하다. **가독성, 가독성, 가독성**

테스트 코드는 최소의 표현으로 많은 것을 나타내야 한다.

```java
// BAD
public void testGetPageHieratchyAsXml() throws Exception {
  crawler.addPage(root, PathParser.parse("PageOne"));
  crawler.addPage(root, PathParser.parse("PageOne.ChildOne"));
  crawler.addPage(root, PathParser.parse("PageTwo"));

  request.setResource("root");
  request.addInput("type", "pages");
  Responder responder = new SerializedPageResponder();
  SimpleResponse response =
    (SimpleResponse) responder.makeResponse(new FitNesseContext(root), request);
  String xml = response.getContent();

  assertEquals("text/xml", response.getContentType());
  assertSubString("<name>PageOne</name>", xml);
  assertSubString("<name>PageTwo</name>", xml);
  assertSubString("<name>ChildOne</name>", xml);
}

public void testGetPageHieratchyAsXmlDoesntContainSymbolicLinks() throws Exception {
  WikiPage pageOne = crawler.addPage(root, PathParser.parse("PageOne"));
  crawler.addPage(root, PathParser.parse("PageOne.ChildOne"));
  crawler.addPage(root, PathParser.parse("PageTwo"));

  PageData data = pageOne.getData();
  WikiPageProperties properties = data.getProperties();
  WikiPageProperty symLinks = properties.set(SymbolicPage.PROPERTY_NAME);
  symLinks.set("SymPage", "PageTwo");
  pageOne.commit(data);

  request.setResource("root");
  request.addInput("type", "pages");
  Responder responder = new SerializedPageResponder();
  SimpleResponse response =
    (SimpleResponse) responder.makeResponse(new FitNesseContext(root), request);
  String xml = response.getContent();

  assertEquals("text/xml", response.getContentType());
  assertSubString("<name>PageOne</name>", xml);
  assertSubString("<name>PageTwo</name>", xml);
  assertSubString("<name>ChildOne</name>", xml);
  assertNotSubString("SymPage", xml);
}

public void testGetDataAsHtml() throws Exception {
  crawler.addPage(root, PathParser.parse("TestPageOne"), "test page");

  request.setResource("TestPageOne"); request.addInput("type", "data");
  Responder responder = new SerializedPageResponder();
  SimpleResponse response =
    (SimpleResponse) responder.makeResponse(new FitNesseContext(root), request);
  String xml = response.getContent();

  assertEquals("text/xml", response.getContentType());
  assertSubString("test page", xml);
  assertSubString("<Test", xml);
}
```

예를 들어, PathParser 호출을 살펴보자. PathParser는 문자열을 pagePath 인스턴스로 변환한다. 이 코드는 테스트와 무관하며 테스트 코드의 의도만 흐린다. responder 객체를 생성하는 코드와 response를 수집해 변환하는 코드 역시 잡음에 불과하다. 게다가 resource와 인수에서 요청 URL을 만드는 어설픈 코드도 보인다.

마지막으로 위 코드는 읽는 사람을 고려하지 않는다. 불쌍한 독자들은 온갖 잡다하고 무관한 코드를 이해한 후라야 간신히 테스트 케이스를 이해한다.

```java
// GOOD
public void testGetPageHierarchyAsXml() throws Exception {
  makePages("PageOne", "PageOne.ChildOne", "PageTwo");

  submitRequest("root", "type:pages");

  assertResponseIsXML();
  assertResponseContains(
    "<name>PageOne</name>", "<name>PageTwo</name>", "<name>ChildOne</name>");
}

public void testSymbolicLinksAreNotInXmlPageHierarchy() throws Exception {
  WikiPage page = makePage("PageOne");
  makePages("PageOne.ChildOne", "PageTwo");

  addLinkTo(page, "PageTwo", "SymPage");

  submitRequest("root", "type:pages");

  assertResponseIsXML();
  assertResponseContains(
    "<name>PageOne</name>", "<name>PageTwo</name>", "<name>ChildOne</name>");
  assertResponseDoesNotContain("SymPage");
}

public void testGetDataAsXml() throws Exception {
  makePageWithContent("TestPageOne", "test page");

  submitRequest("TestPageOne", "type:data");

  assertResponseIsXML();
  assertResponseContains("test page", "<Test");
}
```

[BUILD-OPERATE-CHECK 패턴](http://www.fitnesse.org/FitNesse.FullReferenceGuide.UserGuide.WritingAcceptanceTests.AcceptanceTestPatterns.BuildOperateCheck)(기능 별로 코드 정리)이 위와 같은 테스트 구조에 적합하다. 각 테스트는 명확히 세 부분으로 나눠진다. 

첫 부분은 테스트 자료를 만든다. 두 번째 부분은 테스트 자료를 조작하며, 세 번째 부분은 조작한 결과가 올바른지 확인한다.

**잡다하고 세세한 코드를 거의 다 없앤다는 것에 주목**한다. 테스트 코드는 본론에 돌입해 필요한 자료 유형과 함수만 사용한다.

코드를 읽는 사람이 세세한 코드에 시간을 허비하게 하지 마라.

### 이중 표준

테스트 API코드에 적용하는 표준은 실제 코드에 적용하는 표준과 확실히 다르다. 단순하고, 간결하고, 표현력이 풍부해야 하지만, 실제 코드만큼 효율적일 필요는 없다.

```java
// BAD
@Test
public void turnOnLoTempAlarmAtThreashold() throws Exception {
  hw.setTemp(WAY_TOO_COLD); 
  controller.tic(); 
  assertTrue(hw.heaterState());   
  assertTrue(hw.blowerState()); 
  assertFalse(hw.coolerState()); 
  assertFalse(hw.hiTempAlarm());       
  assertTrue(hw.loTempAlarm());
}
```

위의 코드를 읽으면 점검하는 상태 이름과 상태 값을 확인하느라 눈길이 이리저리 흩어진다. `heaterState`라는 상태 이름을 확인하고 왼쪽으로 눈길을 돌려 `assertTrue`를 읽는다. 이런식으로 모든 state를 확인해야 하면 따분하고 미덥잖다. 

```java
// GOOD
@Test
public void turnOnCoolerAndBlowerIfTooHot() throws Exception {
  tooHot();
  assertEquals("hBChl", hw.getState()); 
}
  
@Test
public void turnOnHeaterAndBlowerIfTooCold() throws Exception {
  tooCold();
  assertEquals("HBchl", hw.getState()); 
}

@Test
public void turnOnHiTempAlarmAtThreshold() throws Exception {
  wayTooHot();
  assertEquals("hBCHl", hw.getState()); 
}

@Test
public void turnOnLoTempAlarmAtThreshold() throws Exception {
  wayTooCold();
  assertEquals("HBchL", hw.getState()); 
}

public String getState() {
  String state = "";
  state += heater ? "H" : "h"; 
  state += blower ? "B" : "b"; 
  state += cooler ? "C" : "c"; 
  state += hiTempAlarm ? "H" : "h"; 
  state += loTempAlarm ? "L" : "l"; 
  return state;
}
```

`StringBuffer`는 보기에 흉하다. 나는 실제 코드에서도 크게 무리가 아니라면 이를 피한다. 위의 코드는 `StringBuffer`를 안 써서 치르는 대가가 미미하다. 실제 환경에서는 문제가 될 수 있지만 테스트 환경은 자원이 제한적일 가능성이 낮기 때문이다.

이것이 이중 표준의 본질이다. 실제 환경에서는 절대로 안 되지만 테스트 환경에서는 전혀 문제없는 방식이 있다.(대개 메모리나 CPU 효율과 관련 있는 경우다.) **코드의 깨끗함과는 철저히 무관하다**.

## 테스트 당 assert 하나

JUnit으로 테스트 코드를 짤 때 함수마다 assert를 단 하나만 사용해야 한다고 주장하는 학파가 있다. 가혹하다 여길지 모르지만 확실히 장점이 있다. assert가 하나라면 결론이 하나기 때문에 코드를 이해하기 빠르고 쉽다.

하지만 앞에서 다룬 `testGetPageHierarchyAsXml` 의 예를 보자. "출력이 XML"이다 라는 `assert` 문과 "특정 문자열을 포함한다"는 `assert`문을 하나로 병합하는 방식이 불합리하다. 이 경우 테스트를 두 개로 쪼개 각자가 `assert`를 수행하면 된다.

```java
public void testGetPageHierarchyAsXml() throws Exception { 
  givenPages("PageOne", "PageOne.ChildOne", "PageTwo");
  
  whenRequestIsIssued("root", "type:pages");
  
  thenResponseShouldBeXML(); 
}

public void testGetPageHierarchyHasRightTags() throws Exception { 
  givenPages("PageOne", "PageOne.ChildOne", "PageTwo");
  
  whenRequestIsIssued("root", "type:pages");
  
  thenResponseShouldContain(
    "<name>PageOne</name>", "<name>PageTwo</name>", "<name>ChildOne</name>"
  ); 
}
```

위에서 함수 이름을 바꿔 [given-when-then](https://alexecollins.com/given-when-then-junit/) 이라는 관례를 사용했다는 사실에 주목한다. 그러면 테스트 코드를 읽기가 쉬워진다. **하지만 불행하게도 위에서 보듯이 테스트를 분리하면 중복되는 코드가 많아진다**.

[TEMPLATE METHOD 패턴](https://blog.naver.com/1ilsang/221159883959)을 사용하면 중복을 제거할 수 있다. given/when 부분을 부모 클래스에 두고 then 부분을 자식 클래스에 두면 된다. 아니면 완전히 독자적인 테스트 클래스를 만들어 @Before 함수에 given/when 부분을 넣고 @Test 함수에 then 부분을 넣어도 된다. 하지만 모두가 배보다 배꼽이 더 크다. 이것저것 감안해 보면 결국 앞에서 다룬 `testGetPageHierarchyAsXml` 처럼 assert 문을 여럿 사용하는 편이 좋다고 생각한다.

### 테스트당 개념 하나

어쩌면 "테스트 함수마다 한 개념만 테스트하라"는 규칙이 더 낫겠다. 이것저것 잡다한 개념을 연속으로 테스트하는 긴 함수는 피한다.

```java
// BAD
/**
 * addMonth() 메서드를 테스트하는 장황한 코드
 */
public void testAddMonths() {
  SerialDate d1 = SerialDate.createInstance(31, 5, 2004);

  SerialDate d2 = SerialDate.addMonths(1, d1); 
  assertEquals(30, d2.getDayOfMonth()); 
  assertEquals(6, d2.getMonth()); 
  assertEquals(2004, d2.getYYYY());
  
  SerialDate d3 = SerialDate.addMonths(2, d1); 
  assertEquals(31, d3.getDayOfMonth()); 
  assertEquals(7, d3.getMonth()); 
  assertEquals(2004, d3.getYYYY());
  
  SerialDate d4 = SerialDate.addMonths(1, SerialDate.addMonths(1, d1)); 
  assertEquals(30, d4.getDayOfMonth());
  assertEquals(7, d4.getMonth());
  assertEquals(2004, d4.getYYYY());
}
```

독자적인 개념 세 개를 테스트하므로 독자적인 테스트 세 개로 쪼개야 마땅하다. 이를 한 함수로 몰아넣으면 **독자가 각 절이 거기에 존재하는 이유와 각 절이 테스트하는 개념을 모두 이해해야 한다**.

가장 좋은 규칙은 "**개념 당 assert 문 수를 최소로 줄여라**"와 "**테스트 함수 하나는 개념 하나만 테스트하라**"라 하겠다.

## F.I.R.S.T

깨끗한 테스트는 다음 다섯 가지 규칙을 따르는데, 각 규칙에서 첫 글자를 따오면 FIRST가 된다.

1. 빠르게Fast:
테스트는 빨라야 한다. 테스트는 빨리 돌아야 한다는 말이다. 테스트가 느리면 자주 돌릴 엄두를 못 낸다. 자주 돌리지 않으면 초반에 문제를 찾아내 고치지 못한다. 코드를 마음껏 정리하지도 못한다. 결국 코드 품질이 망가지기 시작한다.

2. 독립적으로Independent:
각 테스트를 서로 의존하면 안 된다. 한 테스트가 다음 테스트가 실행될 환경을 준비해서는 안 된다. 각 테스트는 독립적으로 그리고 어떤 순서로 실행해도 괜찮아야 한다. 테스트가 서로에게 의존하면 하나가 실패할 때 나머지도 잇달아 실패하므로 원인을 진단하기 어려워지며 후반 테스트가 찾아내야 할 결함이 숨겨진다.

3. 반복가능하게Repeatable:
테스트는 어떤 환경에서도 반복 가능해야 한다. 실제 환경, QA 환경, 버스를 타고 집으로 가는 길에 사용하는 노트북 환경(네트워크가 연결되지 않은)에서도 실행할 수 있어야 한다. 테스트가 돌아가지 않는 환경이 하나라도 있다면 테스트가 실패한 이유를 둘러댈 변명이 생긴다. 게다가 환경이 지원되지 않기에 테스트를 수행하지 못하는 상황에 직면한다.

4. 자가검증하는Self-Validating:
테스트는 bool값으로 결과를 내야 한다. 성공 아니면 실패다. 통과 여부를 알리고 로그 파일을 읽게 만들어서는 안 된다. 통과 여부를 보려고 텍스트 파일 두 개를 수작업으로 비교하게 만들어서도 안 된다. 테스트가 스스로 성공과 실패를 가늠하지 않는다면 판단은 주관적이 되며 지루한 수작업 평가가 필요하게 된다.

6. 적시에Timely:
테스트는 적시에 작성해야 한다. 단위 테스트는 테스트하려는 실제 코드를 구현하기 직전에 구현한다. 실제 코드를 구현한 다음에 테스트 코드를 만들면 실제 코드가 테스트하기 어렵다는 사실을 발견할지도 모른다. 어떤 실제 코드는 테스트하기 너무 어렵다고 판명날지 모른다. 테스트가 불가능하도록 실제 코드를 설계할지도 모른다.

## 결론

이 장은 주제를 수박 겉핥기 정도로만 훑었다. 사실상 깨끗한 테스트 코드라는 주제는 책 한 권을 할애해도 모자랄 주제다. 

테스트 코드는 실제 코드만큼이나 프로젝트 건강에 중요하다. 어쩌면 실제 코드보다 더 중요할지도 모르겠다.

테스트 코드는 실제 코드의 유연성, 유지보수성, 재사용성을 보존하고 강화하기 때문이다. 그러므로 테스트 코드는 지속적으로 깨끗하게 관리하자.

테스트 API를 구현해 도메인 특화 언어(Domain Specific Language, DSL)를 만들자. 그러면 그만큼 테스트 코드를 짜기가 쉬워진다.

테스트 코드가 방치되어 망가지면 실제 코드도 망가진다. 테스트 코드를 깨끗하게 유지하자.

