import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  imgUrl?: string | null;
  alt: string;
  value: React.ReactNode | string | number;
  title: string;
  href?: string;
  textStyles: string;
  imgStyles?: string;
  isAuthor?: boolean;
  titleStyles?: string;
}

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  imgStyles,
  isAuthor,
  titleStyles,
}: Props) => {
  // Default placeholder image for authors without image
  const defaultAuthorImage = "/images/default-logo.svg";
  
  // Only render Image if we have a valid src
  const hasValidImage = imgUrl && imgUrl.trim() !== "";
  const imageSrc = hasValidImage 
    ? imgUrl 
    : (isAuthor ? defaultAuthorImage : null);

  const metricContent = (
    <>
      {imageSrc && imageSrc.trim() !== "" && (
        <Image
          src={imageSrc}
          width={16}
          height={16}
          alt={alt}
          className={`rounded-full object-contain ${imgStyles || ""}`}
        />
      )}

      <p className={`${textStyles} flex items-center gap-1`}>
        {value}

        {title ? (
          <span className={cn(`small-regular line-clamp-1`, titleStyles)}>
            {title}
          </span>
        ) : null}
      </p>
    </>
  );

  return href ? (
    <Link href={href} className="flex-center gap-1">
      {metricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};

export default Metric;
