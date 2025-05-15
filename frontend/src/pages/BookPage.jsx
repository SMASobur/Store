import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import BooksTable from "../components/BooksTable";

const BookPage = () => {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5001/books")
      .then((res) => {
        setBooks(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl my-8"> Book List</h1>
        <Link to={"/create"}>
          <Button>
            <PlusSquareIcon fontSize={20} />
          </Button>
        </Link>
      </div>
      <BooksTable books={books} />
    </div>
  );
};

export default BookPage;
