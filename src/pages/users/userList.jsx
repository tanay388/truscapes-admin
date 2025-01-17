import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Grid,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiService } from "../../api/apiwrapper";
import AnimatedLoader from "../../components/loaders/AnimatedLoader";
import { toast } from "react-toastify";

const InfluencerManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const loadMoreRef = useRef(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    action: null,
  });
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["users", searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiService.get(
        `user/users?take=10&skip=${pageParam}${
          searchQuery ? `&search=${searchQuery}` : ""
        }`
      );
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length * 10 : undefined;
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allUsers = data?.pages.flat() || [];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchTerm);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const handleMenuOpen = (event, user) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedInfluencer(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = (user) => {
    navigate(`/users/${user.id}`);
    handleMenuClose();
  };

  const handleApprove = async () => {
    try {
      setIsConfirmLoading(true);
      await apiService.post(`user/users/${selectedInfluencer.id}/approve`);
      handleMenuClose();
      setConfirmDialog({ open: false, title: "", action: null });
      refetch();
      toast.success("Influencer approved successfully");
    } catch (error) {
      console.error("Error approving influencer:", error);
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const handleSuspend = async () => {
    try {
      setIsConfirmLoading(true);
      await apiService.post(`user/users/${selectedInfluencer.id}/block`);
      handleMenuClose();
      setConfirmDialog({ open: false, title: "", action: null });
      refetch();
      toast.success("Influencer suspended successfully");
    } catch (error) {
      console.error("Error suspending influencer:", error);
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const openConfirmDialog = (title, action) => {
    setConfirmDialog({
      open: true,
      title,
      action,
    });
  };

  const filteredUsers = allUsers.filter((user) => {
    const userStatus = user.approved ? "approved" : "not approved";
    const matchesStatus =
      selectedStatus === "all" || userStatus === selectedStatus;
    return matchesStatus;
  });

  if (isLoading) {
    return <AnimatedLoader />;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        User Management
      </Typography>

      {/* Filters and Search */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Search influencers..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearchSubmit}
              sx={{ minWidth: "100px" }}
            >
              Search
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant={selectedStatus === "all" ? "contained" : "outlined"}
            onClick={() => handleStatusFilter("all")}
            sx={{ mr: 1 }}
          >
            All
          </Button>
          <Button
            variant={selectedStatus === "approved" ? "contained" : "outlined"}
            onClick={() => handleStatusFilter("approved")}
            color="success"
            sx={{ mr: 1 }}
          >
            Approved
          </Button>
          <Button
            variant={
              selectedStatus === "not approved" ? "contained" : "outlined"
            }
            onClick={() => handleStatusFilter("not approved")}
            color="error"
            sx={{ mr: 1 }}
          >
            Pending Approval
          </Button>
        </Grid>
      </Grid>

      {/* Influencers Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" },
                  }}
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={user.photo}
                        alt={user.name}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      >
                        {user.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{user.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.approved ? "Approved" : "Not Approved"}
                      color={user.approved ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center" onClick={(e) => e.preventDefault()}>
                    <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div ref={loadMoreRef} style={{ textAlign: "center", padding: "20px" }}>
          {isFetchingNextPage && <CircularProgress />}
          {!hasNextPage && <Typography>No more user to load</Typography>}
          {isFetching && !isFetchingNextPage && <CircularProgress />}
        </div>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewDetails(selectedInfluencer)}>
          <VisibilityIcon sx={{ mr: 1 }} /> View Details
        </MenuItem>
        {!selectedInfluencer?.approved && (
          <MenuItem
            onClick={() =>
              openConfirmDialog(
                "Are you sure you want to approve this influencer?",
                handleApprove
              )
            }
          >
            <CheckCircleIcon sx={{ mr: 1 }} /> Approve
          </MenuItem>
        )}
        {selectedInfluencer?.approved && (
          <MenuItem
            onClick={() =>
              openConfirmDialog(
                "Are you sure you want to suspend this influencer?",
                handleSuspend
              )
            }
          >
            <BlockIcon sx={{ mr: 1 }} /> Suspend
          </MenuItem>
        )}
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, title: "", action: null })
        }
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDialog({ open: false, title: "", action: null })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDialog.action}
            variant="contained"
            color="primary"
            disabled={isConfirmLoading}
          >
            {isConfirmLoading ? <CircularProgress size={24} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InfluencerManagement;
