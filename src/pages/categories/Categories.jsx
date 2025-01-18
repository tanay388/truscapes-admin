import { useState, useEffect } from "react";
import { Box, Card, CardContent } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { apiService } from "../../api/apiwrapper";
import { toast } from "react-toastify";

import CategoryHeader from "./components/CategoryHeader";
import CategorySearch from "./components/CategorySearch";
import CategoryTable from "./components/CategoryTable";
import CategoryDialog from "./components/CategoryDialog";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: "",
    image: null,
    index: 0,
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiService.get("/category");
      setCategories(response.data.sort((a, b) => a.index - b.index));
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
        image: category.image,
        index: category.index,
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: "",
        description: "",
        parentId: "",
        image: null,
        index: categories.length,
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
      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      if (selectedCategory) {
        await apiService.patch(
          `/category/${selectedCategory.id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Category updated successfully");
      } else {
        await apiService.post("/category", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
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

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ p: 3 }}>
        <Card elevation={0} sx={{ bgcolor: "transparent" }}>
          <CardContent>
            <CategoryHeader onAddClick={() => handleOpenDialog()} />
            <CategorySearch
              searchTerm={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              onSaveOrder={saveNewOrder}
              saving={saving}
            />
            <CategoryTable
              loading={loading}
              categories={filteredCategories}
              moveCategory={moveCategory}
              handleOpenDialog={handleOpenDialog}
              handleDelete={handleDelete}
            />
          </CardContent>
        </Card>

        <CategoryDialog
          open={openDialog}
          onClose={handleCloseDialog}
          formData={formData}
          onInputChange={handleInputChange}
          onImageChange={handleImageChange}
          onSubmit={handleSubmit}
          categories={categories}
          selectedCategory={selectedCategory}
          saving={saving}
        />
      </Box>
    </DndProvider>
  );
};

export default Categories;