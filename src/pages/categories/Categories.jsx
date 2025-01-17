import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { apiService } from "../../api/apiwrapper";
import { toast } from "react-toastify";

const DraggableRow = ({
  category,
  index,
  moveCategory,
  handleOpenDialog,
  handleDelete,
}) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: "CATEGORY",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCategory(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "CATEGORY",
    item: () => {
      return { id: category.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <TableRow
      ref={ref}
      style={{ opacity, cursor: "move" }}
      data-handler-id={handlerId}
    >
      <TableCell>{category.index}</TableCell>
      <TableCell>
        <Box
          component="img"
          sx={{
            width: 50,
            height: 50,
            objectFit: "cover",
            borderRadius: 1,
          }}
          src={category.image}
          alt={category.name}
        />
      </TableCell>
      <TableCell>{category.name}</TableCell>
      <TableCell>{category.description}</TableCell>
      <TableCell>{category.parent?.name || "-"}</TableCell>
      <TableCell align="right">
        <IconButton onClick={() => handleOpenDialog(category)} color="primary">
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDelete(category.id)} color="error">
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: "",
    relatedCategoryIds: null,
    image: null,
    index: 0,
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiService.get("/category");
      setCategories(response.data.sort((a, b) => a.index - b.index)); // Sort by index
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        parentId: category.parent?.id || "",
        relatedCategoryIds: category.relatedCategoryIds || null,
        image: category.image,
        index: category.index,
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: "",
        description: "",
        parentId: "",
        relatedCategoryIds: null,
        image: null,
        index: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCategory(null);
    setFormData({
      name: "",
      description: "",
      parentId: "",
      relatedCategoryIds: null,
      image: null,
      index: 0,
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("index", formData.index);
      if (formData.parentId) {
        formDataToSend.append("parentId", formData.parentId);
      }
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (selectedCategory) {
        await apiService.patch(
          `/category/${selectedCategory.id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Category updated successfully");
      } else {
        await apiService.post("/category", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Category created successfully");
      }
      handleCloseDialog();
      fetchCategories();
    } catch (error) {
      toast.error(
        selectedCategory
          ? "Failed to update category"
          : "Failed to create category"
      );
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const moveCategory = (fromIndex, toIndex) => {
    const updatedCategories = [...categories];
    const [movedCategory] = updatedCategories.splice(fromIndex, 1);
    updatedCategories.splice(toIndex, 0, movedCategory);

    // Update the indexes
    updatedCategories.forEach((cat, idx) => {
      cat.index = idx;
    });

    setCategories(updatedCategories);
  };

  const saveNewOrder = async () => {
    setLoading(true);
    try {
      await Promise.all(
        categories.map((category, index) =>
          apiService.patch(`/category/${category.id}`, {
            index: index.toString(),
          })
        )
      );
      toast.success("Category order updated successfully");
    } catch (error) {
      toast.error("Failed to update category order");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await apiService.delete(`/category/${id}`);
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (error) {
        toast.error("Failed to delete category");
        console.error(error);
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" component="h1">
            Categories
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={saveNewOrder}
            disabled={saving}
          >
            Save Order
          </Button>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Category
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Index</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Parent Category</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category, index) => (
                  <DraggableRow
                    key={category.id}
                    category={category}
                    index={index}
                    moveCategory={moveCategory}
                    handleOpenDialog={handleOpenDialog}
                    handleDelete={handleDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedCategory ? "Edit Category" : "Add New Category"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Index"
              name="index"
              value={formData.index}
              onChange={handleInputChange}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Parent Category</InputLabel>
              <Select
                value={formData.parentId}
                name="parentId"
                onChange={handleInputChange}
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
              onChange={handleImageChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {selectedCategory ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </DndProvider>
  );
};

export default Categories;
