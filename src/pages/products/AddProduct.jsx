import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  CircularProgress,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import GalleryPage from "../gallery/GalleryPage";
import { useCategory } from "../../utils/contexts/CategoryContext";
import { apiService } from "../../api/apiwrapper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddProduct = ({ product }) => {
  const { categories } = useCategory();
  const [loading, setLoading] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const nav = useNavigate();

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      stockAvailable: true,
      categoryIndex: 0,
      index: 0,
      shippingCost: 0,
      basePrice: 0,
      images: [],
    },
  });

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("description", product.description);
      setValue("categoryId", product.categoryId);
      setValue("stockAvailable", product.stockAvailable);
      setValue("categoryIndex", product.categoryIndex);
      setValue("index", product.index);
      setValue("shippingCost", product.shippingCost);
      setValue("basePrice", product.basePrice);
      setSelectedImages(product.images || []);
    }
  }, [product, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      data.images = selectedImages;

      if (product) {
        // Update product
        const res = await apiService.patch(`/products/${product.id}`, data);
        toast.success("Product updated successfully!");
        nav(`/products/${product.id}`);
      } else {
        // Create new product
        const res = await apiService.post("/products", data);
        toast.success("Product added successfully!");
        nav(`/products/${res.data.id}`);
      }

      reset();
      setSelectedImages([]);
      // nav("/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(
        `Failed to ${product ? "update" : "add"} product. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImages = (images) => {
    setSelectedImages(images);
    setGalleryOpen(false);
  };

  return (
    <Box
      p={3}
      maxWidth="600px"
      mx="auto"
      bgcolor="#f9f9f9"
      borderRadius="8px"
      boxShadow={2}
    >
      <Typography variant="h5" gutterBottom align="center">
        {product ? "Edit Product" : "Add Product"}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Product Name */}
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Product name is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Product Name"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>

          {/* Category Selector */}
          <Grid item xs={12}>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: "Please select a category" }}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    {...field}
                    error={!!fieldState.error}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <Typography variant="caption" color="error">
                      {fieldState.error.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Stock Available */}
          <Grid item xs={6}>
            <Controller
              name="stockAvailable"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Stock Available"
                />
              )}
            />
          </Grid>

          {/* Other Numeric Fields */}
          <Grid item xs={6}>
            <Controller
              name="categoryIndex"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Position Of Product"
                  type="number"
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              )}
            />
          </Grid>
          {/* <Grid item xs={6}>
            <Controller
              name="index"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Index" type="number" fullWidth />
              )}
            />
          </Grid> */}
          <Grid item xs={6}>
            <Controller
              name="shippingCost"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Shipping Cost"
                  type="number"
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="basePrice"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Base Price"
                  type="number"
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              )}
            />
          </Grid>

          {/* Image Selector */}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              onClick={() => setGalleryOpen(true)}
              fullWidth
            >
              Select Images
            </Button>
            {selectedImages.length > 0 && (
              <Box mt={2}>
                <Typography variant="body2">Selected Images:</Typography>
                <Box display="flex" gap={1} mt={1}>
                  {selectedImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Selected ${index}`}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : product ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Gallery Dialog */}
      <Dialog
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Images</DialogTitle>
        <DialogContent>
          <GalleryPage selectImages={handleSelectImages} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGalleryOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddProduct;
