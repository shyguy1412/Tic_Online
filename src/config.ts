import env from '@/../.env.local';

const config: { [key: string]: string; } = {};

env.replaceAll('\r', '').split('\n').forEach((v) => {
  const [key, value] = v.split('=', 2);
  if (!key || !value) return;
  config[key] = value;
});

export default config;