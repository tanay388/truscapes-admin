import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiService } from "../../api/apiwrapper";
import AnimatedLoader from "../../components/loaders/AnimatedLoader";

const OrderStatus = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

const OrderList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const loadMoreRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["orders", searchTerm, selectedStatus],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiService.get(
        `/orders?take=10&skip=${pageParam}`
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

  const allOrders = data?.pages.flat() || [];

  const getStatusColor = (status) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "warning";
      case OrderStatus.PROCESSING:
        return "info";
      case OrderStatus.SHIPPED:
        return "primary";
      case OrderStatus.DELIVERED:
        return "success";
      case OrderStatus.CANCELLED:
        return "error";
      default:
        return "default";
    }
  };

  const filteredOrders = allOrders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    const matchesSearch =
      order.id.toString().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return <AnimatedLoader />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Orders Management
      </Typography>

      <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
        <TextField
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All Orders</MenuItem>
            {Object.values(OrderStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" },
                  }}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.user?.name || "N/A"}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>${order.total}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/orders/${order.id}`);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div ref={loadMoreRef} style={{ textAlign: "center", padding: "20px" }}>
          {isFetchingNextPage && <CircularProgress />}
          {!hasNextPage && <Typography>No more orders to load</Typography>}
          {isFetching && !isFetchingNextPage && <CircularProgress />}
        </div>
      </Card>
    </Box>
  );
};

export default OrderList;
