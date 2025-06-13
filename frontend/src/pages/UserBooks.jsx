import { useProductStore } from "../store/book";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BookDetailsModal from "../components/modals/BookDetailsModal";
import BookEditModal from "../components/modals/BookEditModal";
import BookDeleteModal from "../components/modals/BookDeleteModal";
import BookCreateModal from "../components/modals/BookCreateModal";
import { Button, Text } from "@chakra-ui/react";
import { generateBooksPDF } from "../utils/pdfGenerator";

const UserBooks = () => {
  const { fetchProducts, products } = useProductStore();
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(10);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const userBooks = products.filter((book) => book.createdBy?.id === user?._id);
  const totalPrice = userBooks.reduce(
    (sum, book) => sum + parseFloat(book.price || 0),
    0
  );

  const totalPages = Math.ceil(userBooks.length / booksPerPage);
  const paginatedBooks = userBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2">
      <div className="p-2">
        <div className="flex justify-between px-4 items-center mb-4">
          <Text
            fontSize="30"
            fontWeight="bold"
            bgColor="orange.400"
            bgClip="text"
          >
            {user.name}'s {userBooks.length <= 1 ? "Book" : "Books"} List
          </Text>
          {user && <BookCreateModal />}
        </div>

        {userBooks.length > 0 ? (
          <>
            <div className="flex justify-center md:justify-end mb-4">
              <Button
                onClick={() => generateBooksPDF(user.name, userBooks)}
                colorScheme="orange"
                variant="outline"
                isDisabled={userBooks.length === 0}
              >
                Export to PDF
              </Button>
            </div>
            <div className="flex justify-end mb-4 px-4">
              <label className="mr-2 font-medium">Books per page:</label>
              <select
                value={booksPerPage}
                onChange={(e) => {
                  setBooksPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="appearance-none border border-gray-300 rounded px-2 py-1
                         "
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-2 p-2">
                <thead>
                  <tr>
                    <th className="border-2 border-slate-400 rounded-md">
                      No.
                    </th>
                    <th className="border-2 border-slate-400 rounded-md">
                      Title
                    </th>
                    <th className="border-2 border-slate-400 rounded-md max-md:hidden">
                      Author
                    </th>
                    <th className="border-2 border-slate-400 rounded-md max-md:hidden">
                      Publish Year
                    </th>
                    <th className="border-2 border-slate-400 rounded-md max-md:hidden">
                      Price
                    </th>
                    <th className="border-2 border-slate-400 rounded-md">
                      Operations
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBooks.map((book, index) => (
                    <tr key={book._id}>
                      <td className="border border-slate-400 text-center">
                        {(currentPage - 1) * booksPerPage + index + 1}
                      </td>
                      <td className="border border-slate-400 text-center">
                        {book.title}
                      </td>
                      <td className="border border-slate-400 text-center max-md:hidden">
                        {book.author}
                      </td>
                      <td className="border border-slate-400 text-center max-md:hidden">
                        {book.publishYear}
                      </td>
                      <td className="border border-slate-400 text-center max-md:hidden">
                        {book.price}
                      </td>
                      <td className="border border-slate-400 text-center">
                        <div className="flex justify-center gap-x-2">
                          <BookDetailsModal book={book} />
                          {["admin", "user"].includes(user?.role) && (
                            <>
                              <BookEditModal book={book} />
                              <BookDeleteModal book={book} />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-row md:hidden">
                    <td colSpan={6} className="text-left font-bold pt-4">
                      Total: ৳ {totalPrice.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="hidden md:table-row">
                    <td
                      colSpan={4}
                      className="text-right font-bold border-none"
                    >
                      Total
                    </td>
                    <td
                      className="text-center font-bold border-none"
                      colSpan={1}
                    >
                      ৳ {totalPrice.toFixed(2)}
                    </td>
                    <td className="border-none"></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Pagination Buttons */}
            <div className="flex justify-center gap-2 mt-6">
              {totalPages > 3 && (
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                >
                  ⏮
                </button>
              )}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                ⏪︎
              </button>
              <span className="font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                ⏩︎
              </button>
              {totalPages > 3 && (
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                >
                  ⏭
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-4">
            No books created yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserBooks;
