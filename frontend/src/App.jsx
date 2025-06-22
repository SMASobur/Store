import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import BookPage from "./pages/BookPage";
import StoreCardView from "./pages/StoreCardView";
import AboutPage from "./pages/AboutPage";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import UserBooks from "./pages/UserBooks";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import NotesPage from "./pages/NotesPage";
import SchoolPage from "./pages/SchoolPage";
import DonorPage from "./pages/DonorPage";
import ExpensePage from "./pages/ExpensePage";

function App() {
  return (
    <>
      <Box minH="100vh" bg={useColorModeValue("gray.200", "gray.500")}>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/books" element={<BookPage />} />
          <Route path="/cards" element={<StoreCardView />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/user-books/:userId" element={<UserBooks />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/school" element={<SchoolPage />} />
          <Route path="/donors/:id" element={<DonorPage />} />
          <Route path="/categories/:id" element={<ExpensePage />} />

          {/* Private Routes */}
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-books"
            element={
              <PrivateRoute>
                <UserBooks />
              </PrivateRoute>
            }
          />
        </Routes>
      </Box>
      <Footer />
    </>
  );
}

export default App;
