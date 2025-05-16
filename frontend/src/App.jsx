import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import BookPage from "./pages/BookPage";
import CardView from "./pages/CardView";
function App() {
  return (
    <>
      <Box minH={"100vh"} bg={useColorModeValue("gray.200", "gray.900")}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/books" element={<BookPage />} />
          <Route path="/cards" element={<CardView />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
