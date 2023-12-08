import { context } from 'squid-ssr';
import { EnvPlugin } from 'esbuild-env-plugin';

const WATCH = process.argv.includes('--watch');

const createContext = async () => await context({
  preserveSymlinks: true,
  plugins: [EnvPlugin()],
  tsconfig: './tsconfig.json',
  loader: {
    '.jpg': 'file'
  },
  minify: false
});

let ctx = await createContext();
if (WATCH) {
  ctx.watch();
} else {
  await ctx.rebuild();
  ctx.dispose();
}