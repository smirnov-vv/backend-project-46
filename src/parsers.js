import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

export default (filepath) => {
  const format = path.extname(filepath);
  const data = fs.readFileSync(filepath, { encoding: 'utf8' });
  let parse;
  if (format === '.json') {
    parse = JSON.parse;
  } else if (format === '.yml' || format === '.yaml') {
    parse = yaml.load;
  } else {
    parse = () => {
      console.log('I don\'t know format of the file, please provide .json, .yml or .yaml\n');
      process.exit();
    };
  }
  return parse(data);
};
