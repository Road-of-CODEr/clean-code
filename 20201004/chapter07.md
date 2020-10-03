# 7장 오류 처리

오류 처리는 프로그램에 반드시 필요한 요소 중 하나다. 뭔가 잘못될 가능성은 늘 존재한다. ***뭔가 잘못되면 바로 잡을 책임은 바로 우리 프로그래머에게 있다.***

- 여기저기 흩어진 오류 처리 코드 때문에 실제 코드가 하는 일을 파악하기가 거의 불가능해진다.

## 구성
- [7장 오류 처리](#7장-오류-처리)
  - [구성](#구성)
  - [오류 코드보다 예외를 사용하라](#오류-코드보다-예외를-사용하라)
  - [Try-Catch-Finally 문부터 작성하라](#try-catch-finally-문부터-작성하라)
  - [미확인 예외를 사용하라](#미확인-예외를-사용하라)
  - [예외에 의미를 제공하라](#예외에-의미를-제공하라)
  - [호출자를 고려해 예외 클래스를 정의하라](#호출자를-고려해-예외-클래스를-정의하라)
  - [정상 흐름을 정의하라](#정상-흐름을-정의하라)
  - [null을 반환하지 마라](#null을-반환하지-마라)
  - [null을 전달하지 마라](#null을-전달하지-마라)
  - [결론](#결론)

## 오류 코드보다 예외를 사용하라

예전엔 예외를 지원하지 않는 프로그래밍 언어가 많았다. 따라서 에러 flag 혹은 에러 코드를 반환하는 방법으로 처리했다.

이 경우는 예외처리와 비즈니스 로직을 분리하기 어렵고 결과적으로 실수를 하게 만든다. 그러므로 반드시 예외와 코드를 분리하자.

```java
// Bad
public class DeviceController {
  ...
  public void sendShutDown() {
    DeviceHandle handle = getHandle(DEV1);
    // Check the state of the device
    if (handle != DeviceHandle.INVALID) {
      // Save the device status to the record field
      retrieveDeviceRecord(handle);
      // If not suspended, shut down
      if (record.getStatus() != DEVICE_SUSPENDED) {
        pauseDevice(handle);
        clearDeviceWorkQueue(handle);
        closeDevice(handle);
      } else {
        logger.log("Device suspended. Unable to shut down");
      }
    } else {
      logger.log("Invalid handle for: " + DEV1.toString());
    }
  }
  ...
}
```

```java
// Good
public class DeviceController {
  ...
  public void sendShutDown() {
    try {
      tryToShutDown();
    } catch (DeviceShutDownError e) {
      logger.log(e);
    }
  }
    
  private void tryToShutDown() throws DeviceShutDownError {
    DeviceHandle handle = getHandle(DEV1);
    DeviceRecord record = retrieveDeviceRecord(handle);
    pauseDevice(handle); 
    clearDeviceWorkQueue(handle); 
    closeDevice(handle);
  }
  
  private DeviceHandle getHandle(DeviceID id) {
    ...
    throw new DeviceShutDownError("Invalid handle for: " + id.toString());
    ...
  }
  ...
}
```

각 개념을 독립적으로 살펴보고 이해할 수 있다.

## Try-Catch-Finally 문부터 작성하라

`try` 블록에 들어가는 코드는 트랜잭션과 비슷하게 바라본다. `try` 블록에서 어떠한 일이 생기든지 `catch` 블록은 프로그램 상태를 일관성 있게 유지해야 한다.

따라서 예외가 발생할 코드를 짤 때는 `try-catch-finally` 문으로 시작하는 편이 낫다.

`try` 문이 하나의 `scope` 가 된다.

TDD 방식으로 코드를 작성해보자.

```java
  // Step 1: StorageException을 던지지 않으므로 이 테스트는 실패한다.
  @Test(expected = StorageException.class)
  public void retrieveSectionShouldThrowOnInvalidFileName() {
    sectionStore.retrieveSection("invalid - file");
  }
  
  public List<RecordedGrip> retrieveSection(String sectionName) {
    // dummy return until we have a real implementation
    return new ArrayList<RecordedGrip>();
  }
```

```java
  // Step 2: 이제 테스트는 통과한다.
  public List<RecordedGrip> retrieveSection(String sectionName) {
    try {
      FileInputStream stream = new FileInputStream(sectionName)
    } catch (Exception e) {
      throw new StorageException("retrieval error", e);
    }
    return new ArrayList<RecordedGrip>();
  }
```

```java
  // Step 3: Exception의 범위를 FileNotFoundException으로 줄여 정확히 어떤 Exception이 발생한지 체크하자.
  public List<RecordedGrip> retrieveSection(String sectionName) {
    try {
      FileInputStream stream = new FileInputStream(sectionName);
      stream.close();
    } catch (FileNotFoundException e) {
      throw new StorageException("retrieval error", e);
    }
    return new ArrayList<RecordedGrip>();
  }
```

강제로 예외를 일으키는 테스트 케이스를 작성한 후 테스트를 통과하게 코드를 작성하는 방법을 권장.

- 자연스럽게 `try` 블록의 트랜잭션 범위 부터 구현하게 되므로 범위 내에서 트랜잭션 본질을 유지하기 쉬워진다.

## 미확인 예외를 사용하라

옛날에는 메서드를 선언할 때는 메서드가 반환할 예외를 모두 열거했다. 하지만 요즘은 사용하지 않는다.

우리는 확인된 오류가 치르는 **비용**에 상응하는 이익을 제공하는지 철저히 따져봐야 한다.

- 비용

확인된 예외는 OCP 를 위반한다. 

메서드에서 확인된 예외를 던졌는데 `catch` 블록이 세 단계 위에 있다면 그 사이 메서드 모두가 선언부에 해당 예외를 정의해야 한다.

즉 하위 단계에서 코드를 변경하면 상위 단계 메서드 선언부를 전부 고쳐야 한다는 말이다.(메소드 선언에 throws 구문을 붙이는 등의 작업)

throws 경로에 위치하는 모든 함수가 최하위 함수에서 던지는 예외를 알아야 하므로 *캡슐화*가 깨진다.

- 아주 중요한 라이브러리를 작성한다면 모든 예외를 잡아야 한다. 하지만 일반적인 앱에서 의존성이라는 비용이 더 든다.

## 예외에 의미를 제공하라

예외를 던질 때는 전후 상황을 충분히 덧붙인다.

1. 오류 메시지에 정보를 담아 예외와 함께 던진다.
2. 실패한 연산 이름과 실패 유형도 언급한다.
3. 로깅 기능을 사용한다면 catch 블록에서 오류를 기록하도록 충분한 정보를 넘겨준다.

## 호출자를 고려해 예외 클래스를 정의하라

오류를 분류하는 방식은 수없이 많다.

1. 오류가 발생한 위치
   1. 컴포넌트로 분류
2. 오류의 유형
   1. 디바이스 실패
   2. 네트워크 실패
   3. 프로그래밍 오류 등

하지만 앱에서 오류를 정의할 때 프로그래머에게 가장 중요한 관심사는 **오류를 잡아내는 방법**이 되어야 한다.

```java
  // Bad
  // case: 외부 라이브러리를 호출하는 코드
  // catch문의 내용이 거의 같다.
  // 외부 라이브러리가 던질 예외를 모두 잡는다.
  ACMEPort port = new ACMEPort(12);
  try {
    port.open();
  } catch (DeviceResponseException e) {
    reportPortError(e);
    logger.log("Device response exception", e);
  } catch (ATM1212UnlockedException e) {
    reportPortError(e);
    logger.log("Unlock exception", e);
  } catch (GMXError e) {
    reportPortError(e);
    logger.log("Device response exception");
  } finally {
    ...
  }
```

```java
  // Good
  // ACME 클래스를 LocalPort 클래스로 래핑해 new ACMEPort().open() 메소드에서 던질 수 있는 exception들을 간략화
  // 외부 API 를 감싸면 외부 라이브러리와 프로그램 사이의 의존성이 크게 줄어든다.
  // 다른 API 로 갈아탈때도 부담이 훨씬 줄어들게 된다.
  LocalPort port = new LocalPort(12);
  try {
    port.open();
  } catch (PortDeviceFailure e) {
    reportError(e);
    logger.log(e.getMessage(), e);
  } finally {
    ...
  }
  
  public class LocalPort {
    private ACMEPort innerPort;
    public LocalPort(int portNumber) {
      innerPort = new ACMEPort(portNumber);
    }
    
    public void open() {
      try {
        innerPort.open();
      } catch (DeviceResponseException e) {
        throw new PortDeviceFailure(e);
      } catch (ATM1212UnlockedException e) {
        throw new PortDeviceFailure(e);
      } catch (GMXError e) {
        throw new PortDeviceFailure(e);
      }
    }
    ...
  }
```

## 정상 흐름을 정의하라

위의 내용들을 충실히 따른다면 비즈니스 로직과 오류 처리가 잘 분리된 코드가 나온다.

외부 API 를 감싸 독자적인 예외를 던지고 코드 위에 처리기를 정의해 중단된 계산을 처리한다. 대게는 괜찮지만, 때로는 중단이 적합하지 않는 때도 있다.

코드를 부르는 입장에서 `예외적인 상황` 을 항상 고려해야 한다면 부담이 된다. 이런 경우 특수 사례 패턴(SPECIAL CASE PATTERN)을 사용해 클라이언트 코드가 예외적인 상황을 처리할 필요 없도록 만든다.

```java
  // Bad
  try {
    MealExpenses expenses = expenseReportDAO.getMeals(employee.getID());
    m_total += expenses.getTotal();
  } catch(MealExpensesNotFound e) {
    m_total += getMealPerDiem();
  }
```

```java
  // Good
  // caller logic.
  ...
  MealExpenses expenses = expenseReportDAO.getMeals(employee.getID());
  m_total += expenses.getTotal();
  ...
  ////////////////////////
  public class PerDiemMealExpenses implements MealExpenses {
    public int getTotal() {
      // return the per diem default
    }
  }
  // Detail
  public class ExpenseReportDAO {
    public MealExpenses getMeals(int employeeId) {
      MealExpenses expenses;
      try {
        expenses = expenseReportDAO.getMeals(employee.getID());
      } catch(MealExpensesNotFound e) {
        expenses = new PerDiemMealExpenses();
      } 
      return expenses;
    }
  }
```

## null을 반환하지 마라

```java
  // BAD
  public void registerItem(Item item) {
    if (item != null) {
      ItemRegistry registry = peristentStore.getItemRegistry();
      if (registry != null) {
        Item existing = registry.getItem(item.getID());
        if (existing.getBillingPeriod().hasRetailOwner()) {
          existing.register(item);
        }
      }
    }
  }
  // Bad
  List<Employee> employees = getEmployees();
  if (employees != null) {
    for(Employee e : employees) {
      totalPay += e.getPay();
    }
  }
```

`null`을 반환하는 코드는 일거리를 늘릴 뿐만 아니라 호출자에게 문제를 떠넘긴다. 누구 하나라도 `null`을 빼먹는다면 앱이 통제 불능에 빠질지도 모른다.

```java
  // Good
  List<Employee> employees = getEmployees();
  for(Employee e : employees) {
    totalPay += e.getPay();
  }
  
  public List<Employee> getEmployees() {
    if( .. there are no employees .. )
      return Collections.emptyList();
    }
  }
```

사용하려는 외부 API 가 `null`을 반환한다면 감싸기 메서드를 구현해 예외를 던지거나 특수 사례 객체를 반환하는 방식을 고려한다.

> 더 보기 [JavaScript 에서의 null 과 undefined](https://fedevelopers.github.io/tech.description/typeof-null-%EC%9D%98-%EC%97%AD%EC%82%AC/)
> 더 보기 [JavaScript 에서 null 을 사용해야할까?](https://github.com/sindresorhus/meta/issues/7)

## null을 전달하지 마라

메서드에서 `null`을 반환하는 방식도 나쁘지만 메서드로 `null`을 전달하는 방식은 더 나쁘다.

정상적인 인수로 `null` 을 기대하는 API가 아니라면 메서드로 `null`을 전달하는 코드는 최대한 피한다.

> redux: connect(mapStateToProps? = null, mapDispatchToProps? = null)(Component);

```java
// Bad
// calculator.xProjection(null, new Point(12, 13));
// 위와 같이 부를 경우 NullPointerException 발생
public class MetricsCalculator {
  public double xProjection(Point p1, Point p2) {
    return (p2.x – p1.x) * 1.5;
  }
  ...
}

// Bad
// NullPointerException은 안나지만 윗단계에서 InvalidArgumentException이 발생할 경우 처리해줘야 함.
public class MetricsCalculator {
  public double xProjection(Point p1, Point p2) {
    if(p1 == null || p2 == null){
      throw InvalidArgumentException("Invalid argument for MetricsCalculator.xProjection");
    }
    return (p2.x – p1.x) * 1.5;
  }
}

// Bad
// 좋은 명세이지만 첫번째 예시와 같이 NullPointerException 문제를 해결하지 못한다.
public class MetricsCalculator {
  public double xProjection(Point p1, Point p2) {
    assert p1 != null : "p1 should not be null";
    assert p2 != null : "p2 should not be null";
    
    return (p2.x – p1.x) * 1.5;
  }
}
```

`null`이 들어옴으로써 함수가 지저분해진다. 애초에 `null` 이 인자로 넘어올 수 없다고 설계하라.

```javascript
// Init param
const fn = (params) => {
  const {
    ilsang = 3,
  } = params;
  const qparams = [ilsang, ...params];
  ...
}
const fn = ({ ilsang = 3, ...args }) => {
  console.log(ilsang, '===', args);
}
// Default return
const defaultReturn = {
  key: 'default value'
};
const fn = () => {
  const ret = {
    hit: 'Add ret value'
  };
  // XXX: Require Deep Copy: https://user-images.githubusercontent.com/23524849/94998928-9846d180-05f0-11eb-98ef-f7a6eff5d040.png
  return { ...defaultReturn, ...ret };
}
```

## 결론

클린 코드는 읽기도 좋아야 하지만 안정성도 높아야 한다.

예외처리를 비즈니스 로직과 분리해 독자적인 사안으로 고려하면 튼튼하고 깨끗한 코드를 작성할 수 있다.