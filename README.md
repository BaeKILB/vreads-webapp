# Notice

This project uses "yarn berry" and "firebase"

If you want run this app, follow the steps :

0. This app uses .env file
   .env value list : <br/>
   VITE_APP_API_KEY= <br/>
   VITE_APP_AUTH_DOMAIN= <br/>
   VITE_APP_PROJECT_ID= <br/>
   VITE_APP_STORAGE_BUCKET= <br/>
   VITE_APP_MESSAGIN_ID= <br/>
   VITE_APP_APP_ID= <br/>

1. Open up terminal <br/>

2. Run this phrase: <br/>
   yarn install <br/>
   yarn run dev <br/>

3. And when setting up firebase hosting, you must set it with the corresponding phrase.<br/>
   yarn dlx firebase-tools login<br/>
   yarn dlx firebase-tools init<br/>

4. For easy build + firebase hosting, we created an execution statement called "yarn deploy".<br/>
   Enter yarn deploy into the terminal to complete the build and firebase hosting.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
