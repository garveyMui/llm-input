import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import packageJson from "./package.json" assert {type: "json"};
import json from "@rollup/plugin-json";
import replace from '@rollup/plugin-replace';
import react from "@vitejs/plugin-react";
import babel from '@rollup/plugin-babel';

export default {
    input: "src/index.ts",
    output: [
        {
            file: packageJson.main,
            format: "cjs",
            sourcemap: true,
        },
        {
            file: packageJson.module,
            format: "es",
            sourcemap: true,
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        json(),
        react({
            jsxRuntime: 'automatic',  // Ensures JSX works properly
            development: process.env.NODE_ENV === 'development',  // Only enable React Fast Refresh in development
        }),
        typescript({ tsconfig: "./tsconfig.json" }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        }),
        babel({
            babelHelpers: 'bundled',
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: 'defaults',
                        modules: false, // 关闭模块转换
                        ...(process.env.NODE_ENV === 'production' ? { useBuiltIns: 'usage', corejs: 3 } : {}),
                    },
                ],
            ],
        }),
    ],
    external: ['react']
};
