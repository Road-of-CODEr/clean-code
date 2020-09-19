# 의미 있는 이름

이름을 잘 짓는 몇 가지 규칙

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
