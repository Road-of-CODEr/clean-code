# 5장 형식 맞추기

컨벤션에 관한 이야기들

## 구성

1. [형식을 맞추는 목적](#형식을-맞추는-목적)
2. [적절한 행 길이를 유지하라](#적절한-행-길이를-유지하라)
3. [가로 형식 맞추기](#가로-형식-맞추기)
4. [팀 규칙](#팀-규칙)
5. [밥 아저씨의 형식 규칙](#밥-아저씨의-형식-규칙)

## 형식을 맞추는 목적

코드의 형식은 너무 중요하다. 코드의 형식은 의사소통의 일환이다.

의사소통은 전문 개발자의 일차적인 **의무**다.

오늘 구현한 코드의 기능은 변경될 수 있으나, 구현된 코드의 형태는 그 다음 기능에서도 남아있게 된다.
- 앞으로의 가독성에 지대한 영향을 미치게 된다.
- 원래의 코드는 사라질지라도 개발자의 스타일과 규율은 사라지지 않는다.

원할한 소통을 장려하는 코드 형식은 무엇일까?

## 적절한 행 길이를 유지하라

`JUnit` 과 같은 자바 프로젝트들은 파일당 최대 500줄을 넘지 않으며 평균 200줄 정도를 기록한다.

이는 거대한 프로젝트에 긴 소스파일이 필요없다는 것을 의미한다.

일반적으로 큰 파일보다는 작은 파일이 이해하기 쉽다.

### 신문 기사처럼 작성하라

좋은 신문 기사는 최상단에 표제, 첫 문단에는 전체 기사 내용을 요약하며 기사를 읽어 내려갈 수록 세세한 사실이 조금씩 들어나며 세부사항을 보여준다.

소스 파일도 신문 기사와 비슷하게 작성한다.

### 개념은 빈 행으로 분리하라

```java
// 빈 행을 넣지 않을 경우
package fitnesse.wikitext.widgets;
import java.util.regex.*;
public class BoldWidget extends ParentWidget {
	public static final String REGEXP = "'''.+?'''";
	private static final Pattern pattern = Pattern.compile("'''(.+?)'''",
		Pattern.MULTILINE + Pattern.DOTALL);
	public BoldWidget(ParentWidget parent, String text) throws Exception {
		super(parent);
		Matcher match = pattern.matcher(text); match.find(); 
		addChildWidgets(match.group(1));}
	public String render() throws Exception { 
		StringBuffer html = new StringBuffer("<b>"); 		
		html.append(childHtml()).append("</b>"); 
		return html.toString();
	} 
}
```

빈 행만으로 훨씬 가독성 좋은 코드를 만들 수 있다. 또한 줄바꿈을 통해 **개념의 분리**를 할 수 있다.

```java
// 빈 행을 넣을 경우
package fitnesse.wikitext.widgets;

import java.util.regex.*;

public class BoldWidget extends ParentWidget {
	public static final String REGEXP = "'''.+?'''";
	private static final Pattern pattern = Pattern.compile("'''(.+?)'''", 
		Pattern.MULTILINE + Pattern.DOTALL
	);
	
	public BoldWidget(ParentWidget parent, String text) throws Exception { 
		super(parent);
		Matcher match = pattern.matcher(text);
		match.find();
		addChildWidgets(match.group(1)); 
	}
	
	public String render() throws Exception { 
		StringBuffer html = new StringBuffer("<b>"); 
		html.append(childHtml()).append("</b>"); 
		return html.toString();
	} 
}
```

### 세로 밀집도

줄바꿈이 개념을 분리한다면 세로 밀집도는 연관성을 의미한다.

```java
// 변수 2개에 메소드가 1개인 클래스라는 사실이 드러난다.
public class ReporterConfig {
	private String m_className;
	private List<Property> m_properties = new ArrayList<Property>();
	
	public void addProperty(Property property) { 
		m_properties.add(property);
	}
```

서로 밀접한 코드 행은 세로로 가까이 놓여야 한다는 뜻.

### 수직 거리

서로 밀접한 개념은 세로로 가까이 두어야 한다. 이 함수에서 저 함수로 오가며 소스 파일을 위 아래로 뺑뺑이 도는 것은 결코 좋은 경험이 아니다.

물론 두 개념이 서로 다른 파일에 속한다면 규칙이 통하지 않는다. 하지만 타당한 근거가 없다면 서로 밀접한 개념은 한 파일에 속해야 마땅하다.(`protected` 변수를 피해야 하는 이유 중 하나)

연관성: 한 개념을 이해하는 데 다른 개념이 중요한 정도

연관성이 깊은 두 갠며이 멀리 떨어져 있으면 코드를 읽는 사람이 소스 파일과 클래스를 여기저기 뒤지게 된다.

**변수선언**은 사용하는 위치에서 최대한 가까이 선언한다.

**인스턴스 변수**는 클래스 맨 처음(혹은 끝)에 선언한다.

```java
/*
** 함수에서 가장 먼저 호출하는 함수가 먼저 정의된다.
** 다음으로 호출하는 함수는 그 아래에 정의된다. 
** 호출되는 함수를 찾기가 쉬워지며 전체 가독성도 높아진다
**/
public class WikiPageResponder implements SecureResponder { 
	protected WikiPage page;
	protected PageData pageData;
	protected String pageTitle;
	protected Request request; 
	protected PageCrawler crawler;
	
	public Response makeResponse(FitNesseContext context, Request request) throws Exception {
		String pageName = getPageNameOrDefault(request, "FrontPage");
		loadPage(pageName, context); 
		if (page == null)
			return notFoundResponse(context, request); 
		else
			return makePageResponse(context); 
		}

	private String getPageNameOrDefault(Request request, String defaultPageName) {
		String pageName = request.getResource(); 
		if (StringUtil.isBlank(pageName))
			pageName = defaultPageName;

		return pageName; 
	}
	
	protected void loadPage(String resource, FitNesseContext context)
		throws Exception {
		WikiPagePath path = PathParser.parse(resource);
		crawler = context.root.getPageCrawler();
		crawler.setDeadEndStrategy(new VirtualEnabledPageCrawler()); 
		page = crawler.getPage(context.root, path);
		if (page != null)
			pageData = page.getData();
	}
	
	private Response notFoundResponse(FitNesseContext context, Request request)
		throws Exception {
		return new NotFoundResponder().makeResponse(context, request);
	}
	
	private SimpleResponse makePageResponse(FitNesseContext context)
		throws Exception {
		pageTitle = PathParser.render(crawler.getFullPath(page)); 
		String html = makeHtml(context);
		SimpleResponse response = new SimpleResponse(); 
		response.setMaxAge(0); 
		response.setContent(html);
		return response;
	} 
...
```

**종속 함수**는 두 함수를 세로로 가까이 배치한다. 가능하다면 호출되는 함수를 호출하는 함수보다 뒤에 배치한다.

makeResponse 함수에서 호출하는 getPageNameOrDefault함수 안에서 "FrontPage" 상수를 사용하지 않고 상수를 알아야 의미 전달이 쉬워지는 함수 위치에서 실제 사용하는 함수로 상수를 넘겨주는 방법이 가독성 관점에서 훨씬 더 좋다

**개념의 유사성**

개념적인 친화도가 높을 수록 코드를 가까이 배치한다.

```java
public class Assert {
	static public void assertTrue(String message, boolean condition) {
		if (!condition) 
			fail(message);
	}

	static public void assertTrue(boolean condition) { 
		assertTrue(null, condition);
	}

	static public void assertFalse(String message, boolean condition) { 
		assertTrue(message, !condition);
	}
	
	static public void assertFalse(boolean condition) { 
		assertFalse(null, condition);
	} 
...
```

친화도가 높은 요인은 여러가지다. 그 중 하나가 앞에서 본 직접적인 종속성이다.

이런 경우에는 종속성은 오히려 부차적 요인이므로 종속적인 관계가 없더라도 가까이 배치하면 좋다.

### 세로 순서

함수 호출 종속성은 아래 방향으로 유지한다. 이렇게 하면 자연스럽게 소스 코드 모듈이 고차원에서 저차원으로 내려간다.

## 가로 형식 맞추기

앞에서 각 오픈소스들의 세로 형식을 비교 했듯 가로 형식을 비교해보면 평균적으로 45자 근처이다.

저자는 120자 정도로 행 길이를 제한한다.

### 가로 공백과 밀집도

행에서 공백을 이용하면 밀접/느슨한 개념을 표현할 수 있다.

### 가로 정렬

```java
public class FitNesseExpediter implements ResponseSender {
	private		Socket		  socket;
	private 	InputStream 	  input;
	private 	OutputStream 	  output;
	protected 	long		  requestParsingTimeLimit;
	private 	long		  requestProgress;
	private 	long		  requestParsingDeadline;
	private 	boolean		  hasError;
	
	public FitNesseExpediter(Socket         s,
                           FitNessContext context) throws Exception {
    this.context =            context;
    socket =                  s;
    requestParsingTimeLimit = 10000;
  }
```

깔끔해 보일 지 모르나 코드의 엉뚱한 부분을 강조해 진짜 의도가 가려진다.

할당 연산자는 잘 안보이고 오른쪽 피연산자에 눈이 간다는게 핵심.

또한 대부분의 린트에서 지원하지 않는다.

### 들여쓰기

들여쓰기를 잘 해놓으면 구조가 한 눈에 들어온다.

## 팀 규칙

프로그래머라면 각자 선호하는 규칙이 있다. 하지만 팀에 속한다면 자신이 선호해야 할 규칙은 바로 팀 규칙이다.

좋은 소프트웨어 시스템은 읽기 쉬운 문서로 이뤄진다는 사실을 기억하기 바란다. 스타일은 일관적이고 매끄러워야 한다.

## 밥 아저씨의 형식 규칙

아래는 저자가 사용하는 규칙이 드러나는 코드다.

```java
public class CodeAnalyzer implements JavaFileAnalysis { 
	private int lineCount;
	private int maxLineWidth;
	private int widestLineNumber;
	private LineWidthHistogram lineWidthHistogram; 
	private int totalChars;
	
	public CodeAnalyzer() {
		lineWidthHistogram = new LineWidthHistogram();
	}
	
	public static List<File> findJavaFiles(File parentDirectory) { 
		List<File> files = new ArrayList<File>(); 
		findJavaFiles(parentDirectory, files);
		return files;
	}
	
	private static void findJavaFiles(File parentDirectory, List<File> files) {
		for (File file : parentDirectory.listFiles()) {
			if (file.getName().endsWith(".java")) 
				files.add(file);
			else if (file.isDirectory()) 
				findJavaFiles(file, files);
		} 
	}
	
	public void analyzeFile(File javaFile) throws Exception { 
		BufferedReader br = new BufferedReader(new FileReader(javaFile)); 
		String line;
		while ((line = br.readLine()) != null)
			measureLine(line); 
	}
	
	private void measureLine(String line) { 
		lineCount++;
		int lineSize = line.length();
		totalChars += lineSize; 
		lineWidthHistogram.addLine(lineSize, lineCount);
		recordWidestLine(lineSize);
	}
	
	private void recordWidestLine(int lineSize) { 
		if (lineSize > maxLineWidth) {
			maxLineWidth = lineSize;
			widestLineNumber = lineCount; 
		}
	}

	public int getLineCount() { 
		return lineCount;
	}

	public int getMaxLineWidth() { 
		return maxLineWidth;
	}

	public int getWidestLineNumber() { 
		return widestLineNumber;
	}

	public LineWidthHistogram getLineWidthHistogram() {
		return lineWidthHistogram;
	}
	
	public double getMeanLineWidth() { 
		return (double)totalChars/lineCount;
	}

	public int getMedianLineWidth() {
		Integer[] sortedWidths = getSortedWidths(); 
		int cumulativeLineCount = 0;
		for (int width : sortedWidths) {
			cumulativeLineCount += lineCountForWidth(width); 
			if (cumulativeLineCount > lineCount/2)
				return width;
		}
		throw new Error("Cannot get here"); 
	}
	
	private int lineCountForWidth(int width) {
		return lineWidthHistogram.getLinesforWidth(width).size();
	}
	
	private Integer[] getSortedWidths() {
		Set<Integer> widths = lineWidthHistogram.getWidths(); 
		Integer[] sortedWidths = (widths.toArray(new Integer[0])); 
		Arrays.sort(sortedWidths);
		return sortedWidths;
	} 
}
```