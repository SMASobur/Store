import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Container, Text } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import BooksTable from "../components/BooksTable";
import BookCreateModal from "../components/modals/BookCreateModal";

import { useAuth } from "../context/AuthContext";

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5001/books");
        setBooks(res.data.data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <Container maxW="container.xl" py={2}>
      {user && (
        <div className="text-right mt-6 px-4">
          <Link to="/my-books" className="inline-block">
            <Button
              colorScheme="blue"
              variant="outline"
              size="md"
              rightIcon={<ArrowForwardIcon />}
              className="hover:shadow-md transition-all duration-200"
            >
              View Your Collection
            </Button>
          </Link>
        </div>
      )}
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
              All books list
            </Text>
          </h1>
          {user && <BookCreateModal />}
        </div>

        {loading ? <Text>Loading...</Text> : <BooksTable books={books} />}
      </div>
    </Container>
  );
};

export default BookPage;
