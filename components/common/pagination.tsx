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
  onPageChange?: (page: number) => void;
}

export function PaginationComponent({
  currentPage,
  totalPages,
  baseUrl = "?page=",
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
    pages.add(totalPages);

    return Array.from(pages).sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  const handleClick = (page: number, e: React.MouseEvent) => {
    if (onPageChange) {
      e.preventDefault();
      onPageChange(page);
    }
  };

  return (
    <Pagination>
      <PaginationContent className="flex-wrap">
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href={onPageChange ? undefined : `${baseUrl}${currentPage - 1}`}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={
              currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
            }
            onClick={(e) => currentPage > 1 && handleClick(currentPage - 1, e)}
          />
        </PaginationItem>

        {/* Page Numbers with Ellipsis */}
        {visiblePages.map((page, index) => {
          // Add ellipsis if there's a gap between pages
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
                  href={onPageChange ? undefined : `${baseUrl}${page}`}
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
            href={onPageChange ? undefined : `${baseUrl}${currentPage + 1}`}
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
