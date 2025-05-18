import { Box, Divider, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import BookPage from "./pages/BookPage";
import StoreCardView from "./pages/StoreCardView";
import AboutPage from "./pages/AboutPage";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Box minH={"100vh"} bg={useColorModeValue("gray.200", "gray.500")}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/books" element={<BookPage />} />
          <Route path="/cards" element={<StoreCardView />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Box>
      <Footer />
    </>
  );
}

export default App;
