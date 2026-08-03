"use client";

import Image from "next/image";
import * as React from "react";

import { CategoryIcon } from "@/components/ui/Icon";
import { CATEGORY_IMAGE_PATHS } from "@/lib/categoryImages";
import { cn } from "@/lib/utils";

interface CategoryVisualProps {
  slug: string;
  name: string;
  icon: string;
  imageClassName?: string;
  iconClassName?: string;
  sizes?: string;
}

export function CategoryVisual({
  slug,
  name,
  icon,
  imageClassName,
  iconClassName,
  sizes = "52px",
}: CategoryVisualProps): React.JSX.Element {
  const [failed, setFailed] = React.useState(false);
  const src = CATEGORY_IMAGE_PATHS[slug];

  if (!src || failed) {
    return <CategoryIcon name={icon} className={iconClassName} />;
  }

  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      className={cn("object-contain", imageClassName)}
      onError={() => setFailed(true)}
      aria-label={name}
    />
  );
}
