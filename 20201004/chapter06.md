# 6장 객체와 자료구조

잘 만들어진 자료구조가 무엇을 의미할까? 🎢

## 구성

1. [자료 추상화](#자료-추상화)
2. [자료 / 객체 비대칭](#자료-/-객체-비대칭)
3. [디미터 법칙](#디미터-법칙)
4. [자료 전달 객체](#자료-전달-객체)
5. [결론](#결론)



## 자료 추상화

서론은 따로 얘기하지 않고, 바로 코드로 들어가보겠습니다

```java
class Point {
  public double x;
  public double y;
}
```

```java
interface Point {
  double getX();
  double getY();
  void setCartesian(double x, double y); // 직교좌표계
  double getR();
  double getTheta();
  void setPolar(double r, double theta); // 극좌표계
}
```

첫번째 `Point` 와 두번째 `Point` 의 차이점이 무엇일까요?  

바로, 두번째의 `Point` 는 `Point` 라는 객체가 직교좌표계인지, 극좌표계인지 정확하게 쓰임새를 알기가 어렵습니다 :). 

**추상화 레벨이 너무 구체적인 단계**까지 들어갔기 때문이죠. 

추상화적인 측면으로 보았을 때는 오히려 첫번째 Point가 오히려 직교좌표계에 더 가까운 모델링 같습니다. 

<br>

*사실 저는 2가지 객체 모두 다 구리다고 생각합니다*. 

 <br>

객체지향 프로그래밍에서 클래스를 설계할 때 원칙중의 하나인 `SRP` 를 위반한 코드이기 때문이죠. 

그럼 어떻게 하면 쓰임새에 맞는 클래스를 설계할 수 있을까요?  

```java
interface Vehicle {
  double getFuelTankCapacityInGallons();
  double getGallonsOfGasoline();
} // 구체적인 설계
```

```java
interface Vehicle {
  double getPercentFuelRemaining();
} // 추상적인 설계
```

메서드 이름에서도 볼 수 있듯이,  

첫번째 `Vehicle` 은 **가솔린**에 의존하고 있고,

두번째 `Vehicle` 은 가솔린이 아닌 추상화된 **엔진(Fuel)**에 의존하고 있습니다  

그렇기 때문에 첫번째 `Vehicle`은 **구체적인 설계**고, 두번째 `Vehicle`은 **추상적인 설계**라 볼 수 있습니다  

> 정말로 그럴까요?  😧

:bulb: 사실 상황에 따라 많이 다릅니다 :)  

가솔린 차만 생산하는 회사 입장에서는 첫번째 `Vehicle` 이 추상화된 설계라고도 볼 수 있죠  

> 왜냐하면, 구현체는 다양할거고, 가솔린은 공통으로 쓰일거니까요

항상 설계는 명확한 답이 존재하지 않습니다. 상황에 따라 판단해야 되요 ( 어쩌면 말장난이라 생각할 수도 있습니다 )

<br>

아무튼 다시 책으로 돌아오면, 두번째 Vehicle 이 더 좋은 설계다 라고 명시하고 있습니다 :)  

```text
개발자는 객체가 포함하는 자료를 표현할 가장 좋은 방법을 심각하게 고민해야 합니다
```

## 자료 / 객체 비대칭

어쩌면 객체지향을 공부한 사람 입장에서는 아래 코드가 굉장히 코웃음 칠만한 코드라 생각할 수 있습니다

```java
class Square {
  Point topLeft;
  double side;
}

class Rectangle {
  Point topLeft;
  double height;
  double width;
}

class Circle {
  Point center;
  double radius;
}

public class Geometry {
  public final double PI = 3.14159265358;
  
  public double area(Object shape) throws NoSuchShapeException {
    if (shape instanceof Square square) {
      return square.side * square.side;
    } else if (shape instanceof Rectangle rectangle) {
      return rectangle.height * rectangle.width;
    } else if (shape instanceof Circle circle) {
      return PI * circle.radius * circle.radius;
    }
    
    throw new NoSuchShapeException();
  }
}
```

객체 지향적인 입장에서는 위 코드는 별로라 볼 수 있습니다  

> 정말로 그럴까요?

만약, `Geometry` 에 둘레 길이를 구하는 `perimeter()` 함수를 추가한다면  

도형 클래스들(Circle, Rectangle, Square)은 아무런 영향도 받지 않습니다 

<br>

하지만 새 도형(Triangle) 을 추가하고 싶다면?  

새 도형에 관련한 부분과 Geometry 객체를 고쳐야 하는 상황에 직면합니다 

<br>

그렇다면 객체지향적인 설계가 무엇이길래?

```java
interface Shape {
  double area();
}

class Square implements Shape {
  Point topLeft;
  double side;
  
  public double area() {
    return side * side;
  }
}
// ... 아래는 생략합니다 ( 다 똑같거든요 )
```

공통부분을 추상화해서 다형성을 통해 조금 더 상황에 유연한 코드를 작성할 수 있죠.

그래서 `Geometry` 클래스에서 instanceof 를 사용하지 않고 shape 인터페이스를 매개변수로 받으면 되겠죠 ㅎㅎ

```java
public class Geometry {
  public final double PI = 3.14159265358;
  
  public double area(Shape shape) throws NoSuchShapeException {
    return shape.area();
  }
}
```

참 간단하게 설계가 바뀌게 되는거죠  

**정말 이 방법이 모든 상황에서 최선의 설계라고 얘기할 수 있을까요?**

> 절대로 아닙니다.
>
> 훌륭한 객체지향 프로그래머는 객체지향과 절차지향을 선택할 줄 알아야 합니다. - [오브젝트](http://www.yes24.com/Product/Goods/74219491) -

```text
절차적인 코드는 기존 자료 구조를 변경하지 않으면서 새 함수를 추가하기 쉽다.
반면 객체 지향 코드는 기존 함수를 변경하지 않으면서 새 클래스를 추가하기 쉽다. - clean code -
```

```text
절차적인 코드는 새로운 자료 구조를 추가하기 어렵다.
그러려면 모든 함수를 고쳐야한다.
객치 지향 코드는 새로운 함수를 추가하기 어렵다.
그러려면 모든 클래스를 고쳐야 한다. - clean code -
```

위 예시에서도 많이 느끼셨나요? 😄  

느끼셨다면, 여러분들은 이제 훌륭한 객체지향 프로그래머 :computer: 입니다. 

## 디미터 법칙

객체지향을 또 열심히 공부하셨다면 `디미터 법칙`은 많이 익숙하실 겁니다  

```text
디미터 법칙: 모듈은 자신이 조작하는 객체의 속사정을 몰라야 한다는 법칙
```

간단히 말해서는

```text
하나의 코드 Line 에는 점(.) 하나만 찍어라
```

라는 얘기와 일맥상통합니다  

즉 이렇게 사용하지 말라고 얘기합니다  

```java
final String outputDir = ctxt.getOptions().getScratchDir().getAbsolutePath();
// 기차 충돌
```

흔히 위와 같은 상황을 `기차 충돌` 이라고 이야기 합니다  

이게 왜 안좋냐 라고 얘기하는 이유는 ctxt 객체가 Option을 포함하고,   

Options가 ScratchDir을 포함하고, ScratchDir가 AbsolutePath를 포함하고 있다는 것을  

외부로 공개한 셈이기 때문이에요  

이런 구조가 `잡종 구조` 라고 합니다  

```text
절반은 객체, 절반은 자료 구조인 것이 잡종구조라 합니다.
마치 비공개(private)으로 설정해놓고 그대로 노출하는(public) 과 다른셈이 없는 것이죠
```

### 어떻게 하면 감출 수 있을까?

사실 코드를 보다보면, 핵심은 바로 `outputDir` 에 있다는 것을 볼 수 있어요  

이 친구는 도대체 어떻게 쓰이길래? 하고 보니까  

```java
String outFile = outputDir + "/" + className.replace('.','/') + ".class";
FileOutputStream fout = new FileOutputStream(outFile);
BufferedOutputStream bos = new BufferedOutputStream(fout);
```

결국에는 임시파일을 생성하기 위한 목적이라는 것을 우리는 알아버렸다ㅎㅎ  

그렇다면, **객체의 데이터를 조회(Get)하는 것이 아니라 객체에게 명령을 내리면 어떨까?**  

```java
BufferedOutputStream bos = ctxt.createScratchFileStream(classFileName);
```

이런식으로 말이다  

<br>

Clean Code에서는 간략하게 나타내어 있지만, 위 개념은 상세하게 공부하면 정말 좋아요  

여러분들도 이 [책](http://www.yes24.com/Product/Goods/18249021)을 강력 추천드립니다

## 자료 전달 객체

우리가 흔히 DTO(Data Transfer Object)라 불려지는 객체에요  

```java
@RequiredArgsConstructor
@Getter
public class Address {
  private final String street;
  private final String streetExtra;
  private final String city;
  private final String state;
  private final String zip;
}
```

이 친구를 사용하는 이유는 외부와 통신(Database, Server, ... etc)하기 위한 목적이라고 생각하면 좋아요  

*그렇다면 굳이 왜 DTO를 사용하느냐?*  

외부와 통신하는 메시지 포맷은 정말 쉽게 바뀔수도 있고,  

그 포맷이 우리의 비즈니스 로직과 의존성이 강하게 엮여있다면 메세지 포맷이 바뀔 때마다  

비즈니스 로직을 매번 바꿔야하는 귀찮음과 기초적인 뼈대가 흔들리게 됩니다  

**꼭 항상 분리하는게 좋습니다**   

여담으로는 **Jdk New feaure** 중의 하나인 `Record` 를 사용하는 것을 강력 추천드립니다

```java
public record Address (
  String street;
  String streetExtra;
  String city;
  String state;
  String zip;
) {}
```

Record 객체는 기본적으로 **final class** 이고,

**모든 멤버변수가 Immutable(final)** 이고, **Getter** 와 **RequiredArgsConstructor** 가  

지원되는 기본적인 Data Class 입니다  

자주 애용해주세요 :smile:  



## 결론

객체는 동작을 공개하고 자료를 숨긴다  

그래서 기존 동작을 변경하지 않으면서 새 객체 타입을 추가하기는 쉬운 반면, 기존 객체에 새 동작을 추가하기는 어렵다  

자료 구조는 별다른 동작없이 자료를 노출한다  

그래서 기존 자료 구조에 새 동작을 추가하기는 쉬우나, 기존 함수에 새 자료 구조를 추가하기는 어렵다  

