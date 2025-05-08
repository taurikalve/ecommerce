import fs from 'node:fs';
import path from 'node:path';
import { generateKeyPairSync } from 'node:crypto';
import { __certsDir } from '@/lib/consts';

let publicKey: string, privateKey: string;
const publicKeyFile = path.join(__certsDir, 'jwt-public.key');
const privateKeyFile = path.join(__certsDir, 'jwt-private.key');

if (!(fs.existsSync(publicKeyFile) && fs.existsSync(privateKeyFile))) {
  // Create new
  const keyObj = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  fs.mkdirSync(__certsDir, { recursive: true });
  fs.writeFileSync(publicKeyFile, (publicKey = keyObj.publicKey));
  fs.writeFileSync(privateKeyFile, (privateKey = keyObj.privateKey));
} else {
  // Use existing
  publicKey = fs.readFileSync(publicKeyFile, 'utf8');
  privateKey = fs.readFileSync(privateKeyFile, 'utf8');
}

export { publicKey, privateKey };
