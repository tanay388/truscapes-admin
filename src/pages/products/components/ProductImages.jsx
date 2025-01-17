import React from "react";
import { Grid, Card, CardMedia } from "@mui/material";

const ProductImages = ({ images }) => (
  <Grid container spacing={2} sx={{ mb: 3 }}>
    {images.map((image, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card>
          <CardMedia
            component="img"
            height="320"
            image={image}
            alt={`Product Image ${index + 1}`}
          />
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default ProductImages;
