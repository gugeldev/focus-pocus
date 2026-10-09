export { default, generateStaticParams } from '@/screens/store-tile/page';

// Only the two tiles exist; any other name is a 404. Next reads a segment
// config from the route file itself, so it cannot be re-exported.
export const dynamicParams = false;
