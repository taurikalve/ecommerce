import path from 'node:path';
import fs from 'node:fs';

export function readEnv(
  rootPath: string,
  envFallback?: 'production' | 'development',
) {
  if (!process.env.NODE_ENV && envFallback) process.env.NODE_ENV = envFallback;
  const nodeEnv = process.env.NODE_ENV;

  function getPriority(filename: string) {
    switch (filename) {
      case `.env.${nodeEnv}.local`:
        return 0;
      case `.env.${nodeEnv}`:
        return 1;
      case '.env.local':
        return 2;
      case '.env':
        return 3;
      default:
        return 4;
    }
  }
  const envRE = new RegExp(`^\.env(\.${nodeEnv})?(\.local)?$`);

  const envFiles = fs
    .readdirSync(rootPath)
    .filter((filename) => envRE.test(filename))
    .sort((a, b) => getPriority(a) - getPriority(b));

  // if (!envFiles.length) {
  //   console.log('No suitable .env files found');
  //   return;
  // }

  for (const envFile of envFiles) {
    fs.readFileSync(path.join(rootPath, envFile), 'utf8')
      .split('\n')
      .filter((line) => line && !line.startsWith('#'))
      .forEach((line) => {
        const [key, val] = line.split('=');
        // console.log(envFile + ':', key); // DEBUG
        if (!process.env[key]) process.env[key] = val; // don't override
      });
  }
}
