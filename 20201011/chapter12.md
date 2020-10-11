# 12장 창발성

착실하게 따르기만 하면 우수한 설계가 나오는 간단한 규칙 네 가지가 있다? 🤔

## 구성

- [12장 창발성](#12장-창발성)
  - [구성](#구성)
    - [창발적 설계로 깔끔한 코드를 구현하자](#창발적-설계로-깔끔한-코드를-구현하자)
    - [단순한 설계 규칙 1: 모든 테스트를 실행하라](#단순한-설계-규칙-1-모든-테스트를-실행하라)
    - [단순한 설계 규칙 2~4: 리팩터링](#단순한-설계-규칙-24-리팩터링)
    - [중복을 없애라](#중복을-없애라)
    - [표현하라](#표현하라)
    - [클래스와 메서드 수를 최소로 줄여라](#클래스와-메서드-수를-최소로-줄여라)
    - [결론](#결론)

### 창발적 설계로 깔끔한 코드를 구현하자

켄트 벡이 제시한 **단순한 설계** 규칙 네 가지가 소프트웨어 설계 품질을 크게 높혀준다고 한다.

1. 모든 테스트를 실행한다.
2. 중복을 없앤다.
3. 프로그래머 의도를 표현한다.
4. 클래스와 메서드 수를 최소로 줄인다.

위의 목록은 중요도 순이다.

### 단순한 설계 규칙 1: 모든 테스트를 실행하라

무엇보다 먼저, 설계는 의도한 대로 돌아가는 시스템을 내놓아야 한다. 문서로는 시스템을 완벽하게 설계했지만, 시스템이 의도한 대로 돌아가는지 검증할 간단한 방법이 없다면, 문서 작성을 위해 투자한 노력에 대한 가치는 인정받기 힘들다.

테스트를 철저히 거쳐 모든 테스트 케이스를 항상 통과하는 시스템은 '테스트가 가능한 시스템'이다. 당연하지만 중요한 말이다. **테스트가 불가능한 시스템은 검증도 불가능하다.** 논란의 여지는 있지만, 검증이 불가능한 시스템은 절대 출시하면 안 된다.

테스트가 가능한 시스템을 만들려고 애쓰면 설계 품질이 더불어 높아진다. 크기가 작고 목적 하나만 수행하는 클래스가 나온다.

결합도가 높으면 테스트 케이스를 작성하기 어렵다. 그러므로, 앞서와 마찬가지로, 테스트 케이스를 많이 작성할수록 개발자는 DIP와 같은 원칙을 적용하고 의존성 주입(Dependency Injection), 인터페이스, 추상화 등과 같은 도구를 사용해 결합도를 낮춘다. 따라서 설계 품질은 더욱 높아진다.

'테스트 케이스를 만들고 게속 돌려라' 라는 간단하고 단순한 규칙을 따르면 시스템은 낮은 결합도와 높은 응집력이라는 결론을 얻는다.

### 단순한 설계 규칙 2~4: 리팩터링

테스트 케이스를 모두 작성했다면 이제 코드와 클래스를 정리해도 괜찮다. 구체적으로는 코드를 점진적으로 리팩터링 해나간다.

코드를 정리하면서 시스템이 깨질까 걱정할 필요가 없다. 테스트 케이스가 있으니까!

리팩터링 단계에서는 소프트웨어 설계 품질을 높이는 기법이라면 무엇이든 적용해도 괜찮다. 응집도를 높이고, 결합도를 낮추고, 관심사를 분리하고, 시스템 관심사를 모듈로 나누고, 함수와 클래스 크기를 줄이고, 더 나은 이름을 선택하는 등 다양한 기법을 동원한다. 또한 이 단계는 단순한 설계 규칙 중 나머지 3개를 적용해 중복 제거, 프로그래머 의도 표현, 클래스 메서드 축소 등등을 할 수 있다.

### 중복을 없애라

우수한 설계에서 중복은 커다란 적이다. 중복은 추가 작업, 추가 위험, 불필요한 복잡도를 뜻하기 때문이다. 

똑같은 코드는 당연히 중복이다. 비슷한 코드는 더 비슷하게 고쳐주면 리팩터링이 쉬워진다. 구현 중복도 중복의 한 형태다.

```java
// BAD
int size() {}
boolean isEmpty{}
```

```java
// GOOD
boolean isEmpty() {
  return 0 == size();
}
```

각 메서드를 따로 구현하는 방법도 있다. 하지만 `size()`가 개수를 반환하는 로직이기에, `isEmpty`는 이를 이용하면 코드를 중복해서 구현할 필요가 없어진다.

깔끔한 시스템을 만들려면 단 몇 줄이라도 중복을 제거하겠다는 의지가 필요하다.

```java
public void scaleToOneDimension(float desiredDimension, float imageDimension) {
  if (Math.abs(desiredDimension - imageDimension) < errorThreshold)
    return;
  float scalingFactor = desiredDimension / imageDimension;
  scalingFactor = (float)(Math.floor(scalingFactor * 100) * 0.01f);
  // /////////////
  RenderedOpnewImage = ImageUtilities.getScaledImage(image, scalingFactor, scalingFactor);
  image.dispose();
  System.gc();
  image = newImage;
  // /////////////
}

public synchronized void rotate(int degrees) {
  RenderedOpnewImage = ImageUtilities.getRotatedImage(image, degrees);
  image.dispose();
  System.gc();
  image = newImage;
}
```

`rotate` 메서드가 동일한 것을 알 수 있다. 이를 수정한다.

```java
public void scaleToOneDimension(float desiredDimension, float imageDimension) {
  if (Math.abs(desiredDimension - imageDimension) < errorThreshold)
    return;
  float scalingFactor = desiredDimension / imageDimension;
  scalingFactor = (float) Math.floor(scalingFactor * 10) * 0.01f);
  replaceImage(ImageUtilities.getScaledImage(image, scalingFactor, scalingFactor));
}

public synchronized void rotate(int degrees) {
  replaceImage(ImageUtilities.getRotatedImage(image, degrees));
}

private void replaceImage(RenderedOpnewImage) {
  image.dispose();
  System.gc();
  image = newImage;
}
```

아주 적은 양이지만 공통적인 코드를 새 메서드로 뽑고 보니 클래스가 `SRP`를 위반한다. 그러므로 새로 만든 `replaceImage` 메서드를 다른 클래스로 옮겨도 좋겠다. 

그러면 새 메서드의 가시성이 높아지고, 따라서 다른 팀원이 새 메서드를 좀 더 추상화해 다른 맥락에서 재사용할 기회를 포착할지도 모른다. 이런 '소규모 재사용'은 시스템 복잡도를 극적으로 줄여준다. 소규모 재사용을 제대로 익혀야 대규모 재사용이 가능하다.

> [Goodbye, Clean Code](https://overreacted.io/goodbye-clean-code/): 추상화 옳은 것인가? - [Dan Abramov](https://overreacted.io/)

위와 같이 리팩토링 할 경우 '특정 부분'만 조금씩 다른 경우를 자주 볼 수 있다. 이때 [Template Method](https://1ilsang.blog.me/221159883959) 패턴을 사용하면 고차원 중복을 제거할 수 있다.

```java
public class VacationPolicy {
  public void accrueUSDDivisionVacation() {
    // 지금까지 근무한 시간을 바탕으로 휴가 일수를 계산하는 코드
    // ...
    // 휴가 일수가 미국 최소 법정 일수를 만족하는지 확인하는 코드 (여기만 다름)
    // ...
    // 휴가 일수를 급여 대장에 적용하는 코드
    // ...
  }
  
  public void accrueEUDivisionVacation() {
    // 지금까지 근무한 시간을 바탕으로 휴가 일수를 계산하는 코드
    // ...
    // 휴가 일수가 유럽연합 최소 법정 일수를 만족하는지 확인하는 코드 (여기만 다름)
    // ...
    // 휴가 일수를 급여 대장에 적용하는 코드
    // ...
  }
}
```

위와 같은 코드는 아래와 같이 템플릿 메소드 패턴을 사용해 정리할 수 있다.

```java
abstract public class VacationPolicy {
  public void accrueVacation() {
    caculateBseVacationHours();
    alterForLegalMinimums();
    applyToPayroll();
  }
  
  private void calculateBaseVacationHours() { /* ... */ };
  abstract protected void alterForLegalMinimums();
  private void applyToPayroll() { /* ... */ };
}

public class USVacationPolicy extends VacationPolicy {
  @Override protected void alterForLegalMinimums() {
    // 미국 최소 법정 일수를 사용한다.
  }
}

public class EUVacationPolicy extends VacationPolicy {
  @Override protected void alterForLegalMinimums() {
    // 유럽연합 최소 법정 일수를 사용한다.
  }
}
```

하위 클래스는 중복되지 않는 정보만 제공해 accrueVacation 알고리즘에서 빠진 '구멍'을 메운다.

### 표현하라

자신이 이해하는 코드를 짜기는 쉽다. 하지만 나중에 코드를 유지보수할 사람이 그만큼 문제를 깊이 이해할 가능성은 희박하다.

소프트웨어 프로젝트 비용 중 대다수는 장기적인 유지보수에 들어간다. 코드를 변경하면서 버그의 싹을 심지 않으려면 유지보수 개발자가 시스템을 제대로 이해해야 한다. 하지만 시스템이 점차 복잡해지면서 유지보수 개발자가 시스템을 이해하느라 보내는 시간은 점점 늘어나고 동시에 코드를 오해할 가능성도 점점 커진다. 그러므로 코드는 개발자의 의도를 분명히 표현해야 한다. 개발자가 코드를 명백하게 짤수록 다른 사람이 그 코드를 이해하기 쉬워진다. 그래야 결함이 줄어들고 유지보수 비용이 적게 든다.

1. 좋은 이름을 선택한다
    - 이름과 기능이 완전 따로 노는 클래스나 함수를 사용해선 안된다.
2. 함수와 클래스 크기를 가능한 한 줄인다
    - 작은 클래스와 작은 함수는 이름 짓기도 쉽고, 구현하기도 쉬우며 이해하기도 쉽다.
3. 표준 명칭을 사용한다
    - 클래스가 `COMMAND` 와 같은 표준 패턴을 사용해 구현된다면 클래스 이름에 패턴 이름을 넣어준다.
4. 단위 테스트 케이스를 꼼꼼히 작성한다.
    - 테스트 케이스는 소위 '예제로 보여주는 문서'다. 다시 말해, 잘 만든 테스트 케이스를 읽어보면 클래스 기능이 한눈에 들어온다.

하지만 표현력을 높이는 가장 중요한 방법은 **노력**이다. 흔히 코드만 돌린 후 다음 문제로 직행하는 사례가 너무도 흔하다. **나중에 읽을 사람을 고려해 조금이라도 읽기 쉽게 만드려는 충분한 고민은 거의 찾기 어렵다. 하지만 나중에 코드를 읽을 사람은 바로 자신**일 가능성이 높다는 사실을 명심하자.

그러므로 자신의 작품을 조금 더 자랑하라. 함수와 클래스에 조금 더 시간을 투자하라. 더 나은 이름을 선택하고, 큰 함수를 작은 함수 여럿으로 나누고, 자신의 작품에 조금만 더 주의를 기울이자. 주의는 대단한 재능이다.

### 클래스와 메서드 수를 최소로 줄여라

중복을 제거하고, 의도를 표현하고, SRP를 준수한다는 기본적인 개념도 극단으로 치달으면 득보다 실이 많아진다. 클래스와 메서드 크기를 줄이자고 조그만 클래스와 메서드를 수없이 만드는 사례도 없지 않다. 그래서 이 규칙은 함수와 클래스 수를 가능한 한 줄이라고 제안한다.

목표는 함수와 클래스 크기를 작게 유지하면서 동시에 시스템 크기도 작게 유지하는 데 있다. 하지만 이 규칙은 간단한 설계 규칙 네 개 중 우선순위가 가장 낮다. 다시 말해, 클래스와 함수 수를 줄이는 작업도 중요하지만, 테스트 케이스를 만들고 중복을 제거하고 의도를 표현하는 작업이 더 중요하다는 뜻이다.

### 결론

이 책에서 소개하는 기법은 저자들이 수십 년 동안 쌓은 경험의 정수다. 단순한 설계 규칙을 따른다면 (오랜 경험 후에야 익힐) 우수한 기법과 원칙을 단번에 활용할 수 있다.