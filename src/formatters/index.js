import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';
import unknown from './unknown.js';

const format = {
  stylish,
  plain,
  json,
  unknown,
};

export default (formatName) => {
  const possibleFormats = ['stylish', 'plain', 'json'];
  const isFormatRight = possibleFormats.includes(formatName);
  return isFormatRight ? format[formatName] : format.unknown;
};
