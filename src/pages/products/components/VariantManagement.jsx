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
import { Add, Delete, Edit } from "@mui/icons-material";
import GalleryPage from "../../gallery/GalleryPage";
import { apiService } from "../../../api/apiwrapper";

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

      <Grid container spacing={2}>
        {variants.map((variant) => (
          <Grid item xs={12} sm={6} md={4} key={variant.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={variant.images[0] || "/placeholder.png"}
                alt={variant.name}
              />
              <CardContent>
                <Typography variant="h6">{variant.name}</Typography>
                <Typography>Price: ${variant.price}</Typography>
                <Typography>Dealer Price: ${variant.dealerPrice}</Typography>
                <Typography>
                  Distributor Price: ${variant.distributorPrice}
                </Typography>
                <Typography>
                  Contractor Price: ${variant.contractorPrice}
                </Typography>
              </CardContent>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", p: 1 }}
              >
                <IconButton onClick={() => handleAddEditToggle(variant)}>
                  <Edit color="primary" />
                </IconButton>
                <IconButton onClick={() => handleDelete(variant.id)}>
                  <Delete color="error" />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

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
