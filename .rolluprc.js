// -------------------
// Set up environment.
//
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { terser as uglify } from 'rollup-plugin-terser'
import pkg from './package.json'

// Flags.
const isProd = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'

// Set base options.
const base = {
  input: 'src/merge.js',
  watch: {
    chokidar: true,
    include: 'src/**',
    exclude: 'node_modules/**',
    clearScreen: true
  }
}

// -----------------------
// Build config variatons.
//
// Build configs to be merged (later) with base.
let configs = [
  {
    output: [
      // CommonJS for Node.
      {
        file: pkg.main,
        format: 'cjs'
      },
      // ES module for bundlers / build systems.
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelrc: false,
        exclude: 'node_modules/**'
      }),
      isProd && uglify()
    ]
  },
  {
    output: [
      // Browser global / IIFE.
      {
        name: 'brikcss.merge',
        file: pkg.browser,
        format: 'iife'
      },
      // Browser friendly UMD.
      {
        name: 'brikcss.merge',
        file: pkg.umd,
        format: 'umd'
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: '8',
                browsers: ['last 2 versions', '> 2%']
              },
              modules: false
            }
          ]
        ]
      }),
      isProd && uglify()
    ]
  }
]

// Merge each config with base config.
configs = configs.map((config) => {
  return Object.assign({}, base, config)
})

// ---------------
// Export configs.
//
export default configs
