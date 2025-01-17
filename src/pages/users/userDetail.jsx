import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Typography,
  Box,
  Avatar,
  Grid,
  Card,
  CardContent,
  Container,
  CircularProgress,
  IconButton,
  Stack,
  Chip,
  Divider,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Cake as CakeIcon,
  Wc as GenderIcon,
  Block,
  LocationCity,
  Business,
} from "@mui/icons-material";
import { FaTiktok } from "react-icons/fa";
import { apiService } from "../../api/apiwrapper";
import { toast } from "react-toastify";
import { BsCheckCircleFill } from "react-icons/bs";
import TransactionCard from "./TransactionsCard";
import WalletCard from "./WalletCard";

const InfluencerDetails = () => {
  const { id } = useParams();
  const theme = useTheme();
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    action: null,
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await apiService.get(`user/${id}`);
      return response.data;
    },
  });

  const handleApprove = async () => {
    try {
      await apiService.post(`user/users/${id}/approve`);
      setConfirmDialog({ open: false, title: "", action: null });
      toast.success("Influencer approved successfully");
      user.approved = true;
    } catch (error) {
      console.error("Error approving influencer:", error);
    }
  };

  const handleSuspend = async () => {
    try {
      await apiService.post(`user/users/${id}/block`);
      setConfirmDialog({ open: false, title: "", action: null });
      toast.success("Influencer suspended successfully");
      user.approved = false;
    } catch (error) {
      console.error("Error suspending influencer:", error);
    }
  };

  const openConfirmDialog = (title, action) => {
    setConfirmDialog({
      open: true,
      title,
      action,
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>User not found</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: alpha(theme.palette.background.default, 0.98),
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Card */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: theme.shadows[3] }}>
          <Box
            sx={{
              p: 4,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.1
              )}, ${alpha(theme.palette.primary.main, 0.05)})`,
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  src={user.photo}
                  alt={user.name}
                  sx={{
                    width: 120,
                    height: 120,
                    border: `4px solid ${theme.palette.background.paper}`,
                  }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="h4" fontWeight={600}>
                  {user.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {user.role}
                  <Chip
                    label={user.approved ? "Approved" : "Pending"}
                    color={user.approved ? "success" : "warning"}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Grid>
              <Grid item>
                {!user?.approved && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<BsCheckCircleFill />}
                    onClick={() =>
                      openConfirmDialog(
                        "Are you sure you want to approve this influencer?",
                        handleApprove
                      )
                    }
                  >
                    {" "}
                    Approve
                  </Button>
                )}
                {user?.approved && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Block />}
                    onClick={() =>
                      openConfirmDialog(
                        "Are you sure you want to suspend this influencer?",
                        handleSuspend
                      )
                    }
                  >
                    Suspend
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
        </Card>

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: theme.shadows[3],
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PersonIcon
                    sx={{ mr: 1, color: theme.palette.primary.main }}
                  />
                  <Typography variant="h6" fontWeight={600}>
                    Basic Information
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography>{user.email}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography>{user.phone}</Typography>
                  </Box>
                  {user.birthDate && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CakeIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography>
                        {new Date(user.birthDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <GenderIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography>{user.gender}</Typography>
                  </Box>
                  {user.category && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CategoryIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography>{user.category.name}</Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Social Media Links */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: theme.shadows[3],
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Company Info
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Stack spacing={2}>
                  {user.country && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocationCity sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography>{user.country}</Typography>
                    </Box>
                  )}
                  {user.city && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocationCity sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography>{user.city}</Typography>
                    </Box>
                  )}
                  {user.company && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Business sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography>{user.company}</Typography>
                    </Box>
                  )}
                  {user.companyWebsite && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Link href={user.companyWebsite} target="_blank">
                        <Typography variant="body2" color="primary">
                          {user.companyWebsite}
                        </Typography>
                      </Link>
                    </Box>
                  )}
                  {user.companyAddress && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Location sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography>{user.companyAddress}</Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <WalletCard user={user} />

          <TransactionCard />
        </Grid>
      </Container>
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
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InfluencerDetails;
