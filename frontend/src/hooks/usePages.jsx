import { useState } from "react";

export const usePages = (pages) => {
  const [currentPage, setCurrentPage] = useState(0);

    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

  const [statePages, setPages] = useState(pages(prevPage, nextPage));

  return {
    currentPage: statePages[currentPage],
    prevPage,
    nextPage,
  };
};
