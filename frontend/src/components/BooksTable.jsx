import { useProductStore } from "../store/book";
import { useEffect, useState } from "react";
import BookDetailsModal from ".././components/modals/BookDetailsModal";
import BookEditModal from ".././components/modals/BookEditModal";
import BookDeleteModal from ".././components/modals/BookDeleteModal";
import useIsMobile from "./hooks/useIsMobile";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const BooksTable = ({ books }) => {
  const { fetchProducts, products } = useProductStore();
  const { user } = useAuth();
  const isMobile = useIsMobile(); // < 768px is mobile
  const colSpanValue = isMobile ? 1 : 4;

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(25);

  //const userBooks = products.filter((book) => book.createdBy?.id === user?._id);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  //console.log("products", products);
  const total = products.reduce(
    (sum, book) => sum + (Number(book.price) || 0),
    0
  );

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = products.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(products.length / booksPerPage);

  return (
    <>
      <div className="flex justify-end mb-4 px-4">
        <label className="mr-2 font-medium">Books per page:</label>
        <select
          value={booksPerPage}
          onChange={(e) => {
            setBooksPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="appearance-none border border-gray-300 rounded px-2 py-1"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
      <table className="w-full border-separate border-spacing-2 p-2 table-auto">
        <thead>
          <tr>
            <th className="border-2  border-slate-400 rounded-md outline outline-offset-1 outline-1">
              No.
            </th>
            <th className="border-2 border-slate-400 rounded-md outline outline-offset-1 outline-1">
              Title
            </th>

            <th className="border-2 border-slate-400 rounded-md max-md:hidden outline outline-offset-1 outline-1">
              Author
            </th>
            <th className="border-2 border-slate-400 rounded-md max-md:hidden outline outline-offset-1 outline-1">
              Publish year
            </th>
            <th className="border-2 border-slate-400 rounded-md max-md:hidden outline outline-offset-1 outline-1">
              Price
            </th>

            <th className="border-2 border-slate-400 rounded-md outline outline-offset-1 outline-1">
              Operations
            </th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map((book, index) => (
            <tr key={book._id} product={book}>
              <td className="border border-slate-400  rounded-md text-center">
                {(currentPage - 1) * booksPerPage + index + 1}
              </td>
              <td className="border border-slate-400 rounded-md text-center">
                {book.title}
              </td>

              <td className="border border-slate-400 rounded-md text-center max-md:hidden">
                {book.author}
              </td>
              <td className="border border-slate-400 rounded-md text-center max-md:hidden">
                {book.publishYear}
              </td>
              <td className="border border-slate-400 rounded-md text-center max-md:hidden">
                {book.price}
              </td>
              <td className="border border-slate-400 rounded-md text-center">
                <div className="flex justify-start gap-x-4 pl-2">
                  <BookDetailsModal book={book} />
                  {user &&
                    (user.role === "admin" ||
                      book.createdBy?.id === user._id) && (
                      <>
                        <BookEditModal book={book} />
                        <BookDeleteModal book={book} />
                      </>
                    )}

                  {/* {user?.role === "admin" && (
                    <span className="text-xs text-green-600 ml-1">(Admin)</span>
                  )} */}
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={colSpanValue}></td>
            <td className=" text-center ">
              <p className="text-base font-semibold">
                Total value: <span className="font-medium">{total}/=</span>
              </p>
            </td>
          </tr>
        </tbody>
        <tfoot></tfoot>
      </table>
      {(totalPages > 1 || products.length > 0) && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2">
            {totalPages > 3 && (
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                ⏮
              </button>
            )}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              ⏪︎
            </button>
            <span className="font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              ⏩︎
            </button>
            {totalPages > 3 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                ⏭
              </button>
            )}
          </div>
        </div>
      )}

      {user && (
        <div className="text-left mt-4 px-4">
          <Link
            to="/my-books"
            className="text-blue-600 underline hover:text-blue-800"
          >
            View your created books
          </Link>
        </div>
      )}
    </>
  );
};

export default BooksTable;
