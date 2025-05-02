import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./routes/RootLayout";
import LoginPage from "./pages/LoginPage";
import HeroPage from "./pages/HeroPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./routes/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import RegisterPage from "./pages/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HeroPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <DashboardPage /> }],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
