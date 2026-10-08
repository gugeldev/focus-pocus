// postcss-loader passes webpack's mode, so `build:*` gets minified CSS and
// `dev:*` stays readable.
export default ({ mode }) => ({
  plugins: {
    '@tailwindcss/postcss': { optimize: mode === 'production' },
  },
});
