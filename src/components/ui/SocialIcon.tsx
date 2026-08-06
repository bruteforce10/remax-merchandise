import type { LucideProps } from "lucide-react";
import type { ReactElement } from "react";

/**
 * Social brand icons in Lucide's stroke-outline style.
 *
 * Lucide v1 removed every brand icon over trademark concerns, so these can no
 * longer be imported from `lucide-react`. The paths below are the original
 * Lucide glyphs (v0.544.0, ISC licensed) inlined so the footer keeps matching
 * the non-brand Lucide icons it sits next to — no extra dependency, and no
 * solid-fill logo set that would clash with the outline style used site-wide.
 */

const BASE = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function InstagramIcon(props: LucideProps): ReactElement {
  return (
    <svg {...BASE} {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function FacebookIcon(props: LucideProps): ReactElement {
  return (
    <svg {...BASE} {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function YoutubeIcon(props: LucideProps): ReactElement {
  return (
    <svg {...BASE} {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

/** Maps `SocialLink.icon` keys to components, mirroring {@link CategoryIcon}. */
const REGISTRY: Record<string, (props: LucideProps) => ReactElement> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
};

export interface SocialIconProps extends LucideProps {
  name: string;
}

export function SocialIcon({
  name,
  ...props
}: SocialIconProps): ReactElement | null {
  const Component = REGISTRY[name];
  return Component ? <Component {...props} /> : null;
}
