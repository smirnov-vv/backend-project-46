const format = {
  added: '+',
  deleted: '-',
  common: ' ',
  inner: ' ',
  updated: '',
};

const getOutput = (value, type, status, curIndent, key, indent, step, indentsAcc, formatter) => (type === 'leaf'
  ? `${curIndent}${format[status]}${key}: ${value}`
  : `${curIndent}${format[status]}${key}: {\n${formatter(value, indent, step, indentsAcc + step * 2)}\n${curIndent}  }`);

export default (diff) => {
  const formatter = (curNode, indent, step, indentsAcc = step) => {
    const tree = curNode.flatMap((node) => {
      const key = `${format[node.status]} ${node.key}`;

      const {
        value, type, status, oldValue, newValue,
      } = node;

      const curIndent = indent.repeat(indentsAcc);

      if (status === 'updated') {
        const oldNode = getOutput(oldValue, type.old, 'deleted', curIndent, key, indent, step, indentsAcc, formatter);
        const newNode = getOutput(newValue, type.new, 'added', curIndent, key, indent, step, indentsAcc, formatter);
        return `${oldNode}\n${newNode}`;
      }

      return type === 'leaf'
        ? `${curIndent}${key}: ${value}`
        : `${curIndent}${key}: {\n${formatter(value, indent, step, indentsAcc + step * 2)}\n${curIndent}  }`;
    });

    return tree.join('\n');
  };

  const indent = ' ';
  const step = 2;
  return `{\n${formatter(diff, indent, step)}\n}`;
};
