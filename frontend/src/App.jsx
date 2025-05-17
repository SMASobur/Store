import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import BookPage from "./pages/BookPage";
import StoreCardView from "./pages/StoreCardView";
function App() {
  return (
    <>
      <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.800")}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/books" element={<BookPage />} />
          <Route path="/cards" element={<StoreCardView />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
