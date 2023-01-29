const getOutput = (value, type) => {
  if (type === 'ancestor') {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const makeNote = {
  added: ({ value, type }, path) => `Property '${path}' was added with value: ${getOutput(value, type)}`,

  deleted: (node, path) => `Property '${path}' was removed`,

  updated: ({ oldValue, newValue, type }, path) => {
    const fromValue = getOutput(oldValue, type.old);
    const toValue = getOutput(newValue, type.new);
    return `Property '${path}' was updated. From ${fromValue} to ${toValue}`;
  },
  common: () => 'filter it',
  inner: () => 'filter it',
};

export default (diff) => {
  const formatter = (children, pathAcc = '') => {
    const tree = children
      .flatMap((node) => {
        const {
          key, status, type, value,
        } = node;

        if (status === 'common' && type !== 'leaf') {
          return formatter(value, `${pathAcc}.${key}`);
        }
        return makeNote[status](node, `${pathAcc}.${key}`.slice(1));
      });

    return tree;
  };

  const result = formatter(diff)
    .filter((line) => line !== 'filter it')
    .join('\n');

  return result;
};
