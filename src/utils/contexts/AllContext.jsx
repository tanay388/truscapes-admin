import React from "react";
import { AuthProvider } from "./AuthContext";
import { CategoryProvider } from "./CategoryContext";

export const AllProviders = ({ children }) => {
  return (
    <AuthProvider>
      {/* <ShopProvider> */}
      <CategoryProvider>
        {/* <CouponProvider> */}
        {/* <SubscriptionProvider> */}
        {children}
        {/* </SubscriptionProvider> */}
        {/* </CouponProvider> */}
      </CategoryProvider>
      {/* </ShopProvider> */}
    </AuthProvider>
  );
};

export default AllProviders;
