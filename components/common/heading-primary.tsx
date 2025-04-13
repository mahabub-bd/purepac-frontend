import { ReactNode } from "react";

type HeadingProps = {
  title: string;
  subtitle?: string | ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function HeadingPrimary({
  title,
  subtitle,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
}: HeadingProps) {
  return (
    <div className={`text-center py-4 ${className}`}>
      <h2
        className={`font-SFProDisplaySemibold capitalize text-lg md:text-2xl ${titleClassName}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-sm md:text-base mt-2 ${subtitleClassName}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
