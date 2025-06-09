import { useProductStore } from "../store/book";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import BookDetailsModal from "../components/modals/BookDetailsModal";
import BookEditModal from "../components/modals/BookEditModal";
import BookDeleteModal from "../components/modals/BookDeleteModal";
import BookCreateModal from "../components/modals/BookCreateModal";
import { Button, Text } from "@chakra-ui/react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(`${user.name}'s Books List (${userBooks.length})`, 14, 15);

    const tableData = userBooks.map((book, index) => [
      index + 1,
      book.title,
      book.author,
      book.publishYear,
      book.price,
    ]);

    // Add total row
    tableData.push([
      {
        content: "Total",
        colSpan: 4,
        styles: { halign: "right", fontStyle: "bold" },
      },
      { content: totalPrice.toFixed(2), styles: { fontStyle: "bold" } },
    ]);

    autoTable(doc, {
      head: [["No.", "Title", "Author", "Publish Year", "Price"]],
      body: tableData,
      startY: 25,
      styles: {
        cellPadding: 2,
        fontSize: 10,
        valign: "middle",
        halign: "center",
      },
      headStyles: {
        fillColor: [255, 165, 0],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save(`${user.name}_books_list.pdf`);
  };

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
            <tr className="hidden md:table-row">
              <td colSpan={4} className="text-right font-bold border-none">
                Total
              </td>
              <td className="text-center font-bold border-none" colSpan={1}>
                {totalPrice.toFixed(2)}
              </td>
              <td className="border-none"></td>
            </tr>
          </tfoot>
        </table>
      )}

      <div className="flex justify-center md:justify-end mt-4">
        <Button
          onClick={exportToPDF}
          colorScheme="orange"
          variant="outline"
          isDisabled={userBooks.length === 0}
        >
          Export to PDF
        </Button>
      </div>
    </div>
  );
};

export default UserBooks;
