const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');

// Function to escape special characters
const escapeHtml = (str) => {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
};

// Function to process the JSX code
function processJSX(jsxCode) {
  // Parse the JSX code into an AST
  const ast = parser.parse(jsxCode, {
    sourceType: 'module',
    plugins: ['jsx']
  });

  // Traverse the AST to find and modify text content and attributes
  traverse(ast, {
    JSXText(path) {
      path.node.value = escapeHtml(path.node.value);
    },
    JSXAttribute(path) {
      if (t.isStringLiteral(path.node.value)) {
        path.node.value.value = escapeHtml(path.node.value.value);
      }
    },
    JSXExpressionContainer(path) {
      if (t.isTemplateLiteral(path.node.expression)) {
        path.node.expression.quasis.forEach(quasi => {
          quasi.value.raw = escapeHtml(quasi.value.raw);
          quasi.value.cooked = escapeHtml(quasi.value.cooked);
        });
      } else if (t.isStringLiteral(path.node.expression)) {
        path.node.expression.value = escapeHtml(path.node.expression.value);
      }
    }
  });

  // Generate the modified JSX code from the AST without semicolons
  const { code } = generator(ast, {
    retainLines: true,
    concise: true,
    quotes: 'double',
    jsescOption: {
      minimal: true,
    }
  });

  return code.replace(/;$/, '');  // Remove trailing semicolon if present
}

// Export the function for use
module.exports = processJSX;
