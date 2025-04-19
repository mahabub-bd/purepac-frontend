"use client";

import type React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useMemo } from "react";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  paginationUrls?: Record<number, string>;
  onPageChange?: (page: number) => void;
}

export function PaginationComponent({
  currentPage,
  totalPages,
  baseUrl = "?page=",
  paginationUrls,
  onPageChange,
}: PaginationComponentProps) {
  const visiblePages = useMemo(() => {
    const siblingsCount = 1;

    const pages = new Set<number>();

    for (
      let i = Math.max(1, currentPage - siblingsCount);
      i <= Math.min(totalPages, currentPage + siblingsCount);
      i++
    ) {
      pages.add(i);
    }

    pages.add(1);
    if (totalPages > 0) {
      pages.add(totalPages);
    }

    return Array.from(pages).sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  const getPageUrl = (page: number): string => {
    if (paginationUrls && paginationUrls[page]) {
      return paginationUrls[page];
    }
    return `${baseUrl}${page}`;
  };

  const handleClick = (page: number, e: React.MouseEvent) => {
    if (onPageChange) {
      e.preventDefault();
      onPageChange(page);
    }
  };

  return (
    <Pagination className="justify-center md:justify-end">
      <PaginationContent className="flex-wrap">
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href={currentPage <= 1 ? undefined : getPageUrl(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={
              currentPage <= 1
                ? "pointer-events-none opacity-50 cursor-pointer"
                : undefined
            }
            onClick={(e) => currentPage > 1 && handleClick(currentPage - 1, e)}
          />
        </PaginationItem>

        {visiblePages.map((page, index) => {
          const previousPage = visiblePages[index - 1];
          const needsEllipsisBefore = previousPage && page - previousPage > 1;

          return (
            <div key={page} className="flex items-center cursor-pointer">
              {needsEllipsisBefore && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href={getPageUrl(page)}
                  isActive={page === currentPage}
                  onClick={(e) => handleClick(page, e)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            </div>
          );
        })}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href={
              currentPage >= totalPages
                ? undefined
                : getPageUrl(currentPage + 1)
            }
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
            className={
              currentPage >= totalPages
                ? "pointer-events-none opacity-50 cursor-pointer"
                : undefined
            }
            onClick={(e) =>
              currentPage < totalPages && handleClick(currentPage + 1, e)
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
