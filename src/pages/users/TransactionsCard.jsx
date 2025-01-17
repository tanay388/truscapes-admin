import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";

const transactions = [
  {
    id: 1,
    type: "DEPOSIT",
    amount: 100.0,
    description: "Monthly wallet deposit",
    createdAt: "2025-01-12T10:30:00Z",
  },
  {
    id: 2,
    type: "WITHDRAWAL",
    amount: 50.0,
    description: "Purchase at Store A",
    createdAt: "2025-01-11T08:15:00Z",
  },
  {
    id: 3,
    type: "CREDIT_ADDED",
    amount: 20.0,
    description: "Credit added to account",
    createdAt: "2025-01-10T14:45:00Z",
  },
];

const TransactionCard = () => {
  
  return (
    <Grid item xs={12}>
      <Card
        sx={{
          height: "100%",
          borderRadius: 3,
          boxShadow: (theme) => theme.shadows[3],
          bgcolor: "background.paper",
        }}
      >
        {/* Top Gradient */}
        <Box
          sx={{
            height: 4,
            background: "linear-gradient(to right, #3f51b5, #2196f3)",
          }}
        />

        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ mb: 2, color: "primary.main" }}
          >
            Transactions
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* Transactions List */}
          <List>
            {transactions.map((transaction) => (
              <ListItem
                key={transaction.id}
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Grid container spacing={2}>
                    {/* Transaction Type */}
                    <Grid item xs={12} md={3}>
                      <Chip
                        label={transaction.type.replace("_", " ")}
                        color={
                          transaction.type === "DEPOSIT"
                            ? "success"
                            : transaction.type === "WITHDRAWAL"
                            ? "error"
                            : "info"
                        }
                        sx={{ fontWeight: 500 }}
                      />
                    </Grid>

                    {/* Amount */}
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        Amount
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color={
                          transaction.type === "WITHDRAWAL"
                            ? "error.main"
                            : "text.primary"
                        }
                      >
                        ${transaction.amount.toFixed(2)}
                      </Typography>
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body1" color="text.primary">
                        {transaction.description || "N/A"}
                      </Typography>
                    </Grid>

                    {/* Created At */}
                    <Grid item xs={12} md={2}>
                      <Typography variant="body2" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body1" color="text.primary">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TransactionCard;
