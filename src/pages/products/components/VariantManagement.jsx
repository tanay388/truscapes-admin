import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  DialogActions,
} from "@mui/material";
import { Add, ChevronRight, Delete, Edit } from "@mui/icons-material";
import GalleryPage from "../../gallery/GalleryPage";
import { apiService } from "../../../api/apiwrapper";
import { BiPencil, BiSave, BiTrash, BiUpload, BiX } from "react-icons/bi";

const VariantManagement = ({ product }) => {
  const [variants, setVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentVariant, setCurrentVariant] = useState(null);

  // Fetch variants
  useEffect(() => {
    const fetchVariants = async () => {
      setVariants(product.variants);
    };
    fetchVariants();
  }, [product]);

  const handleAddEditToggle = (variant = null) => {
    setCurrentVariant(variant);
    setSelectedImages(variant?.images || []);
    setIsPopupOpen(true);
  };

  const handleDelete = async (variantId) => {
    try {
      await apiService.delete(`/products/remove-variant/${variantId}`);
      setVariants(variants.filter((v) => v.id !== variantId));
    } catch (error) {
      console.error("Failed to delete variant:", error);
    }
  };

  const handleSave = async () => {
    try {
      let response = { data: product };
      if (currentVariant?.id) {
        // Edit existing variant
        response = await apiService.patch(
          `/products/update-variant/${currentVariant.id}`,
          {
            ...currentVariant,
            images: selectedImages,
          }
        );
      } else {
        // Add new variant
        response = await apiService.post(
          `/products/add-variant/${product.id}`,
          {
            ...currentVariant,
            images: selectedImages,
            productId: product.id,
          }
        );
      }
      setIsPopupOpen(false);
      // Refresh variants
      //   const response = await apiService.get(`/products/${productId}/variants`);
      setVariants(response.data.variants);
    } catch (error) {
      console.error("Failed to save variant:", error);
    }
  };

  const handleImageSelection = (images) => {
    setSelectedImages(images);
    setIsGalleryOpen(false);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Manage Variants</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleAddEditToggle()}
        >
          Add Variant
        </Button>
      </Box>

      <div className="space-y-4">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image Section */}
              <div className="sm:w-48 h-48 flex-shrink-0">
                <img
                  src={variant.images[0] || "/placeholder.png"}
                  alt={variant.name}
                  className="w-full h-full object-cover object-center rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                />
              </div>

              {/* Content Section */}
              <div className="flex-grow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {variant.name}
                    </h3>

                    {/* Price Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">
                          Regular Price
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          ${variant.price}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">
                          Dealer Price
                        </p>
                        <p className="text-base font-semibold text-blue-600">
                          ${variant.dealerPrice}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">
                          Distributor Price
                        </p>
                        <p className="text-base font-semibold text-green-600">
                          ${variant.distributorPrice}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">
                          Contractor Price
                        </p>
                        <p className="text-base font-semibold text-purple-600">
                          ${variant.contractorPrice}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddEditToggle(variant)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                    >
                      <BiPencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(variant.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                    >
                      <BiTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Additional Details Section
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <div className="flex space-x-4">
                    {variant.sku && <span>SKU: {variant.sku}</span>}
                    {variant.stock && <span>Stock: {variant.stock} units</span>}
                  </div>
                  <ChevronRight className="h-5 w-5 ml-auto text-gray-400" />
                </div> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Variant Popup */}

      <Dialog
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentVariant?.id ? "Edit Variant" : "Add Variant"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Name"
              value={currentVariant?.name || ""}
              onChange={(e) =>
                setCurrentVariant({ ...currentVariant, name: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={currentVariant?.price || ""}
              onChange={(e) =>
                setCurrentVariant({ ...currentVariant, price: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Dealer Price"
              type="number"
              value={currentVariant?.dealerPrice || ""}
              onChange={(e) =>
                setCurrentVariant({
                  ...currentVariant,
                  dealerPrice: e.target.value,
                })
              }
              fullWidth
            />
            <TextField
              label="Distributor Price"
              type="number"
              value={currentVariant?.distributorPrice || ""}
              onChange={(e) =>
                setCurrentVariant({
                  ...currentVariant,
                  distributorPrice: e.target.value,
                })
              }
              fullWidth
            />
            <TextField
              label="Contractor Price"
              type="number"
              value={currentVariant?.contractorPrice || ""}
              onChange={(e) =>
                setCurrentVariant({
                  ...currentVariant,
                  contractorPrice: e.target.value,
                })
              }
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={() => setIsGalleryOpen(true)}
              fullWidth
            >
              Select Images
            </Button>
            <Grid container spacing={2}>
              {selectedImages.map((img, index) => (
                <Grid item xs={4} key={index}>
                  <Card>
                    <CardMedia component="img" height="100" image={img} />
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Button variant="contained" color="success" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Gallery Dialog */}
      <Dialog
        open={isGalleryOpen}
        onClose={() => setGalleryOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Images</DialogTitle>
        <DialogContent>
          <GalleryPage selectImages={handleImageSelection} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsGalleryOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VariantManagement;
