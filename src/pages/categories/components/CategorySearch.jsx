import { Grid, TextField, Button, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const CategorySearch = ({ searchTerm, onSearchChange, onSaveOrder, saving }) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          placeholder="Search categories..."
          value={searchTerm}
          onChange={onSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: "background.paper", borderRadius: 1 }}
        />
      </Grid>
      <Grid item xs={12} sm={6} sx={{ textAlign: "right" }}>
        <Button
          variant="outlined"
          onClick={onSaveOrder}
          disabled={saving}
          sx={{ px: 3, borderRadius: 2 }}
        >
          Save Order
        </Button>
      </Grid>
    </Grid>
  );
};

export default CategorySearch;