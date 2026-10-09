// `import css from './x.css?raw'` is the file as a plain string (webpack
// asset/source), so a script can put it in a shadow root.
declare module '*.css?raw' {
  const css: string;
  export default css;
}

// A plain `import './x.css'` goes through Tailwind into the page's stylesheet.
declare module '*.css';
