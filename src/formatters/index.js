import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const format = {
  stylish,
  plain,
  json,
};

export default (formatName) => {
  const possibleFormats = ['stylish', 'plain', 'json'];
  const isFormatRight = possibleFormats.includes(formatName);
  if (!isFormatRight) {
    console.log(`Format "${formatName}" is unknown\n`);
    process.exit();
  }

  return format[formatName];
};
