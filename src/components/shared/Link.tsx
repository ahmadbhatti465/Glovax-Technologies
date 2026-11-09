import NextLink from "next/link";
import type { ComponentProps } from "react";

/**
 * A Next.js link without automatic prefetching. Prefetching every link in view
 * cost phones more main-thread time than it saved on these lightweight pages.
 */
export default function Link(props: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={false} {...props} />;
}
