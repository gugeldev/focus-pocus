// CSS files imported from src/ are bundled as plain strings (webpack
// asset/source), so a script can put them in a shadow root.
declare module '*.css' {
  const css: string;
  export default css;
}
