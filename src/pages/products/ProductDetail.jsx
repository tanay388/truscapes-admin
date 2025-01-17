import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { apiService } from "../../api/apiwrapper";
import ProductImages from "./components/ProductImages";
import ProductInfo from "./components/ProductInfo";
import CategoryDetails from "./components/CategoryInfo";
import VariantManagement from "./components/VariantManagement";
import AddProduct from "./AddProduct"; // Import AddProduct Component

export const ProductStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  DRAFT: "DRAFT",
};

const ProductDetail = () => {
  const { id } = useParams(); // Get product ID from the URL
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiService.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = async (updatedProduct) => {
    try {
      await apiService.patch(`/products/${id}`, updatedProduct);
      setProduct(updatedProduct);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setUpdatingStatus(true);
    try {
      const newprod = product;
      newprod.state = newStatus;
      await apiService.patch(`/products/${id}`, newprod);
      setProduct((prevProduct) => ({ ...prevProduct, state: newStatus }));
    } catch (error) {
      console.error("Failed to update product status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Skeleton variant="text" height={50} width="30%" />
        <Skeleton variant="rectangular" height={200} sx={{ my: 2 }} />
        <Skeleton variant="text" height={30} width="80%" />
        <Skeleton variant="rectangular" height={150} />
      </Box>
    );
  }

  if (!product) {
    return <Typography variant="h6">Product not found</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">{product.name}</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Status Dropdown */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={product.state || ""}
              onChange={handleStatusChange}
              disabled={updatingStatus}
            >
              {Object.values(ProductStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Edit Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditToggle}
          >
            Edit
          </Button>
        </Box>
      </Box>

      {/* Product Images */}
      <ProductImages images={product.images} />

      {/* Product Info */}
      <ProductInfo product={product} />

      {/* Category Details */}
      <CategoryDetails category={product.category} />

      {/* Variant Management */}
      <VariantManagement product={product} />

      {/* Edit Product Dialog */}
      <Dialog
        open={isEditing}
        onClose={handleEditToggle}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <AddProduct product={product} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditToggle} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductDetail;
