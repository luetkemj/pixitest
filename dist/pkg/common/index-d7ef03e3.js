import { a as ansiRegex } from './index-0d60a979.js';

var stripAnsi = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;

export { stripAnsi as s };
