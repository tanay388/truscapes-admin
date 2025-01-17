import React from "react";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const ProductInfo = ({
  product,
  isEditing,
  editedProduct,
  setEditedProduct,
}) => {
  const handleInputChange = (field, value) =>
    setEditedProduct({ ...editedProduct, [field]: value });

  const { name, basePrice, description, stockAvailable, shippingCost } =
    isEditing ? editedProduct : product;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Product Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <TextField
                label="Name"
                value={name}
                fullWidth
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            ) : (
              <Typography>Name: {name}</Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <TextField
                label="Base Price"
                value={basePrice}
                fullWidth
                onChange={(e) => handleInputChange("basePrice", e.target.value)}
              />
            ) : (
              <Typography>Base Price: {basePrice}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            {isEditing ? (
              <TextField
                label="Description"
                value={description}
                fullWidth
                multiline
                rows={3}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            ) : (
              <Typography>Description: {description}</Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stockAvailable}
                    onChange={(e) =>
                      handleInputChange("stockAvailable", e.target.checked)
                    }
                  />
                }
                label="Stock Available"
              />
            ) : (
              <Typography>
                Stock Available: {stockAvailable ? "Yes" : "No"}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {isEditing ? (
              <TextField
                label="Shipping Cost"
                value={shippingCost}
                fullWidth
                onChange={(e) =>
                  handleInputChange("shippingCost", e.target.value)
                }
              />
            ) : (
              <Typography>Shipping Cost: {shippingCost}</Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProductInfo;
