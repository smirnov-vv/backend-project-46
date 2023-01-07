import _ from 'lodash';
import parser from './parsers.js';

export default (filepath1, filepath2) => {
  const file1 = parser(filepath1);
  const file2 = parser(filepath2);
  const file1PairsList = Object.entries(file1);
  const file2PairsList = Object.entries(file2);

  const first = file1PairsList.map(([key1, value1]) => {
    const isAllEqual = file2PairsList.some(([key2, value2]) => key1 === key2 && value1 === value2);
    return isAllEqual ? [' ', key1, value1] : ['-', key1, value1];
  });

  const second = file2PairsList.filter(([key2, value2]) => !file1PairsList
    .some(([key1, value1]) => key1 === key2 && value1 === value2))
    .map(([key2, value2]) => ['+', key2, value2]);

  const combined = [...first, ...second];
  const sorted = _.sortBy(combined, (arr) => arr[1]);
  const entries = sorted.map(([sign, key, value]) => [`${sign} ${key}`, value]);
  const result = JSON.stringify(Object.fromEntries(entries), null, ' ');
  console.log(result);
  return result;
};
