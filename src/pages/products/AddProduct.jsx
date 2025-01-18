import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCategory } from "../../utils/contexts/CategoryContext";
import { apiService } from "../../api/apiwrapper";
import GalleryPage from "../gallery/GalleryPage";
import ProductForm from "./components/ProductForm";
import ProductHeader from "./components/ProductHeader";

const AddProduct = ({ product }) => {
  const { categories } = useCategory();
  const [loading, setLoading] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();

  const { control, handleSubmit, reset, setValue, watch } = useForm({
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

  const formData = watch();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValue(name, value);
  };

  const handleSelectImages = (images) => {
    setSelectedImages(images);
    setValue("images", images);
    setGalleryOpen(false);
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const data = { ...formData, images: selectedImages };

      if (product) {
        await apiService.patch(`/products/${product.id}`, data);
        toast.success("Product updated successfully!");
        navigate(`/products/${product.id}`);
      } else {
        const res = await apiService.post("/products", data);
        toast.success("Product added successfully!");
        navigate(`/products/${res.data.id}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(
        `Failed to ${product ? "update" : "add"} product. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ProductHeader
        isEditing={!!product}
        loading={loading}
        onSubmit={handleSubmit(onSubmit)}
      />

      <ProductForm
        formData={formData}
        categories={categories}
        onInputChange={handleInputChange}
        onGalleryOpen={() => setGalleryOpen(true)}
        selectedImages={selectedImages}
      />

      <Dialog
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Select Product Images</DialogTitle>
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