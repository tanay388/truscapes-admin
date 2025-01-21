import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  Grid,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../api/apiwrapper';
import { toast } from 'react-toastify';
import AnimatedLoader from '../../components/loaders/AnimatedLoader';

const OrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

const OrderDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [updateDialog, setUpdateDialog] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    trackingNumber: '',
    notes: '',
  });

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => apiService.get(`/orders/${id}`).then(res => res.data),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => apiService.patch(`/orders/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['order', id]);
      toast.success('Order updated successfully');
      setUpdateDialog(false);
    },
    onError: (error) => {
      toast.error('Failed to update order');
      console.error('Update error:', error);
    },
  });

  const handleUpdateSubmit = () => {
    updateMutation.mutate(updateData);
  };

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

  if (!order) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Order not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <div>
          <Typography variant="h4" gutterBottom>
            Order #{order.id}
          </Typography>
          <Chip
            label={order.status}
            color={getStatusColor(order.status)}
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </Typography>
        </div>
        <Button
          variant="contained"
          onClick={() => {
            setUpdateData({
              status: order.status,
              trackingNumber: order.trackingNumber || '',
              notes: order.notes || '',
            });
            setUpdateDialog(true);
          }}
        >
          Update Order
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Customer Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
            <Typography>Name: {order.user?.name}</Typography>
            <Typography>Email: {order.user?.email}</Typography>
            <Typography>Phone: {order.user?.phone}</Typography>
          </Card>
        </Grid>

        {/* Shipping Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            <Typography>
              Tracking Number: {order.trackingNumber || 'Not available'}
            </Typography>
            <Typography>Notes: {order.notes || 'No notes'}</Typography>
          </Card>
        </Grid>

        {/* Order Items */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            <Box sx={{ mt: 2 }}>
              {order.items?.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {item.product?.images?.[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <Typography variant="subtitle1">
                        {item.product?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                    </div>
                  </Box>
                  <Typography variant="subtitle1">
                    ${item.price * item.quantity}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 3, textAlign: 'right' }}>
              <Typography variant="h6">
                Total Amount: ${order.totalAmount}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Update Dialog */}
      <Dialog open={updateDialog} onClose={() => setUpdateDialog(false)}>
        <DialogTitle>Update Order</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <TextField
            select
            fullWidth
            label="Status"
            value={updateData.status}
            onChange={(e) =>
              setUpdateData({ ...updateData, status: e.target.value })
            }
            margin="normal"
          >
            {Object.values(OrderStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Tracking Number"
            value={updateData.trackingNumber}
            onChange={(e) =>
              setUpdateData({ ...updateData, trackingNumber: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Notes"
            value={updateData.notes}
            onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateSubmit}
            variant="contained"
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? (
              <CircularProgress size={24} />
            ) : (
              'Update'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetail;