# 8장 경계

## 구성

- [8장 경계](#8장-경계)
  - [구성](#구성)
  - [외부 코드 사용하기](#외부-코드-사용하기)
  - [경계 살피고 익히기](#경계-살피고-익히기)
  - [log4j 익히기](#log4j-익히기)
  - [학습 테스트는 공짜 이상이다](#학습-테스트는-공짜-이상이다)
  - [아직 존재하지 않는 코드를 사용하기](#아직-존재하지-않는-코드를-사용하기)
  - [깨끗한 경계](#깨끗한-경계)

시스템에 돌아가는 모든 소프트웨어를 직접 개발하는 경우는 드물다. 오픈소스, 사내 컴포넌트 등 어떤 식으로든 이 외부 코드를 우리 코드에 깔끔하게 통합해야 한다.

소프트웨어 경계를 깔끔하게 처리하는 기법과 기교를 살펴보자.

## 외부 코드 사용하기

인터페이스 제공자와 사용자 사이에는 특유의 긴장감이 존재한다.

패키지 제공자나 프레임워크 제공자는 적용성을 최대한 넓히려 한다. 더 많은 환경에서 돌아가게 하고 더 많은 유저가 사용할 수 있도록 개발한다.

반면 사용자는 자신의 요구에 집중하는 인터페이스를 바란다.

이 사이의 *시스템 경계*에서 문제가 생길 소지가 많다.

자바의 `Map` 객체는 굉장히 다양한 인터페이스로 수많은 기능을 제공한다. 이로인해 생길수 있는 대표적인 문제점 예가 `clear()` 메서드이다. 즉, `Map` 사용자라면 누구든지 **내용을 지워버릴 수 있다**.

또한 설계 단계에서 **특정 객체 유형**만 저장하려고 설계해도 `Map`은 객체 유형을 제한하지 않는다. 마음만 먹으면 사용자는 어떠한 객체 유형도 추가할 수 있다.

```java
Map sensors = new HashMap();
Sensor s = (Sensor)sensors.get(sensorId);
```

위의 코드에는 `Map` 이 반환하는 `Object` 를 올바른 유형으로 변환할 책임이 클라이언트에 있다. 즉 손이 많이가며 오류가 생길 여지가 있다.

제네릭을 사용하면 어떻게 될까?

```java
Map<String, Sensor> sensors = new HashMap<Sensor>();
Sensor s = (Sensor)sensors.get(sensorId);
```

위의 방법으로 구현해도 ***사용자에게 필요하지 않은 기능까지 제공한다*** 는 문제는 해결하지 못한다.

프로그램에서 `Map<String, Sensor>` 인스턴스를 여기저기로 넘기게 되면 `Map` 인터페이스가 변경될 경우 수정할 코드가 상당히 많아진다.

> Map 인터페이스가 바뀔일이 거의 없다고 느껴지지만 자바5에서 제네릭이 추가되며 인터페이스가 변경된 내역이 있다!

```java
// GOOD
public class Sensors {
  private Map sensors = new HashMap();
  
  public Sensor getById(String id) {
    return (Sensor)sensors.get(id);
  }
}
```

위의 코드에선 경계 인터페이스인 `Map`을 `Sensors` 안으로 숨긴다(역전) 따라서 `Map` 인터페이스가 변경되어도 나머지 프로그램에는 영향을 주지 않는다.

또한 필요한 인터페이스만 추출해 사용할 수 있게 되었다. 이로인해 `Sensors` 클래스는 설계 규칙과 비즈니스 규칙을 따르도록 **강제**할 수 있다.

- 모든 것들을 이런식으로 래핑하란 뜻이 아니다.
- 경계에 있는 인스턴스를 '그대로' 여기저기 넘기지 말라는 뜻.

## 경계 살피고 익히기

외부 코드를 익히기는 어렵다. 외부 코드를 통합하기도 어렵다.

곧바로 우리쪽 코드를 작성해 외부 코드를 호출하는 대신 먼저 간단한 테스트 케이스를 작성해 외부 코드를 익히는게 낫다.(이를 **학습 테스트**라 한다.)

## log4j 익히기

학습 테스트를 해보자.

```java
@Test
public void testLogCreate() {
  Logger logger = Logger.getLogger("MyLogger");
  logger.info("hello");
}
```

화면에 `hello`를 출력하는 테스트 케이스다. 하지만 테스트를 돌리면 `Appender`라는 뭔가가 필요하다는 오류가 발생한다.

가장 간단한 로직에서 오류를 찾고 구글링하며 간단한 유닛 테스트로 기능 구현을 완성해 나간다.

```java
public class LogTest {
  private Logger logger;
  
  @Before
  public void initialize() {
    logger = Logger.getLogger("logger");
    logger.removeAllAppenders();
    Logger.getRootLogger().removeAllAppenders();
  }
  
  @Test
  public void basicLogger() {
    BasicConfigurator.configure();
    logger.info("basicLogger");
  }
  
  @Test
  public void addAppenderWithStream() {
    logger.addAppender(new ConsoleAppender(
          new PatternLayout("%p %t %m%n"),
          ConsoleAppender.SYSTEM_OUT));
    logger.info("addAppenderWithStream");
  }
  
  @Test
  public void addAppenderWithoutStream() {
    logger.addAppender(new ConsoleAppender(
          new PatternLayout("%p %t %m%n")));
    logger.info("addAppenderWithoutStream");
  }
}
```

그러면 위와 같이 필요로 하는 기능을 사용하기 위한 각 과정들이 쪼개지며 테스트로 나오게 된다.

## 학습 테스트는 공짜 이상이다

- 메인 로직에 영향을 주지 않으며 서드파티 코드를 이해할 수 있다.
- 서드파티 코드가 바뀔 경우 Test 를 돌려 '아직 우리가 필요한 기능'이 잘 동작하는지 테스트 할 수 있다.
- 새 버전으로 마이그레이션때 이 테스트가 결정적인 도움을 준다.

## 아직 존재하지 않는 코드를 사용하기

경계와 관련해 또 다른 유형은 '아는 코드'와 '모르는 코드'를 분리하는 경계다.

예시

- 무선통신 시스템을 구축하는 프로젝트에 참여
- 해당 팀의 하위 팀으로 '송신기'를 담당하는 팀이 존재. 여기에 대한 지식이 전무
- '송신기'팀은 인터페이스를 제공하지 않음. 인터페이스를 기다리는 대신 먼 곳부터 작업.
- 경계를 인터페이스로 정의.(우리가 원하는)
- '송신기'팀에서 API를 정의하면 '[어댑터 패턴](https://yaboong.github.io/design-pattern/2018/10/15/adapter-pattern/)'으로 API 사용을 캡슐화해 간극을 매꾼다.
- 이로 인해 코드 가독성이 높아지고 코드 의도도 분명해졌다.

![Architecture](https://nesoy.github.io/assets/posts/20180207/adapterPattern.png)

```java
public interface Transimitter {
  public void transmit(SomeType frequency, OtherType stream);
}

public class FakeTransmitter implements Transimitter {
  public void transmit(SomeType frequency, OtherType stream) {
    // 실제 구현이 되기 전까지 더미 로직으로 대체
  }
}

// 경계 밖의 API
public class RealTransimitter {
  // 캡슐화된 구현
  ...
}

public class TransmitterAdapter extends RealTransimitter implements Transimitter {
  public void transmit(SomeType frequency, OtherType stream) {
    // RealTransimitter(외부 API)를 사용해 실제 로직을 여기에 구현.
    // Transmitter의 변경이 미치는 영향은 이 부분에 한정된다.
  }
}

public class CommunicationController {
  // Transmitter팀의 API가 제공되기 전에는 아래와 같이 사용한다.
  public void someMethod() {
    Transmitter transmitter = new FakeTransmitter();
    transmitter.transmit(someFrequency, someStream);
  }

  // Transmitter팀의 API가 제공되면 아래와 같이 사용한다.
  public void someMethod() {
    Transmitter transmitter = new TransmitterAdapter();
    transmitter.transmit(someFrequency, someStream);
  }
}
```

위의 설계는 테스트도 매우 용이하다.

> 참조: https://nesoy.github.io/articles/2018-02/CleanCode-Boundary

## 깨끗한 경계

경계에 해당하는 코드는 깔끔히 분리한다. 또한 기대치를 정의하는 테스트 케이스도 작성한다.

통제가 불가능한 외부 패키지에 의존하는 대신 통제가 가능한 우리 코드에 의존하는 편이 훨씬 좋다.