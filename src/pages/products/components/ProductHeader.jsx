import { Box, Typography, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ProductHeader = ({ isEditing, loading, onSubmit }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/products")}
          sx={{ mb: 1 }}
        >
          Back to Products
        </Button>
        <Typography variant="h4" fontWeight={600}>
          {isEditing ? "Edit Product" : "Add New Product"}
        </Typography>
        <Typography color="text.secondary">
          {isEditing
            ? "Update your product information"
            : "Create a new product listing"}
        </Typography>
      </Box>
      <Button
        variant="contained"
        size="large"
        onClick={onSubmit}
        disabled={loading}
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: 2,
          boxShadow: 2,
          "&:hover": { transform: "translateY(-1px)" },
        }}
      >
        {isEditing ? "Update Product" : "Create Product"}
      </Button>
    </Box>
  );
};

export default ProductHeader;