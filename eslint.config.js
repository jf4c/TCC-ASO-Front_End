// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettier = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettier
    ],
    plugins: {
      prettier: prettierPlugin,
    },
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/component-selector": [
        "error",
        {
          "type": "element",
          "prefix": ["aso"],
          "style": "kebab-case"
        }
      ],
      "prettier/prettier": ["error", 
      { 
        "singleQuote": true, 
        "printWidth": 80,
        "tabWidth": 2,
        "semi": false,
        "endOfLine": "auto",
        }
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      // ...angular.configs.templateAccessibility,
      prettier,
    ],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": ["error", 
        { 
          "printWidth": 80,
          "tabWidth": 2,
          "endOfLine": "auto",
          "htmlWhitespaceSensitivity": "ignore",
          "semi": false,
          "parser": "html"
        }
      ],
    },
  }
);
