module.exports = {
    root: true,
    env: {browser: true, es2020: true},
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        // this plugin requires prettier to work
        "plugin:prettier/recommended"
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json'
    },
    plugins: [
        'react-refresh'
    ],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            {allowConstantExport: true},
        ],
        "max-len": ["warn", {"code": 80}],
        "quotes": ["error", "double", {"avoidEscape": true}],
        "no-multiple-empty-lines": ["error", {"max": 2, "maxEOF": 0}],
        "@typescript-eslint/indent": ["error", 2],
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "error",
        '@typescript-eslint/naming-convention': [
            'warn',
            {
                selector: 'variable',
                format: ['camelCase', 'UPPER_CASE'],
                leadingUnderscore: 'allow',
                trailingUnderscore: 'allow',
            },
            {
                selector: 'variable',
                modifiers: ['const', 'exported'],
                types: ['function'],
                format: ['PascalCase'],
                leadingUnderscore: 'allow',
                trailingUnderscore: 'allow',
            },
            {
                selector: 'typeLike',
                format: ['PascalCase'],
            },
        ],
    },
}
