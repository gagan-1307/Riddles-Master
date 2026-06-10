import { execSync } from 'child_process';

try {
  console.log('Running: prisma generate');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('Running: astro build');
  execSync('npx astro build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build step failed:', error);
  process.exit(1);
}
