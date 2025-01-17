import React from "react";
import Login from "../pages/auth/Login";
import Analytics from "../pages/analytics/Analytics";
import Profile from "../pages/profile/Profile";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import InfluencerManagement from "../pages/users/userList";
import VendorManagement from "../pages/vendors/VendorManagement";
import CouponManagement from "../pages/coupon/CouponManagement";
import CouponDetails from "../pages/coupon/CouponDetails";
import Settings from "../pages/settings/Settings";
import VendorDetails from "../pages/vendors/VendorDetails";
import InfluencersDetails from "../pages/users/userDetail";
import Categories from "../pages/categories/Categories";
import Subscriptions from "../pages/subscriptions/Subscriptions";
import GalleryPage from "../pages/gallery/GalleryPage";
import AddProduct from "../pages/products/AddProduct";
import ProductList from "../pages/products/ProductList";
import ProductDetail from "../pages/products/ProductDetail";

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
          element: React.createElement(VendorManagement),
        },
        {
          path: "/analytics",
          element: React.createElement(Analytics),
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
          path: "/vendors",
          element: React.createElement(VendorManagement),
        },
        {
          path: "/vendors/:id",
          element: React.createElement(VendorDetails),
        },
        {
          path: "/profile",
          element: React.createElement(Profile),
        },
        {
          path: "/settings",
          element: React.createElement(Settings),
        },
      ],
    },
  ],
};
