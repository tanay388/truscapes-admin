import {
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import { AttachMoney, Image as ImageIcon } from "@mui/icons-material";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link'
];

const ProductForm = ({
  formData,
  categories,
  onInputChange,
  onGalleryOpen,
  selectedImages,
}) => {
  const handleQuillChange = (value) => {
    onInputChange({
      target: {
        name: "description",
        value,
        type: "text",
        checked: false,
      },
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card elevation={0} sx={{ borderRadius: 2, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                  required
                  sx={{ mb: 3 }}
                />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Description
                </Typography>
                <Box sx={{ 
                  '.ql-container': {
                    borderBottomLeftRadius: 1,
                    borderBottomRightRadius: 1,
                    backgroundColor: 'background.paper'
                  },
                  '.ql-toolbar': {
                    borderTopLeftRadius: 1,
                    borderTopRightRadius: 1,
                    backgroundColor: 'background.paper'
                  },
                  '.ql-editor': {
                    minHeight: '200px'
                  }
                }}>
                  <ReactQuill
                    value={formData.description}
                    onChange={handleQuillChange}
                    modules={modules}
                    formats={formats}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Media
            </Typography>
            <Box
              sx={{
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
              onClick={onGalleryOpen}
            >
              <ImageIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
              <Typography variant="subtitle1" gutterBottom>
                Select Product Images
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click to choose images from gallery
              </Typography>
            </Box>
            {selectedImages.length > 0 && (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {selectedImages.map((img, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Box
                      component="img"
                      src={img}
                      alt={`Selected ${index + 1}`}
                      sx={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card elevation={0} sx={{ borderRadius: 2, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Organization
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={onInputChange}
                label="Category"
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Position Of Product"
              name="categoryIndex"
              type="number"
              value={formData.categoryIndex}
              onChange={onInputChange}
              inputProps={{ min: 0 }}
            />
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 2, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Pricing
            </Typography>
            <TextField
              fullWidth
              label="Base Price"
              name="basePrice"
              type="number"
              value={formData.basePrice}
              onChange={onInputChange}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Shipping Cost"
              name="shippingCost"
              type="number"
              value={formData.shippingCost}
              onChange={onInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney />
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Inventory
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.stockAvailable}
                  onChange={(e) =>
                    onInputChange({
                      target: {
                        name: "stockAvailable",
                        value: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="Stock Available"
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProductForm;