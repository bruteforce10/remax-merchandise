"use client";

import Image from "next/image";
import * as React from "react";

import { CategoryIcon } from "@/components/ui/Icon";
import { categoryImageSrc } from "@/lib/categoryImages";
import { cn } from "@/lib/utils";

interface CategoryVisualProps {
  slug: string;
  name: string;
  icon: string;
  imageClassName?: string;
  iconClassName?: string;
  sizes?: string;
  /**
   * Optional adaptive container. When any wrap class is provided, CategoryVisual
   * renders its own <span> and swaps imageWrapClassName / iconWrapClassName
   * depending on whether the product image actually loaded — so callers get
   * image-vs-icon styling (size, background) without needing to know ahead of
   * time whether the file exists. When omitted, only the inner image/icon is
   * rendered and the caller supplies the container (legacy behavior).
   */
  wrapClassName?: string;
  imageWrapClassName?: string;
  iconWrapClassName?: string;
}

export function CategoryVisual({
  slug,
  name,
  icon,
  imageClassName,
  iconClassName,
  sizes = "52px",
  wrapClassName,
  imageWrapClassName,
  iconWrapClassName,
}: CategoryVisualProps): React.JSX.Element {
  const [failed, setFailed] = React.useState(false);
  const showImage = !failed;

  const content = showImage ? (
    <Image
      src={categoryImageSrc(slug)}
      alt=""
      fill
      sizes={sizes}
      className={cn("object-contain", imageClassName)}
      onError={() => setFailed(true)}
      aria-label={name}
    />
  ) : (
    <CategoryIcon name={icon} className={iconClassName} />
  );

  if (!wrapClassName && !imageWrapClassName && !iconWrapClassName) {
    return content;
  }

  return (
    <span
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        wrapClassName,
        showImage ? imageWrapClassName : iconWrapClassName,
      )}
    >
      {content}
    </span>
  );
}
