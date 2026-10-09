export { default, generateStaticParams } from '@/screens/store-slide/page';

// Only the carousel's slides exist; any other number is a 404. Next reads a
// segment config from the route file itself, so it cannot be re-exported.
export const dynamicParams = false;
