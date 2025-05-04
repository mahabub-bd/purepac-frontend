// image-container.tsx
"use client"; // Add this directive at the top

import { getBlurData } from "@/utils/blur-generator";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageContainerProps {
  src: string;
  name: string;
}

export default function ImageContainer({ src, name }: ImageContainerProps) {
  const [blurData, setBlurData] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlurData = async () => {
      if (src) {
        try {
          const { base64 } = await getBlurData(src);
          setBlurData(base64);
        } catch (error) {
          console.error("Error generating blur data:", error);
        }
      }
    };

    fetchBlurData();
  }, [src]);

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={name}
      width={64}
      height={64}
      blurDataURL={blurData || undefined}
      placeholder={blurData ? "blur" : "empty"}
      className="object-contain"
    />
  );
}
