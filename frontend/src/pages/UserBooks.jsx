import { useProductStore } from "../store/book";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import BookDetailsModal from "../components/modals/BookDetailsModal";
import BookEditModal from "../components/modals/BookEditModal";
import BookDeleteModal from "../components/modals/BookDeleteModal";
import BookCreateModal from "../components/modals/BookCreateModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Text } from "@chakra-ui/react";

const UserBooks = () => {
  const { fetchProducts, products } = useProductStore();
  const { user } = useAuth();

  const userBooks = products.filter((book) => book.createdBy?.id === user?._id);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Your Book List", 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 28);

    const tableColumn = ["No.", "Title", "Author", "Year", "Price"];
    const tableRows = userBooks.map((book, index) => [
      index + 1,
      book.title,
      book.author,
      book.publishYear,
      book.price,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
    });

    doc.save("user_books.pdf");
  };

  return (
    <div className="p-4">
      <div className="p-2">
        <div className="flex justify-between px-4 items-center">
          <h1 className="text-3xl my-82 p-2">
            {" "}
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
          {user && <BookCreateModal />}
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">
          Your Created Books ({userBooks.length})
        </h2>
      </div>

      {userBooks.length === 0 ? (
        <p className="text-center text-gray-500">No books created yet. </p>
      ) : (
        <>
          <table className="w-full border-separate border-spacing-2 p-2">
            <thead>
              <tr>
                <th className="border-2 border-slate-400 rounded-md">No.</th>
                <th className="border-2 border-slate-400 rounded-md">Title</th>
                <th className="border-2 border-slate-400 rounded-md max-md:hidden ">
                  Author
                </th>
                <th className="border-2 border-slate-400 rounded-md max-md:hidden ">
                  Publish year
                </th>
                <th className="border-2 border-slate-400 rounded-md max-md:hidden ">
                  Price
                </th>
                <th className="border-2 border-slate-400 rounded-md">
                  Actions
                </th>
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
                  <td className="border border-slate-400 rounded-md text-center max-md:hidden">
                    {book.author}
                  </td>
                  <td className="border border-slate-400 rounded-md text-center max-md:hidden">
                    {book.publishYear}
                  </td>
                  <td className="border border-slate-400 rounded-md text-center max-md:hidden">
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
          </table>

          <div className="text-right mt-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={generatePDF}
            >
              Download PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserBooks;
