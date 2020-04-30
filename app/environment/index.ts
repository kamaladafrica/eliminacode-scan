import environment from './environment';

let env = {};
if (process.env.NODE_ENV === 'production') {
  env = require('./environment.prod').default;
}

const merged = { ...(environment ?? {}), ...(env ?? {}) };

export default merged;
