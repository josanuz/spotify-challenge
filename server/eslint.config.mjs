import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import e from 'cors';

const compat = new FlatCompat({ recommendedConfig: js.configs.recommended });

export default ts.config(
    js.configs.recommended,
    ts.configs.recommended,
    eslintConfigPrettier,
);
