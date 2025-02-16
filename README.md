# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list


npm run build
npx electron-builder


✅ 4. Find the Output
After running electron-builder, you’ll find your executable in the dist/ folder:

Windows: dist/Recordr Setup.exe
macOS: dist/Recordr.dmg
Linux: dist/Recordr.AppImage
✅ 5. (Optional) Build for a Specific Platform
If you want to build only for Windows, macOS, or Linux, use:

npx electron-builder --win   # Windows
npx electron-builder --mac   # macOS
npx electron-builder --linux # Linux

dist/Recordr Setup.exe  # Windows
dist/Recordr.dmg        # macOS
dist/Recordr.AppImage   # Linux