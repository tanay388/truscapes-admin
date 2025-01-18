import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";

const CategoryDialog = ({
  open,
  onClose,
  formData,
  onInputChange,
  onImageChange,
  onSubmit,
  categories,
  selectedCategory,
  saving,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        {selectedCategory ? "Edit Category" : "Add New Category"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={onInputChange}
            multiline
            rows={3}
          />
          <FormControl fullWidth>
            <InputLabel>Parent Category</InputLabel>
            <Select
              value={formData.parentId}
              name="parentId"
              onChange={onInputChange}
              label="Parent Category"
            >
              <MenuItem value="">None</MenuItem>
              {categories
                .filter(
                  (category) =>
                    !selectedCategory || category.id !== selectedCategory.id
                )
                .map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="file"
            label="Image"
            name="image"
            onChange={onImageChange}
            InputLabelProps={{ shrink: true }}
          />
          {formData.image && typeof formData.image === "string" && (
            <Box
              component="img"
              src={formData.image}
              alt="Preview"
              sx={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={saving}
          startIcon={saving && <CircularProgress size={20} />}
        >
          {selectedCategory ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;