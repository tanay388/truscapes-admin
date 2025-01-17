import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

const WalletCard = ({ user }) => {
  const theme = useTheme();
  return (
    <Grid item xs={12}>
      <Card
        sx={{
          height: "100%",
          borderRadius: 3,
          boxShadow: theme.shadows[3],
          bgcolor: "background.paper",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Add a gradient overlay at the top for a modern look */}
        <Box
          sx={{
            height: 4,
            background: "linear-gradient(to right, #4caf50, #81c784)",
          }}
        />

        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ mb: 2, color: "primary.main" }}
          >
            Wallet Information
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Wallet Information Grid */}
          <Grid container spacing={3}>
            {/* Wallet Balance */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
                sx={{ mb: 1 }}
              >
                Wallet Balance
              </Typography>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                ${user.wallet?.balance?.toFixed(2) || "0.00"}
              </Typography>
            </Grid>

            {/* Credit Due */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
                sx={{ mb: 1 }}
              >
                Credit Due
              </Typography>
              <Typography variant="h5" fontWeight={700} color="error.main">
                ${user.wallet?.creditDue?.toFixed(2) || "0.00"}
              </Typography>
            </Grid>
          </Grid>

          {/* Add a subtle action button at the bottom */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Add Credit
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default WalletCard;
