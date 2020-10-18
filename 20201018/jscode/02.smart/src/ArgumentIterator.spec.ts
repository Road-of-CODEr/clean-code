import ArgumentIterator from './ArgumentIterator';
const iter = new ArgumentIterator(['a', 'b', 'c', 'd', 'e']);

test('ArgumentIterator', () => {
  expect(iter.next()).toEqual({ value: 'a', done: false });
  expect(iter.next()).toEqual({ value: 'b', done: false });
  expect(iter.next()).toEqual({ value: 'c', done: false });
  expect(iter.next()).toEqual({ value: 'd', done: false });
  expect(iter.next()).toEqual({ value: 'e', done: false });
  expect(iter.next()).toEqual({ value: undefined, done: true });
  expect(iter.next()).toEqual({ value: undefined, done: true });
  expect(iter.previous()).toEqual({ value: 'e', done: false });
  expect(iter.previous()).toEqual({ value: 'd', done: false });
  expect(iter.previous()).toEqual({ value: 'c', done: false });
  expect(iter.previous()).toEqual({ value: 'b', done: false });
  expect(iter.previous()).toEqual({ value: 'a', done: false });
  expect(iter.previous()).toEqual({ value: undefined, done: true });
  expect(iter.previous()).toEqual({ value: undefined, done: true });
  expect(iter.next()).toEqual({ value: 'a', done: false });
  expect(iter.next()).toEqual({ value: 'b', done: false });
  expect(iter.previous()).toEqual({ value: 'a', done: false });
});

// function test() {
//   // [a, b, c, d, e];
//   console.log(iter.next());
//   console.log(iter.next());
//   console.log(iter.next());
//   console.log(iter.next());
//   console.log(iter.next());
//   console.log(iter.next());
//   console.log(iter.next(), iter.getValues());
//   console.log(iter.previous());
//   console.log(iter.previous());
//   console.log(iter.previous());
//   console.log(iter.previous());
//   console.log(iter.previous());
//   console.log(iter.previous());
//   console.log(iter.previous());
//   console.log(iter.next());
//   console.log(iter.next());
//   console.log(iter.previous());
// }

// test();