import React from "react";
import Profile from "../pages/profile/Profile";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import InfluencerManagement from "../pages/users/userList";
import InfluencersDetails from "../pages/users/userDetail";
import Categories from "../pages/categories/Categories";
import GalleryPage from "../pages/gallery/GalleryPage";
import AddProduct from "../pages/products/AddProduct";
import ProductList from "../pages/products/ProductList";
import ProductDetail from "../pages/products/ProductDetail";
import Dashboard from "../pages/analytics/Dashboard";

export const routes = {
  public: [
    // {
    //     path: "/login",
    //     element: React.createElement(Login)
    // },
  ],
  protected: [
    {
      element: React.createElement(ProtectedRoute, {
        children: React.createElement(DashboardLayout),
      }),
      children: [
        {
          path: "/",
          element: React.createElement(Dashboard),
        },
        {
          path: "/analytics",
          element: React.createElement(Dashboard),
        },
        {
          path: "/gallery",
          element: React.createElement(GalleryPage),
        },
        {
          path: "/categories",
          element: React.createElement(Categories),
        },
        {
          path: "/products/add",
          element: React.createElement(AddProduct),
        },
        {
          path: "/products",
          element: React.createElement(ProductList),
        },
        {
          path: "/products/:id",
          element: React.createElement(ProductDetail),
        },
        {
          path: "/users/:id",
          element: React.createElement(InfluencersDetails),
        },
        {
          path: "/users",
          element: React.createElement(InfluencerManagement),
        },
        {
          path: "/profile",
          element: React.createElement(Profile),
        },
      ],
    },
  ],
};
