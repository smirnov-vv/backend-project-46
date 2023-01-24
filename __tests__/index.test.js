import { jest } from '@jest/globals';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import main from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

let file1;
let file2;
let file3;

beforeAll(() => {
  file1 = getFixturePath('file1.json');
  file2 = getFixturePath('file2.yaml');
  file3 = getFixturePath('file3.test');
});

test('stylish', () => {
  const forwardOrder = readFile('expected_file1.txt');
  expect(main(file1, file2, 'stylish')).toEqual(forwardOrder);

  const reversedOrder = readFile('expected_file2.txt');
  expect(main(file2, file1, 'stylish')).toEqual(reversedOrder);
});

test('file extension is unknown', () => {
  jest.spyOn(process, 'exit').mockImplementation(() => {});
  expect(() => main(file1, file3, 'stylish')).toThrow();
});

test('provided format is unknown', () => {
  jest.spyOn(process, 'exit').mockImplementation(() => {});
  expect(() => main(file1, file2, 'any_unknown')).toThrow();
});
