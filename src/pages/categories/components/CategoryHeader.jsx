import { Grid, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const CategoryHeader = ({ onAddClick }) => {
  return (
    <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6}>
        <Typography variant="h4" fontWeight={600}>
          Categories
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Manage and organize your product categories
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} sx={{ textAlign: "right" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddClick}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            boxShadow: 2,
            "&:hover": { transform: "translateY(-1px)" },
          }}
        >
          Add Category
        </Button>
      </Grid>
    </Grid>
  );
};

export default CategoryHeader;