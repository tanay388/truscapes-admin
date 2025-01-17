import {
  Check,
  CheckCircle,
  Delete,
  Image as ImageIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Skeleton,
  Typography,
  Paper,
} from "@mui/material";
import { useState } from "react";

const ImageGrid = ({
  loading,
  images,
  handleDelete,
  handlePreview,
  selectImage,
  selectImages,
}) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const isSelectionMode = selectImage || selectImages;
  const isMultiSelect = selectImages !== undefined;

  const handleImageClick = (image) => {
    if (!isSelectionMode) {
      handlePreview(image.imageUrl);
      return;
    }

    if (isMultiSelect) {
      setSelectedImages((prev) => {
        const isSelected = prev.some((img) => img.id === image.id);
        if (isSelected) {
          return prev.filter((img) => img.id !== image.id);
        } else {
          return [...prev, image];
        }
      });
    } else {
      const isSelected = selectedImages.some((img) => img.id === image.id);
      setSelectedImages(isSelected ? [] : [image]);
    }
  };

  const handleSubmitSelection = () => {
    if (isMultiSelect) {
      selectImages(selectedImages.map((img) => img.imageUrl));
    } else {
      selectImage(selectedImages[0].imageUrl);
    }
    setSelectedImages([]);
  };

  // Skeleton loader component
  const SkeletonGrid = () => (
    <Grid container spacing={2}>
      {[...Array(9)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Skeleton
              variant="rectangular"
              height={320}
              animation="wave"
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.08)",
                borderRadius: 2,
              }}
            />
            <Skeleton
              variant="text"
              width="60%"
              sx={{
                mt: 1,
                mx: "auto",
              }}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  // Empty state component
  const EmptyState = () => (
    <Paper
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: 400,
        backgroundColor: "rgba(0, 0, 0, 0.02)",
        border: "2px dashed rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
      }}
    >
      <ImageIcon
        sx={{
          fontSize: 64,
          color: "text.secondary",
          mb: 2,
          opacity: 0.5,
        }}
      />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No Images Found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        There are no images available to display at the moment
      </Typography>
    </Paper>
  );

  return (
    <Box>
      {/* Selection Submit Button */}
      {isSelectionMode && selectedImages.length > 0 && (
        <Box
          sx={{
            position: "sticky",
            top: 16,
            zIndex: 10,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "background.paper",
            p: 2,
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Typography>
            {selectedImages.length} image{selectedImages.length > 1 ? "s" : ""}{" "}
            selected
          </Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={() => setSelectedImages([])}
              sx={{ mr: 1 }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitSelection}
              startIcon={<Check />}
            >
              Confirm Selection
            </Button>
          </Box>
        </Box>
      )}

      {/* Main Content */}
      {loading ? (
        <SkeletonGrid />
      ) : images.length === 0 ? (
        <EmptyState />
      ) : (
        <Grid container spacing={2}>
          {images.map((image, index) => {
            const isSelected = selectedImages.some(
              (img) => img.id === image.id
            );

            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    boxShadow: isSelected ? 4 : 1,
                    borderRadius: "8px",
                    overflow: "hidden",
                    position: "relative",
                    cursor: isSelectionMode ? "pointer" : "default",
                    border: isSelected ? "2px solid" : "2px solid transparent",
                    borderColor: "primary.main",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: 3,
                      ...(isSelectionMode && {
                        borderColor: isSelected
                          ? "primary.main"
                          : "primary.light",
                      }),
                    },
                  }}
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.imageName}
                    style={{
                      width: "100%",
                      height: "320px",
                      objectFit: "contain",
                      backgroundColor: "#fff",
                    }}
                  />

                  {/* Selection Overlay */}
                  {isSelectionMode && isSelected && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "rgba(25, 118, 210, 0.1)",
                        display: "flex",
                        alignItems: "start",
                        justifyContent: "end",
                        p: 1,
                      }}
                    >
                      <CheckCircle
                        color="primary"
                        sx={{
                          fontSize: 32,
                          backgroundColor: "white",
                          borderRadius: "50%",
                        }}
                      />
                    </Box>
                  )}

                  {/* Delete Button */}
                  {!isSelectionMode && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image.id);
                      }}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.9)",
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>
                <Typography
                  align="center"
                  sx={{
                    mt: 1,
                    color: isSelected ? "primary.main" : "text.primary",
                  }}
                >
                  {image.imageName}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default ImageGrid;
