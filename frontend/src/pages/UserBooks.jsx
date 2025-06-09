import { useProductStore } from "../store/book";
import { useEffect } from "react";
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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const userBooks = products.filter((book) => book.createdBy?.id === user?._id);
  const totalPrice = userBooks.reduce(
    (sum, book) => sum + parseFloat(book.price || 0),
    0
  );

  return (
    <div className="p-2">
      <div className="p-2">
        <div className="flex justify-between px-4 items-center">
          <h1 className="text-3xl my-82 p-2">
            <Text
              fontSize={"30"}
              fontWeight={"bold"}
              bgColor="orange.400"
              bgClip={"text"}
              textAlign={"left"}
            >
              {user.name}'s {userBooks.length <= 1 ? "book" : "books"} List
            </Text>
          </h1>
          <div className="flex gap-2">{user && <BookCreateModal />}</div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">
          You created this book list ({userBooks.length})
        </h2>
        <div className="flex justify-center md:justify-end mt-4">
          <Button
            onClick={() => generateBooksPDF(user.name, userBooks)}
            colorScheme="orange"
            variant="outline"
            isDisabled={userBooks.length === 0}
          >
            Export to PDF
          </Button>
        </div>
      </div>

      {userBooks.length === 0 ? (
        <p className="text-center text-gray-500">No books created yet.</p>
      ) : (
        <table className="w-full border-separate border-spacing-2 p-2">
          <thead>
            <tr>
              <th className="border-2 border-slate-400 rounded-md">No.</th>
              <th className="border-2 border-slate-400 rounded-md">Title</th>
              <th className="border-2 border-slate-400 rounded-md max-md:hidden">
                Author
              </th>
              <th className="border-2 border-slate-400 rounded-md max-md:hidden">
                Publish Year
              </th>
              <th className="border-2 border-slate-400 rounded-md max-md:hidden">
                Price
              </th>
              <th className="border-2 border-slate-400 rounded-md">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userBooks.map((book, index) => (
              <tr key={book._id}>
                <td className="border border-slate-400 text-center">
                  {index + 1}
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
                    <BookEditModal book={book} />
                    <BookDeleteModal book={book} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            {/* Mobile view: show total row */}
            <tr className="table-row md:hidden">
              <td colSpan={6} className="text-left font-bold pt-4">
                Total: ৳ {totalPrice.toFixed(2)}
              </td>
            </tr>

            {/* Desktop view: formatted total row in table layout */}
            <tr className="hidden md:table-row">
              <td colSpan={4} className="text-right font-bold border-none">
                Total
              </td>
              <td className="text-center font-bold border-none" colSpan={1}>
                ৳ {totalPrice.toFixed(2)}
              </td>
              <td className="border-none"></td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

export default UserBooks;
