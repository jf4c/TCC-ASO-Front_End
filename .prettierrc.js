module.exports = {
  // Configuração específica para CSS/SCSS
  overrides: [
    {
      files: "*.{css,scss,sass}",
      options: {
        singleQuote: false,
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        trailingComma: "none"
      }
    }
  ]
};