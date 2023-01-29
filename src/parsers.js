import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const mapping = {
  yml: yaml.load,
  yaml: yaml.load,
  json: JSON.parse,
  unknown: {},
};

export default (filepath) => {
  const extension = path.extname(filepath).slice(1);
  const data = fs.readFileSync(filepath, { encoding: 'utf8' });
  const possibleExtensions = ['yml', 'yaml', 'json'];
  const isExtensionRight = possibleExtensions.includes(extension);
  return isExtensionRight ? mapping[extension](data) : mapping.unknown;
};
