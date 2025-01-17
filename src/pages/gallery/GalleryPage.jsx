import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import { apiService } from "../../api/apiwrapper";
import { toast } from "react-toastify";
import { Close, CloudUpload } from "@mui/icons-material";
import ImageGrid from "./ImageGrid";

const GalleryPage = ({ selectImages }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMorePage, setHasMorePage] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);

  const pageSize = 6; // Number of images per page

  useEffect(() => {
    if (activeTab === 0) fetchGalleryImages();
  }, [activeTab, page]);

  const fetchGalleryImages = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(
        `/gallery?take=${pageSize}&skip=${(page - 1) * pageSize}`
      );
      setImages(response.data);
      setHasMorePage(response.data.length === pageSize);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 10) {
      toast.warning("You can upload a maximum of 10 images at a time.");
      return;
    }
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select images to upload.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("images", file));

    setUploading(true);
    try {
      await apiService.post("/gallery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Images uploaded successfully!");
      setSelectedFiles([]);
      setActiveTab(0); // Switch to image list tab after upload
      fetchGalleryImages();
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await apiService.delete(`/gallery/${id}`);
      // alert("Image deleted successfully!");
      toast.success("Image deleted successfully!");
      fetchGalleryImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const handlePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  return (
    <Box>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Gallery" />
        <Tab label="Upload Images" />
      </Tabs>

      {activeTab === 0 && (
        <Box p={3}>
          <ImageGrid
            images={images}
            loading={loading}
            handleDelete={handleDelete}
            handlePreview={handlePreview}
            selectImages={selectImages}
          />
        </Box>
      )}
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Pagination
          count={hasMorePage ? page + 1 : page}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {activeTab === 1 && (
        <Box p={3}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Upload Images
          </Typography>

          {/* Styled upload zone */}
          <Box
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              backgroundColor: "#fafafa",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "primary.main",
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              },
              position: "relative",
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = "#1976d2";
              e.currentTarget.style.backgroundColor =
                "rgba(25, 118, 210, 0.08)";
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = "#ccc";
              e.currentTarget.style.backgroundColor = "#fafafa";
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = "#ccc";
              e.currentTarget.style.backgroundColor = "#fafafa";
              const files = Array.from(e.dataTransfer.files);
              handleFileChange({ target: { files } });
            }}
          >
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
            />
            <Box sx={{ mb: 2 }}>
              <CloudUpload
                sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
              />
              <Typography variant="h6" color="primary" gutterBottom>
                Drag and drop your images here
              </Typography>
              <Typography variant="body2" color="text.secondary">
                or click to browse files
              </Typography>
            </Box>
          </Box>

          {/* Preview section */}
          {selectedFiles.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Selected Images ({selectedFiles.length})
              </Typography>
              <Grid container spacing={2}>
                {selectedFiles.map((file, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Paper
                      elevation={3}
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 2,
                        "&:hover .delete-button": {
                          opacity: 1,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          paddingTop: "75%", // 4:3 aspect ratio
                          backgroundColor: "#f5f5f5",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${index}`}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          className="delete-button"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            opacity: 0,
                            transition: "opacity 0.2s ease",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                            },
                          }}
                          onClick={() => {
                            const newFiles = [...selectedFiles];
                            newFiles.splice(index, 1);
                            setSelectedFiles(newFiles);
                          }}
                        >
                          <Close sx={{ color: "white" }} />
                        </IconButton>
                      </Box>
                      <Box sx={{ p: 1.5 }}>
                        <Typography
                          noWrap
                          variant="body2"
                          color="text.secondary"
                        >
                          {file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Upload button */}
          {selectedFiles.length > 0 && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={uploading}
                loadingPosition="start"
                startIcon={<CloudUpload />}
                sx={{
                  minWidth: 150,
                  "& .MuiLoadingButton-loadingIndicator": {
                    position: "relative",
                    left: -8,
                  },
                }}
              >
                {uploading
                  ? `Uploading (${selectedFiles.length})`
                  : "Upload All"}
              </Button>
            </Box>
          )}
        </Box>
      )}

      <Dialog open={!!previewImage} onClose={closePreview} maxWidth="lg">
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          <img
            src={previewImage}
            alt="Preview"
            style={{ width: "100%", height: "320px", objectFit: "contain" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closePreview} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GalleryPage;
