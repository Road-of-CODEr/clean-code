# 4장 주석

> 나쁜 코드에 주석을 달지 마라. 새로 짜라 - 브라이언 W.커니핸, P.J.플라우거

## 구성

1. [Intro](#intro)

2. [주석은 나쁜 코드를 보완하지 못한다.](#주석은-나쁜-코드를-보완하지-못한다)

3. [코드로 의도를 표현하라](#코드로-의도를-표현하라)

4. [좋은 주석](#좋은-주석)
5. [나쁜 주석](#나쁜-주석)


## Intro

주석은 '순수하게 선하지' 못하다. 주석은 기껏해야 요약이다.

우리는 코드로 의도를 표현하지 못해, 실패를 만회하기 위해 주석을 사용한다.

오래된 주석은 거짓말을 하고 모호한 정보를 던져 빙빙 돌아가게 만든다. 이로 인해 엄청난 불행이 뒤따른다.

## 주석은 나쁜 코드를 보완하지 못한다.

코드에 주석을 추가하는 가장 큰 이유는 코드 품질이 나빠서이다. 짧고, 명확하게 알아볼 수 있는 깔끔한 코드에는 주석이 필요하지 않다.

주석으로 설명하려 애쓰는 대신 그 난장판을 깨끗이 치우는 데 시간을 보내라.

## 코드로 의도를 표현하라

```java
// 직원에게 복지 혜택을 받을 자격이 있는지 검사한다. 
if ((emplotee.flags & HOURLY_FLAG) && (employee.age > 65)
```

주석으로 의도를 표현하지 말고 코드로 표현하라.

```java
if (employee.isEligibleForFullBenefits())
```

## 좋은 주석

어떤 주석은 필요하거나 유익하다. 하지만 정말로 좋은 주석은 주석을 달지 않을 방법을 찾아낸 주석이라는 것을 명심하라.

### 법적인 주석

```javascript
// Copyright (C) 2003, 2004, 2005 by Object Montor, Inc. All right reserved.
// GNU General Public License
```

### 정보를 제공하는 주석

```java
// 테스트 중인 Responder 인스턴스를 반환
protected abstract Responder responderInstance();
```

물론 이 또한 `responderBeingTested` 로 바꾸면 없앨 수 있다.

### 의도를 설명하는 주석

```java
// 스레드를 대량 생성하는 방법으로 어떻게든 경쟁 조건을 만들려 시도한다. 
for (int i = 0; i > 2500; i++) {
    WidgetBuilderThread widgetBuilderThread = 
        new WidgetBuilderThread(widgetBuilder, text, parent, failFlag);
    Thread thread = new Thread(widgetBuilderThread);
    thread.start();
}
```

### 의미를 명료하게 밝히는 주석

```java
assertTru(a.compareTo(a) == 0); // a == a
assertTru(a.compareTo(b) == -1); // a < a
assertTru(a.compareTo(aa) == 1); // a > aa
```

### 결과를 경고하는 주석

```java
// 여유 시간이 충분하지 않다면 실행하지 마십시오.
public void _testWithReallyBigFile()
```

```java
public static simpleDateFormat makeStandardHttpDateFormat() {
  // SimpleDateFormat 은 스레드에 안전하지 못하다.
  // 그러므로 각 인스턴스를 독립적으로 생성해야 한다.
  SimpleDateFormat df = new SimpleDateFormat("EEE, dd MMM  yyyy HH:mm:ss z");
  df.setTimeZone(TimeZone.getTimeZone("GMT"));
  return df;
}
```

두 번째의 경우가 특히 적절한 주석인데, 그 이유는 프로그램 효율을 높이기 위해 정적 초기화 함수를 사용하려는 프로그래머에게 실수할 수 있음을 경고해 준다.(`new 제거`)

### TODO 주석

앞으로 할 일은 `TODO` 로 남겨두면 편하다.

```java
// TODO-MdM 현재 필요하지 않다.
// 체크아웃 모델을 도입하면 함수가 필요 없다.
protected VersionInfo makeVersion() throws Exception {
    return null;
}
```

> VSCode TODO Highlight

더보기) 
- `HACK`: 문제/버그를 우회하기 위해 쓰여진 코드. 문제를 야기하거나 수정의 여지가 있음. 아름답지 않은 코드.
- `XXX`: 여기에 뭔가 발생 가능한 함정이 있음. 경고.
- `FIXME`: 효과가 있는 코드지만 개선의 여지가 있거나 오작동 중(`hotfix` 등의 이유로 급하게 작성된 코드로 재작성이 필요함) 
- `BUG`: 여기가 문제의 지점 
- `NOTE`: description

### 중요성을 강조하는 주석

```java
String listItemContent = match.group(3).trim();
// 여기서 trim은 정말 중요하다. trim 함수는 문자열에서 시작 공백을 제거한다.
// 문자열에 시작 공백이 있으면 다른 문자열로 인식되기 때문이다. 
new ListItemWidget(this, listItemContent, this.level + 1);
return buildList(text.substring(match.end()));
```

### 공개 API에서 Javadocs

풍부한 예시

## 나쁜 주석

대다수의 주석이 이 범주에 속한다. 엉성한 코드를 변명하거나 허술한 코드를 지탱하려 한다.

### 주절거리는 주석

```java
public void loadProperties() {
  try {
    String propertiesPath = propertiesLocation + "/" + PROPERTIES_FILE;
    FileInputStream propertiesStream = new FileInputStream(propertiesPath);
    loadedProperties.load(propertiesStream);
  } catch (IOException e) {
    // 속성 파일이 없다면 기본값을 모두 메모리로 읽어 들였다는 의미다. 
  }
}
```

저 주석의 의미를 알아내려면 다른 코드를 뒤져보는 수밖에 없다. 이해가 안되어 다른 모듈까지 뒤져야 하는 주석은 제대로 된 주석이 아니다.

### 같은 이야기를 중복하는 주석

```java
// this.closed가 true일 때 반환되는 유틸리티 메서드다.
// 타임아웃에 도달하면 예외를 던진다. 
public synchronized void waitForClose(final long timeoutMillis) throws Exception {
  if (!closed) {
    wait(timeoutMillis);
    if (!closed) {
      throw new Exception("MockResponseSender could not be closed");
    }
  }
}
```

중복된 주석은 코드보다 주석을 읽는게 더 길게 만든다.

### 오해할 여지가 있는 주석

위의 코드에서 `this.closed` 가 `true` 로 **변하는 순간**에 반환하지 않는다. `this.closed` 가 `true` 여야 메서드를 반환한다.
- wait 의 타임아웃을 무조건 기다렸다가 에러를 통해 확인하게 된다.

### 의무적으로 다는 주석

```java
/**
 *
 * @param title CD 제목
 * @param author CD 저자
 * @param tracks CD 트랙 숫자
 * @param durationInMinutes CD 길이(단위: 분)
 */
public void addCD(String title, String author, int tracks, int durationInMinutes) {
    CD cd = new CD();
    cd.title = title;
    cd.author = author;
    cd.tracks = tracks;
    cd.duration = durationInMinutes;
    cdList.add(cd);
}
```

모든 함수에 `Javadocs` 를 달거나 모든 변수에 주석을 달아야 한다는 규칙은 어리석다. 위의 주석은 아무런 가치가 없다.

### 이력을 기록하는 주석

```markdown
* 변경 이력 (11-Oct-2001부터)
* ------------------------------------------------
* 11-Oct-2001 : 클래스를 다시 정리하고 새로운 패키징
* 05-Nov-2001: getDescription() 메소드 추가
* 이하 생략
```

깃이 다 해준다.

### 있으나 마나 한 주석

```java
/*
 * 기본 생성자
 */
protected AnnualDateRule() {
}
```

### 무서운 잡음

```java
/** The licenceName. */
private String licenceName;
```

오타가 보이는가?

### 함수나 변수로 표현할 수 있다면 주석을 달지 마라

```java
// 전역 목록 <smodule>에 속하는 모듈이 우리가 속한 하위 시스템에 의존하는가?
if (module.getDependSubsystems().contains(subSysMod.getSubSystem()))
```

주석을 제거해 아래와 같이 표현하자

```java
ArrayList moduleDependencies = smodule.getDependSubSystems();
String ourSubSystem = subSysMod.getSubSystem();
if (moduleDependees.contains(ourSubSystem))
```

### 위치를 표시하는 주석

```javascript
// Actions ////////////////////////////////
```

환기가 필요할 때 아주 드물게 사용하는게 낫다.

### 닫는 괄호에 다는 주석

```javascript
const a = () => {
  if(state) {
    while(t) {
      break;
    } //while
  } // if
}
```

중첩이 심하고 장황한 함수라면 의미가 있을지 모르지만, 우리의 클린 코드에 중첩이 심하고 장황한 함수는 있을 수 없다.

그러므로 닫는 괄호에 다는 주석은 불필요하다.

### 공로를 돌리거나 저자를 표시하는 주석

```javascript
/* 출이 추가함 */
```

깃은 괜히 있는게 아니다

### 주석으로 처리한 코드

```java
this.bytePos = writeBytes(pngIdBytes, 0);
//hdrPos = bytePos;
writeHeader();
writeResolution();
//dataPos = bytePos;
if (writeImageData()) {
    wirteEnd();
    this.pngBytes = resizeByteArray(this.pngBytes, this.maxPos);
} else {
    this.pngBytes = null;
}
return this.pngBytes;
```

깃이 버전 및 히스토리를 관리한다. 과감히 지우도록 하라.

### HTML 주석

***소스 코드에서 HTML 주석은 혐오 그 자체다.***(실제로 이렇게 적혀있음)

```java
/**
 * 주석의 설명문
 * 
 * <pre>
 * {@code
 * Foo foo = new Foo();
 * foo.foo();
 * }
 * </pre>
 */
 ```

`Javadocs` 와 같은 도구로 주석을 뽑아 웹 페이지에 올려야 한다면 주석에 HTML 태그를 삽입하는 것은 도구가 해야한다.

### 전역 경보

주석을 달아야 한다면 근처에 있는 코드만 기술하라. 시스템의 전반적인 형태, 정보를 담지 말아야 한다.(잘못된 정보의 최선봉)

### 너무 많은 정보

디테일하게 적을 필요가 없다.

### 모호한 관계

주석과 주석이 설명하는 코드는 둘 사이 관계가 명백해야 한다.

### 함수 헤더

짧은 함수는 긴 설명이 필요 없다. 헤더처리를 주석으로 하지마라.

### 비공개 코드에서 Javadocs

공개 API 가 아니라면 쓸모가 없다.

