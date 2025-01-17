import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import { useCategory } from "../../../utils/contexts/CategoryContext";

const CategoryDetails = ({ category, isEditing, setEditedProduct }) => {
  const { categories } = useCategory();
  const handleCategoryChange = (value) =>
    setEditedProduct((prev) => ({
      ...prev,
      category: categories.find((cat) => cat.id === value),
    }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Category Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <Select
                fullWidth
                value={category ? category.id : ""}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <>
                <Typography>
                  <strong>Category Name:</strong> {category?.name || "N/A"}
                </Typography>
                {category?.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    style={{ width: "100px", marginTop: "10px" }}
                  />
                )}
              </>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CategoryDetails;
