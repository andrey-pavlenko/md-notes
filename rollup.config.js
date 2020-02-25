import svelte from 'rollup-plugin-svelte';
import noderesolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';

// eslint-disable-next-line no-undef
const production = process.env.NODE_ENV === 'production';

const destPath = 'public/';

const env = require(production
  ? './env.production.json'
  : './env.development.json');

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        // eslint-disable-next-line no-undef
        require('child_process').spawn(
          'npm',
          ['run', 'start:sirv', '--', '--dev'],
          {
            stdio: ['ignore', 'inherit', 'inherit'],
            shell: true
          }
        );
      }
    }
  };
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: !production,
    format: 'iife',
    name: 'app',
    file: destPath + 'bundle.js'
  },
  watch: {
    clearScreen: false
  },
  plugins: [
    svelte({
      dev: !production,
      emitCss: true
    }),
    noderesolve({
      browser: true,
      dedupe: importee =>
        importee === 'svelte' || importee.startsWith('svelte/')
    }),
    commonjs(),
    !production && serve(),
    !production && livereload('public'),
    production && terser(),
    replace({
      exclude: 'node_modules/**',
      'env.__options_contentsUrl__': env.__options_contentsUrl__
    }),
    postcss({
      extract: true,
      minimize: production,
      sourceMap: !production
    })
  ]
};
