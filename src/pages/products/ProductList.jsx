import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiService } from "../../api/apiwrapper";
import { useCategory } from "../../utils/contexts/CategoryContext";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "react-toastify";

const ItemTypes = {
  PRODUCT: "PRODUCT",
};

const ProductRow = ({ product, index, moveProduct, updateCategoryIndex }) => {
  const [, ref] = useDrag({
    type: ItemTypes.PRODUCT,
    item: { index },
  });
  const nav = useNavigate();

  const [, drop] = useDrop({
    accept: ItemTypes.PRODUCT,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveProduct(draggedItem.index, index);
        draggedItem.index = index; // Update index after moving
      }
    },
    drop: () => {
      updateCategoryIndex();
    },
  });

  return (
    <TableRow
      ref={(node) => drop(ref(node))}
      key={product.id}
      onClick={() => {
        nav(`/products/${product.id}`);
      }}
    >
      <TableCell>{product.name}</TableCell>
      <TableCell>
        <div
          className="mt-1 text-sm prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </TableCell>
      <TableCell>{product.category.name}</TableCell>
      <TableCell>{product.state}</TableCell>
      <TableCell>${product.basePrice}</TableCell>
    </TableRow>
  );
};

const ProductList = () => {
  const { categories } = useCategory();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const take = 10; // Items per page
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      q: searchParams.get("q") || "",
      categoryId: searchParams.get("categoryId") || categories[0]?.id,
      state: searchParams.get("state") || "ACTIVE",
    },
  });

  const fetchProducts = async (params) => {
    setLoading(true);
    try {
      const response = await apiService.get("/products", { params });
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (data) => {
    const params = { ...data, skip: (currentPage - 1) * take, take };
    const filters = {
      q: data.q || "",
      categoryId: data.categoryId || "",
      state: data.state || "ACTIVE",
      skip: (currentPage - 1) * take,
      take,
    };
    setSearchParams(filters); // Update the URL with filters
    fetchProducts(filters);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    const filters = {
      q: searchParams.get("q") || "",
      categoryId: searchParams.get("categoryId") || "",
      state: searchParams.get("state") || "ACTIVE",
      skip: (page - 1) * take,
      take,
    };
    setSearchParams(filters);
    fetchProducts(filters);
  };

  const moveProduct = (fromIndex, toIndex) => {
    const updatedProducts = [...products];
    const [movedProduct] = updatedProducts.splice(fromIndex, 1);
    updatedProducts.splice(toIndex, 0, movedProduct);
    setProducts(updatedProducts);
  };

  const updateCategoryIndex = async () => {
    try {
      const reorderedData = products.map((product, index) => ({
        id: product.id,
        orderIndex: index,
      }));
      await apiService.put("/products/reorder", { products: reorderedData });
      toast.success("Product order updated successfully.");
    } catch (error) {
      console.error("Error updating product order:", error);
      toast.error("Failed to update product order. Please try again.");
    }
  };

  useEffect(() => {
    const filters = {
      q: searchParams.get("q") || "",
      categoryId: searchParams.get("categoryId") || categories[0]?.id,
      state: searchParams.get("state") || "ACTIVE",
      skip: (currentPage - 1) * take,
      take,
    };
    fetchProducts(filters);

    // Populate form fields with current URL filters
    setValue("q", filters.q);
    setValue("categoryId", filters.categoryId);
    setValue("state", filters.state);
  }, [searchParams, currentPage]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Product List
        </Typography>
        <form onSubmit={handleSubmit(handleSearch)}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="q"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Search" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select {...field} label="Category">
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      <MenuItem value="DRAFT">Draft</MenuItem>
                      <MenuItem value="ACTIVE">Published</MenuItem>
                      <MenuItem value="INACTIVE">Archived</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Search"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  reset();
                  setSearchParams({});
                  fetchProducts({ take, skip: 0 }); // Reset filters
                }}
                style={{ marginLeft: "16px" }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>

        <Box mt={4}>
          {loading ? (
            <CircularProgress />
          ) : products.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product, index) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      index={index}
                      moveProduct={moveProduct}
                      updateCategoryIndex={updateCategoryIndex}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No products found.</Typography>
          )}
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={products.length < take ? currentPage : currentPage + 1}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
    </DndProvider>
  );
};

export default ProductList;
