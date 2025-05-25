import React, { Component } from 'react';

class Pagination extends Component {
  render() {
    const { totalItems, itemsPerPage, currentPage, onPageChange } = this.props;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    // 只顯示 1～5 頁，若總頁數超過 5，就在後面加一個 'ellipsis'
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    const pagesToShow =
      totalPages > 5
        ? [...pageNumbers.slice(0, 5), 'ellipsis']
        : pageNumbers;

    return (
      <div className="flex gap-2 justify-center mt-4">
        <button
          className="px-3 py-1 rounded border"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          上一頁
        </button>

        {pagesToShow.map((page, idx) =>
          page === 'ellipsis' ? (
            <span key={`ell-${idx}`} className="px-3 py-1">
              …
            </span>
          ) : (
            <button
              key={page}
              className={`px-3 py-1 rounded border ${
                page === currentPage ? 'bg-gray-300' : ''
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}

        <button
          className="px-3 py-1 rounded border"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          下一頁
        </button>
      </div>
    );
  }
}

export default Pagination;
