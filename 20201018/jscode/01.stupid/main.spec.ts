import Args from './src/Args';

test('main -l', () => {
  const arg: Args = new Args('l,p#,d*', ['-l']);
  const logging: boolean = arg.getBoolean('l');
  expect(true).toBe(logging);
});

test('main -p 3000', () => {
  const arg: Args = new Args('l,p#,d*', ['-lp', '3000']);
  const logging: boolean = arg.getBoolean('l');
  const port: number = arg.getInt('p');
  expect(true).toBe(logging);
  expect(3000).toBe(port);
});

test('main -p 8080', () => {
  const arg: Args = new Args('l,p#,d*', ['-lp', '8080']);
  const port: number = arg.getInt('p');
  expect(8080).toBe(port);
});

test('main -lpd 3000 1ilsang', () => {
  const arg: Args = new Args('l,p#,d*', ['-lpd', '3000', '1ilsang']);
  const logging: boolean = arg.getBoolean('l');
  const port: number = arg.getInt('p');
  const directory: string = arg.getString('d');
  expect(true).toBe(logging);
  expect(3000).toBe(port);
  expect('1ilsang').toBe(directory);
});

test('main -ldp 1ilsang 3000', () => {
  const arg: Args = new Args('l,p#,d*', ['-ldp', '1ilsang', '3000']);
  const logging: boolean = arg.getBoolean('l');
  const port: number = arg.getInt('p');
  const directory: string = arg.getString('d');
  expect(true).toBe(logging);
  expect(3000).toBe(port);
  expect('1ilsang').toBe(directory);
});

test('main -d 1ilsang', () => {
  const arg: Args = new Args('l,p#,d*', ['-d', '1ilsang']);
  const directory: string = arg.getString('d');
  expect('1ilsang').toBe(directory);
});

test('main -pdl 3000 1ilsang', () => {
  const arg: Args = new Args('l,p#,d*', ['-pdl', '3000', '1ilsang']);
  const logging: boolean = arg.getBoolean('l');
  const port: number = arg.getInt('p');
  const directory: string = arg.getString('d');
  expect(true).toBe(logging);
  expect(3000).toBe(port);
  expect('1ilsang').toBe(directory);
});
