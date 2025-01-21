import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  CircularProgress,
} from '@mui/material';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { apiService } from '../../api/apiwrapper';
import AnimatedLoader from '../../components/loaders/AnimatedLoader';

const OrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

const UserOrders = () => {
  const { userId } = useParams();
  const loadMoreRef = useRef(null);

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => apiService.get(`/user/${userId}`).then(res => res.data),
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['userOrders', userId],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiService.get(
        `/orders/user/${userId}?take=10&skip=${pageParam}`
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
        rootMargin: '200px',
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
        return 'warning';
      case OrderStatus.PROCESSING:
        return 'info';
      case OrderStatus.SHIPPED:
        return 'primary';
      case OrderStatus.DELIVERED:
        return 'success';
      case OrderStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return <AnimatedLoader />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Orders for {user?.name}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {user?.email}
      </Typography>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Tracking Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allOrders.map((order) => (
                <TableRow
                  key={order.id}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
                  }}
                >
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>${order.totalAmount}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {order.trackingNumber || 'Not available'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div ref={loadMoreRef} style={{ textAlign: 'center', padding: '20px' }}>
          {isFetchingNextPage && <CircularProgress />}
          {!hasNextPage && <Typography>No more orders to load</Typography>}
          {isFetching && !isFetchingNextPage && <CircularProgress />}
        </div>
      </Card>
    </Box>
  );
};

export default UserOrders;