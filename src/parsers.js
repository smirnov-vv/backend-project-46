import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

export default (filepath) => {
  const extension = path.extname(filepath);
  const data = fs.readFileSync(filepath, { encoding: 'utf8' });
  let parse;
  if (extension === '.json') {
    parse = JSON.parse;
  } else if (extension === '.yml' || extension === '.yaml') {
    parse = yaml.load;
  } else {
    parse = () => {
      console.log(`Extension "${extension}" is unknown, please provide .json, .yml or .yaml\n`);
      return;
    };
  }
  return parse(data);
};
