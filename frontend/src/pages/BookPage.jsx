import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Container, Text, Spinner } from "@chakra-ui/react";
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

  console.log("Books being exported:", books);
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
        <div className="flex justify-between px-4 items-center mb-4">
          <Text
            fontSize={"30"}
            fontWeight={"bold"}
            bgColor="orange.400"
            bgClip={"text"}
            textAlign={"left"}
          >
            Book list from All users
          </Text>

          <div className="flex items-center gap-2">
            {user && <BookCreateModal />}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner size="lg" />
          </div>
        ) : (
          <BooksTable books={books} />
        )}
      </div>
    </Container>
  );
};

export default BookPage;
