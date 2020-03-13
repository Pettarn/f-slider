import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import VuePlugin from 'rollup-plugin-vue'

export default {
    input: "./src/lib/index.js",
    output: {
        file: './dist/FImageSlider.umd.js',
        name: 'FImageSlider',
        format: 'umd'
    },
    plugins: [
        babel({
            exclude: 'node_modules',
        }),
        commonjs(),
        VuePlugin()
    ]
}
