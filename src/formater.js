import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const loadFormat = (formatName) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const possibleFormats = ['stylish'];
  const isFormatRight = possibleFormats.includes(formatName);
  if (!isFormatRight) {
    console.log(`Format "${formatName}" is unknown`);
    process.exit();
  }

  const pathToFormat = path.join(__dirname, 'formats', `${formatName}.json`);
  const format = JSON.parse(fs.readFileSync(pathToFormat, { encoding: 'utf8' }));
  return format;
};

export default (diff, formatName) => {
  const format = loadFormat(formatName);

  const formater = (curDiff, indent, step, indentsAcc = step) => {
    const tree = curDiff.map((node) => {
      const key = `${format[node.status]} ${node.key}`;
      const { value } = node;
      const curIndent = indent.repeat(indentsAcc);
      return node.type === 'leaf'
        ? `${curIndent}${key}: ${value}`
        : `${curIndent}${key}: {\n${formater(value, indent, step, indentsAcc + step * 2)}\n${curIndent}  }`;
    });

    return tree.join('\n');
  };

  const indent = ' ';
  const step = 2;
  return `{\n${formater(diff, indent, step)}\n}`;
};
