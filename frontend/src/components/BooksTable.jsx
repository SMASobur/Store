import { useProductStore } from "../store/book";
import { useEffect } from "react";
import BookDetailsModal from ".././components/modals/BookDetailsModal";
import BookEditModal from ".././components/modals/BookEditModal";
import BookDeleteModal from ".././components/modals/BookDeleteModal";
import useIsMobile from "./hooks/useIsMobile";
import { useAuth } from "../context/AuthContext";

const BooksTable = ({ books }) => {
  const { fetchProducts, products } = useProductStore();
  const { user } = useAuth();
  const total = products.reduce(
    (sum, book) => sum + (Number(book.price) || 0),
    0
  );

  const isMobile = useIsMobile(); // < 768px is mobile
  const colSpanValue = isMobile ? 2 : 4;

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  console.log("products", products);

  return (
    <>
      <table className="w-full border-separate border-spacing-2 p-2'">
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
            <th className="border-2 border-slate-400 rounded-md outline outline-offset-1 outline-1">
              Price
            </th>

            <th className="border-2 border-slate-400 rounded-md outline outline-offset-1 outline-1">
              Operations
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((book, index) => (
            <tr key={book._id} product={book}>
              <td className="border border-slate-400  rounded-md text-center">
                {index + 1}
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
              <td className="border border-slate-400 rounded-md text-center">
                {book.price}
              </td>
              <td className="border border-slate-400 rounded-md text-center">
                <div className="flex justify-center gap-x-4">
                  <BookDetailsModal book={book} />
                  {user && (
                    <>
                      <BookEditModal book={book} />
                      <BookDeleteModal book={book} />
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={colSpanValue}></td>
            <td className=" text-center ">
              <p className="text-base font-semibold">
                Total: <span className="font-medium">{total}</span>
              </p>
            </td>
          </tr>
        </tbody>
        <tfoot></tfoot>
      </table>
    </>
  );
};

export default BooksTable;
