import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiService } from "../services/api";
import type { InsuranceCertificate } from "../types/insurance-certificate.types";
import {
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Button,
  Grid,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

export function ViewInsuranceCertificatePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [certificate, setCertificate] = useState<InsuranceCertificate | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadCertificate(id);
    } else {
      setError("Certificate ID is missing");
      setLoading(false);
    }
  }, [id]);

  const loadCertificate = async (certificateId: string) => {
    try {
      setLoading(true);
      setError("");
      const data = await apiService.getInsuranceCertificateById(certificateId);
      setCertificate(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
        setError("Certificate not found");
      } else {
        setError("Failed to load certificate. Please try again later.");
        console.error("Error loading certificate:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "expired":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;

    try {
      setDeleting(true);
      await apiService.deleteInsuranceCertificate(id);
      // Redirect to certificates page after successful deletion
      navigate("/insuranceCertificates");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(
        errorMessage || "Failed to delete certificate. Please try again."
      );
      console.error("Error deleting certificate:", err);
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !certificate) {
    return (
      <Box>
        <Button
          onClick={() => navigate("/insuranceCertificates")}
          sx={{ mb: 2 }}
        >
          ← Back to Certificates
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!certificate) {
    return null;
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button onClick={() => navigate("/insuranceCertificates")}>
          ← Back to Certificates
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteClick}
          disabled={deleting}
        >
          Delete Certificate
        </Button>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom>
        Certificate of Insurance
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        View detailed information about this insurance certificate
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" component="h2">
                Certificate Details
              </Typography>
              <Chip
                label={certificate.status.toUpperCase()}
                color={getStatusColor(certificate.status) as any}
                size="medium"
              />
            </Box>
            <Divider sx={{ mt: 2, mb: 3 }} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Certificate Number
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {certificate.certificateNumber}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Status
            </Typography>
            <Chip
              label={certificate.status}
              color={getStatusColor(certificate.status) as any}
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Insured Party
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {certificate.insuredParty}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Insurance Company
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {certificate.insuranceCompany}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Effective Date
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {formatDate(certificate.effectiveDate)}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Expiration Date
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {formatDate(certificate.expirationDate)}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Created At
            </Typography>
            <Typography variant="body2">
              {formatDate(certificate.createdAt)}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Last Updated
            </Typography>
            <Typography variant="body2">
              {formatDate(certificate.updatedAt)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Certificate?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this certificate? This action cannot
            be undone. The certificate will be removed from your list.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
