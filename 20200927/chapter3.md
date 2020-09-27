# 3장 함수

잘 만들어진 함수는 어떤 것인가?

## 구성

1. [작게 만들어라!](#작게-만들어라)
2. [한 가지만 해라!](#한-가지만-해라)
3. [함수 당 추상화 수준은 하나로!](#함수-당-추상화-수준은-하나로)
4. [서술적인 이름을 사용하라!](#서술적인-이름을-사용하라)

5. [함수 인수](#함수-인수)
6. [부수 효과를 일으키지 마라!](#부수-효과를-일으키지-마라)
7. [명령과 조회를 분리하라!](#명령과-조회를-분리하라)
8. [오류 코드보다 예외를 사용하라!](#오류-코드보다-예외를-사용하라)

9.  [반복하지 마라!](#반복하지-마라)
10. [구조적 프로그래밍](#구조적-프로그래밍)
11. [함수를 어떻게 짜죠?](#함수를-어떻게-짜죠)
12. [결론](#결론)

## 작게 만들어라!

```java
public static String renderPageWithSetupsAndTeardowns( PageData pageData, boolean isSuite) throws Exception {
	boolean isTestPage = pageData.hasAttribute("Test"); 
	if (isTestPage) {
		WikiPage testPage = pageData.getWikiPage(); 
		StringBuffer newPageContent = new StringBuffer(); 
		includeSetupPages(testPage, newPageContent, isSuite); 
		newPageContent.append(pageData.getContent()); 
		includeTeardownPages(testPage, newPageContent, isSuite); 
		pageData.setContent(newPageContent.toString());
	}
	return pageData.getHtml(); 
}
```

위의 코드도 길다. 한 함수당 3~5 줄 이내로 줄이는 것을 권장한다.

```java
public static String renderPageWithSetupsAndTeardowns( PageData pageData, boolean isSuite) throws Exception { 
   if (isTestPage(pageData)) 
   	includeSetupAndTeardownPages(pageData, isSuite); 
   return pageData.getHtml();
}
```

### 블록과 들여쓰기

```javascript
function main() {
  if(STATE) return somethingFN();
  else if(STATE) return somethingFN();
  else return somethingFN();
}
```

1. `if/else/while` 문 안의 '블록'에는 한 줄 이어야 한다.
2. 중첩 구조가 생길 만큼 함수가 커서는 안 된다. 들여쓰기는 1단으로 한다.

## 한 가지만 해라!

- 함수는 한 가지를 해야 한다. 그 한 가지를 잘 해야 한다. 그 한 가지만을 해야 한다.

***'한 가지'가 무엇인가?***

- 지정된 함수 이름 아래에서 **추상화 수준이 하나인 단계**만 수행한다면 그 함수는 한 가지 작업만 한다.
- 반대로, 의미 있는 이름으로 다른 함수를 추출할 수 있다면 그 함수는 여러 작업을 하는 셈이다.

### 함수 내 섹션

- 한 함수에서 여러 작업을 한다면 한 가지만 하는 함수가 아니다.

## 함수 당 추상화 수준은 하나로!

```java
getHTM();
String pagePathName = PathParser.render(pagePath);
Object.append("\n");
```

위의 3가지는 모두 추상화의 레벨이 다르다.(내려갈수록 저수준)

추상화 수준을 섞으면 코드를 읽는 사람이 헷갈린다. 특정 표현이 **개념**인지 **세부 구현체**인지 구분하기 어려워 진다.

개념에 세부 구현체가 추가되면 깨진 유리창 효과로 함수가 점점 비대해지며 심각한 레거시로 발전한다.

### 위에서 아래로 코드 읽기: **내려가기** 규칙

코드는 위에서 아래로 이야기처럼 읽혀야 좋다.

한 함수 다음에는 추상화 수준이 한 단계 낮은 함수가 온다.(문단을 생각)

### Switch case

`switch` 문은 본질적으로 N 가지를 처리하게 되므로 '한 가지' 작업만 하는 함수의 규칙을 명백히 위반한다.

[다형성](https://blog.naver.com/1ilsang/221105550475)을 이용하여 switch 문을 저차원 클래스에 숨기고 들어내지 않는다.

```java
public Money calculatePay(Employee e) throws InvalidEmployeeType {
	switch (e.type) { 
		case COMMISSIONED:
			return calculateCommissionedPay(e); 
		case HOURLY:
			return calculateHourlyPay(e); 
		case SALARIED:
			return calculateSalariedPay(e); 
		default:
			throw new InvalidEmployeeType(e.type); 
	}
}
```

위 함수의 문제점

1. 함수가 길다.
2. 한 가지 작업만 수행하지 않는다.
3. [SRP](https://blog.naver.com/1ilsang/221105781167) 를 위반한다.
   1. 코드를 변경할 이유가 여럿이기 때문
4. [OCP](https://blog.naver.com/1ilsang/221105781167) 를 위반한다.
   1. 새 직원 유형을 추가할 때마다 코드를 변경해야 한다.
5. 위 함수와 구조가 동일한 함수가 무한정 존재한다.
   1. `isPayday(Employee e, Date date);` 같은 경우

이를 해결한 코드가 아래다. switch 문을 *추상 팩토리*에 꽁꽁 숨긴다.

```java
public abstract class Employee {
	public abstract boolean isPayday();
	public abstract Money calculatePay();
	public abstract void deliverPay(Money pay);
}
-----------------
public interface EmployeeFactory {
	public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType; 
}
-----------------
public class EmployeeFactoryImpl implements EmployeeFactory {
	public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType {
		switch (r.type) {
			case COMMISSIONED:
				return new CommissionedEmployee(r) ;
			case HOURLY:
				return new HourlyEmployee(r);
			case SALARIED:
				return new SalariedEmploye(r);
			default:
				throw new InvalidEmployeeType(r.type);
		} 
	}
}
```

핵심은 로직이 퍼지지 않게 하며 일관성을 유지시키는 것이다.(사용하는 곳에서 구현하는 것이 아닌 구현된 팩토리 메서드를 사용하게 하는 것)

+ switch 문은 불가피하게 써야될 상황이 많으므로, 상황에 따라 사용하는 것이 좋을 수도 있다.

## 서술적인 이름을 사용하라!

- 좋은 이름이 주는 가치는 아무리 강조해도 지나치지 않다.

> "코드를 읽으면서 짐작했던 기능을 각 루틴이 그대로 수행한다면 '클린 코드'라 불러도 되겠다." - 워드

이름이 길어도 괜찮다. 길고 서술적인 이름이 짧고 어려운 이름보다 좋다. 길고 서술적인 이름이 길고 서술적인 *주석보다 좋다*.

이름을 붙일 때는 일관성이 있어야 한다.

## 함수 인수

함수에서 이상적인 인수의 개수는 0개다. 가능한 다항은 피한다.

테스트 관점에서 보면 인수는 몹시 어려워 진다.

- 갖가지 인수 조합으로 함수를 검증한다고 하면 엄청나게 많은 조합의 가지가 생긴다.

### 많이 쓰는 단항 형식

- 인수에 질문을 던지는 경우
  - `boolean fileExists(“MyFile”);`

- 인수를 뭔가로 변환해 결과를 변환하는 경우
  - `InputStream fileOpen(“MyFile”);`

- 이벤트 함수일 경우 (이 경우에는 이벤트라는 사실이 코드에 명확하게 드러나야 한다.)
  - `passwordAttemptFailedNtimes(int attempts);`

위의 세 가지가 아니라면 단항 함수는 가급적 피한다.

### 플래그 인수

플래그 인수는 쓰지마라. bool 값을 넘기는 것 자체가 함수가 한꺼번에 여러가지 일을 처리한다고 가정하는 것이다.

### 인수 목록

```java
String.format("%s worked %.2f hours.", name, hours);
```

가변 인수를 모두 동등하게 취급하면 `List`형 인수 하나로 취급할 수 있다.(이로인해 사실상 이항 함수가 된다)

```java
public String format(String format, Object... args)
```

가변 인수를 취하는 모든 함수에 같은 원리가 적용된다.

### 동사와 키워드

단항 함수는 함수와 인수가 동사/명사 쌍을 이뤄야한다.
- writeField(name);

함수이름에 키워드(인수 이름)을 추가하면 인수 순서를 기억할 필요가 없어진다.
- assertExpectedEqualsActual(expected, actual);

> ?

## 부수 효과를 일으키지 마라!

부수 효과는 거짓말이다. 함수에서 한 가지를 하겠다고 약속하고 **남몰래** 다른 짓도 하는 것이다.
- e.x) 함수로 넘어온 인수나 글로벌 변수를 수정한다.(WTF?)

```java
public class UserValidator {
	private Cryptographer cryptographer;
	public boolean checkPassword(String userName, String password) { 
		User user = UserGateway.findByName(userName);
		if (user != User.NULL) {
			String codedPhrase = user.getPhraseEncodedByPassword(); 
			String phrase = cryptographer.decrypt(codedPhrase, password); 
			if ("Valid Password".equals(phrase)) {
				Session.initialize();
				return true; 
			}
		}
		return false; 
	}
}
```

무해해 보이는 코드지만 `Session.initialize()` 는 함수명과 맞지 않는 부수 효과이다.(이름과 상이한 비즈니스 로직)

- `checkPasswordAndInitializeSession` 이라는 이름이 훨씬 좋다.
- 물론 '한 가지'만 한다는 규칙을 위반하게 된다.(이렇게 하지말라)

### 출력 인수

`public void appendFooter(StringBuffer report)`

일반적으로 출력 인수는 피해야 한다. 함수에서 상태를 변경해야 한다면 함수가 속한 객체 상태를 변경하는 방식을 취한다.

`report.appendFooter()`

## 명령과 조회를 분리하라!

함수는 뭔가를 수행하거나 뭔가에 답하거나 둘 중 하나만 해야 한다.

```java
public boolean set(String attribute, String value);
if(set("username", "unclebob") {}
```

`set` 이라는 함수가 굉장히 모호하다. `setAndCheckIfExists` 라고 하는게 훨씬 좋지만, 명령과 조회를 분리해 애초에 혼란이 일어나지 않도록 한다.

```java
if (attributeExists("username")) {
  setAttribute("username", "unclebob");
}
```

## 오류 코드보다 예외를 사용하라!

명령 함수에서 오류 코드를 반환하는 방식은 명령/조회 분리 규칙을 미묘하게 위반한다.

`if (deletePage(page) === E_OK)` 이는 '상태 코드' 종속을 유발한다. 중첩되는 if 문과 여러 상태코드의 조합이 이루어지게 된다.
- 유지보수에 치명적이고 비즈니스 로직을 한 눈에 알기 어렵다.
- 또한 오류 코드를 만났을 경우 바로 해결해야만 하는 문제가 있다.(지연처리를 의도대로 못한다는 뜻인듯)

```java
if (deletePage(page) == E_OK) {
	if (registry.deleteReference(page.name) == E_OK) {
		if (configKeys.deleteKey(page.name.makeKey()) == E_OK) {
			logger.log("page deleted");
		} else {
			logger.log("configKey not deleted");
		}
	} else {
		logger.log("deleteReference from registry failed"); 
	} 
} else {
	logger.log("delete failed"); return E_ERROR;
}
```

정상 동작과 오류 처리 동작이 뒤섞이게 되므로 굉장히 곤란하다.

```java
public void delete(Page page) {
	try {
		deletePageAndAllReferences(page);
  	} catch (Exception e) {
  		logError(e);
  	}
}

private void deletePageAndAllReferences(Page page) throws Exception { 
	deletePage(page);
	registry.deleteReference(page.name); 
	configKeys.deleteKey(page.name.makeKey());
}

private void logError(Exception e) { 
	logger.log(e.getMessage());
}
```

try/catch 블록을 별도 함수로 뽑아내 오류처리와 비즈니스 로직을 분리시킨다.

```java
public enum Error { 
	OK,
	INVALID,
	NO_SUCH,
	LOCKED,
	OUT_OF_RESOURCES, 	
	WAITING_FOR_EVENT;
}
```

오류를 처리하는 곳곳에서 오류코드를 사용하게 되면 enum class를 쓰게 되는데 이런 클래스는 의존성 자석이 된다.
- 새 오류코드를 추가하거나 변경할 때 코스트가 많이 필요하다.(재컴파일 및 재배치 등) 그러므로 예외를 사용하는 것이 더 안전하다.

### 오류 처리도 한 가지 작업이다.

함수가 '한 가지' 작업만 하듯 오류 처리도 '한 가지' 작업을 해야한다.

그러므로 오류를 처리하는 함수는 오류만 처리해야 한다.

## 반복하지 마라!

ㅎㅎ... 커플링은 커플만 하셈

## 구조적 프로그래밍

다익스트라의 구조적 프로그래밍의 원칙은 모든 함수와 함수 내 모든 블록에 입구와 출구가 하나여야 된다.
- 함수는 `return` 문이 하나여야 된다.되며, 
- 루프 안에서 `break` 나 `continue` 를 사용해선 안된다.
- `goto` 는 절대로 사용하지 말자. 
  
하지만 위의 내용은 함수가 클 때에만 상당한 이익을 제공하므로 함수를 작게 만든다면 오히려 여러차례 사용하는 것이 함수의 의도를 표현하기 쉬워진다.

## 함수를 어떻게 짜죠?

저자의 방식
1. 서투른 코드를 작성한다.
2. 이러한 코드에도 단위 테스트 케이스를 만든다.
3. 코드를 다듬고 함수를 만들고 이름을 변경한다.
4. 위의 과정에서 항상 단위 테스트를 통과해야한다.
5. 반복

## 결론

Master 프로그래머는 시스템을 ***구현할*** 프로그램이 아니라 ***풀어갈*** 이야기로 여긴다.

여러분이 작성한 함수가 분명하고 정확한 언어로 되어 있을 때 이야기를 풀어가기가 쉬워진다는 사실을 기억하라.