import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default tseslint.config({
  settings: { react: { version: '18.3' } },
  plugins: {
    react,
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    ...pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginReact.configs.flat.recommended,
  },
});
