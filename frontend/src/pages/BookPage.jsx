import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { Button, Container, Text } from "@chakra-ui/react";
import BooksTable from "../components/BooksTable";
import BookCreateModal from "../components/modals/BookCreateModal";

import { useAuth } from "../context/AuthContext";

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const { user } = useAuth();
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
    <Container maxW="container.xl" py={12}>
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
              Book List
            </Text>
          </h1>
          {user && <BookCreateModal />}
        </div>
        <BooksTable books={books} />
      </div>
    </Container>
  );
};

export default BookPage;
