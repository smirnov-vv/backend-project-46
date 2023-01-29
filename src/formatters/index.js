import stylish from './stylish.js';
import plain from './plain.js';

const format = {
  stylish,
  plain,
};

export default (formatName) => {
  const possibleFormats = ['stylish', 'plain'];
  const isFormatRight = possibleFormats.includes(formatName);
  if (!isFormatRight) {
    console.log(`Format "${formatName}" is unknown\n`);
    process.exit();
  }

  return format[formatName];
};
