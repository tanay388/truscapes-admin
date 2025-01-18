import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import DraggableRow from "./DraggableRow";

const CategoryTable = ({
  loading,
  categories,
  moveCategory,
  handleOpenDialog,
  handleDelete,
}) => {
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (categories.length === 0) {
    return (
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        No categories found
      </Alert>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" />
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
  );
};

export default CategoryTable;