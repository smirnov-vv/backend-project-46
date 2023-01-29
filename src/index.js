import _ from 'lodash';
import parser from './parsers.js';
import getFormatter from './formatters/index.js';

const isObject = (element) => (typeof element === 'object') && (!Array.isArray(element)) && (element !== null);

const hasAncestorStatus = (ancestorStatuses) => {
  const statuses = ['added', 'deleted'];
  return statuses.some((status1) => ancestorStatuses.some((status2) => status1 === status2));
};

const conditions = [
  (obj1, obj2, key) => (Object.hasOwn(obj1, key) && !Object.hasOwn(obj2, key)), // 1st obj has key
  (obj1, obj2, key) => (!Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)), // 2nd obj has key
  (obj1, obj2, key) => (isObject(obj1[key]) && isObject(obj2[key])), // Both values are objects
  (obj1, obj2, key) => (isObject(obj1[key])), // First object value is object, second is not
  (obj1, obj2, key) => (isObject(obj2[key])), // Second object value is object, first is not
  (obj1, obj2, key) => (obj1[key] === obj2[key]), // Both values aren't objects and they are equal
  (obj1, obj2, key) => (obj1[key] !== obj2[key]), // Both values aren't objects and they arent equal
];

const makeNode = {
  0: (obj1, obj2, key, makeDiff, node, ancestorStatuses) => {
    const type = isObject(obj1[key]) ? 'ancestor' : 'leaf';
    const status = hasAncestorStatus(ancestorStatuses) ? 'inner' : 'deleted';
    const updatedNode = { ...node, type, status };
    return type === 'ancestor'
      ? { ...updatedNode, value: makeDiff(obj1[key], {}, [...ancestorStatuses, status]) }
      : { ...updatedNode, value: obj1[key] };
  },

  1: (obj1, obj2, key, makeDiff, node, ancestorStatuses) => {
    const type = isObject(obj2[key]) ? 'ancestor' : 'leaf';
    const status = hasAncestorStatus(ancestorStatuses) ? 'inner' : 'added';
    const updatedNode = { ...node, type, status };
    return type === 'ancestor'
      ? { ...updatedNode, value: makeDiff({}, obj2[key], [...ancestorStatuses, status]) }
      : { ...updatedNode, value: obj2[key] };
  },

  2: (obj1, obj2, key, makeDiff, node, ancestorStatuses) => (
    { ...node, type: 'ancestor', value: makeDiff(obj1[key], obj2[key], ancestorStatuses) }
  ),

  3: (obj1, obj2, key, makeDiff, node, ancestorStatuses) => ({
    ...node,
    type: { old: 'ancestor', new: 'leaf' },
    status: 'updated',
    oldValue: makeDiff(obj1[key], {}, [...ancestorStatuses, 'deleted']),
    newValue: obj2[key],
  }),

  4: (obj1, obj2, key, makeDiff, node, ancestorStatuses) => ({
    ...node,
    type: { old: 'leaf', new: 'ancestor' },
    status: 'updated',
    oldValue: obj1[key],
    newValue: makeDiff(obj2[key], {}, [...ancestorStatuses, 'deleted']),
  }),

  5: (obj1, obj2, key, makeDiff, node) => ({ ...node, value: obj1[key] }),

  6: (obj1, obj2, key, makeDiff, node) => ({
    ...node,
    type: { old: 'leaf', new: 'leaf' },
    status: 'updated',
    oldValue: obj1[key],
    newValue: obj2[key],
  }),
};

export default (filepath1, filepath2, formatName) => {
  const file1 = parser(filepath1);
  const file2 = parser(filepath2);

  const makeDiff = (obj1, obj2, ancestorStatuses = []) => {
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);
    const uniqKeys = _.uniq([...obj1Keys, ...obj2Keys]);
    const diffTree = uniqKeys.sort()
      .flatMap((key) => {
        const funcIndex = conditions.findIndex((condition) => condition(obj1, obj2, key));
        const node = { key, type: 'leaf', status: 'common' };
        return makeNode[funcIndex](obj1, obj2, key, makeDiff, node, ancestorStatuses);
      });

    return diffTree;
  };

  const diff = makeDiff(file1, file2);
  const formatter = getFormatter(formatName);
  const result = formatter(diff);
  console.log(result);
  return result;
};
