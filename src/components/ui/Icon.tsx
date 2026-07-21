import {
  Backpack,
  Coffee,
  CupSoda,
  IdCard,
  KeyRound,
  NotebookPen,
  Package,
  PenLine,
  Shirt,
  ShoppingBag,
  Tag,
  Umbrella,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { ReactElement } from "react";

/**
 * Maps CMS-stored icon names (kebab-case, like `data-lucide`) to Lucide
 * components, so category icons can be driven by content data.
 */
const REGISTRY: Record<string, LucideIcon> = {
  shirt: Shirt,
  umbrella: Umbrella,
  coffee: Coffee,
  "cup-soda": CupSoda,
  "pen-line": PenLine,
  "notebook-pen": NotebookPen,
  tag: Tag,
  "shopping-bag": ShoppingBag,
  backpack: Backpack,
  "id-card": IdCard,
  "key-round": KeyRound,
  package: Package,
};

export interface CategoryIconProps extends LucideProps {
  name: string;
}

export function CategoryIcon({
  name,
  ...props
}: CategoryIconProps): ReactElement {
  const Component = REGISTRY[name] ?? Package;
  return <Component {...props} />;
}
