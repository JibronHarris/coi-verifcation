import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  Checkbox,
  FormControlLabel,
  Container,
} from "@mui/material";

export function PublicCertificatePage() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [certificate, setCertificate] = useState<InsuranceCertificate | null>(
    null
  );
  const [confirmed, setConfirmed] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (token) {
      loadCertificate(token);
    } else {
      setError("Certificate token is missing");
      setLoading(false);
    }
  }, [token]);

  const loadCertificate = async (certificateToken: string) => {
    try {
      setLoading(true);
      setError("");
      const data = await apiService.getPublicCertificateByToken(
        certificateToken
      );
      setCertificate(data);
      // Check if already accepted
      if (data.status === "accepted") {
        setAccepted(true);
      }
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
      case "accepted":
        return "info";
      default:
        return "default";
    }
  };

  const handleAccept = async () => {
    if (!token || !confirmed) return;

    try {
      setAccepting(true);
      setError("");
      const updatedCertificate =
        await apiService.acceptPublicCertificateByToken(token);
      setCertificate(updatedCertificate);
      setAccepted(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(
        errorMessage || "Failed to accept certificate. Please try again."
      );
      console.error("Error accepting certificate:", err);
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && !certificate) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  if (!certificate) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Certificate of Insurance
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Public view - Certificate verification
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {accepted && (
          <Alert severity="success" sx={{ mb: 3 }}>
            This certificate has been accepted and verified.
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
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Certificate Number
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {certificate.certificateNumber}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Status
              </Typography>
              <Chip
                label={certificate.status}
                color={getStatusColor(certificate.status) as any}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Insured Party
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {certificate.insuredParty}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Insurance Company
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {certificate.insuranceCompany}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Effective Date
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatDate(certificate.effectiveDate)}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Expiration Date
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatDate(certificate.expirationDate)}
              </Typography>
            </Grid>

            {(certificate.acceptedAt || certificate.viewedAt) && (
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  {certificate.acceptedAt ? "Accepted" : "Link Accessed"}
                </Typography>
                <Typography variant="body2">
                  {formatDate(
                    certificate.acceptedAt || certificate.viewedAt || ""
                  )}
                </Typography>
              </Grid>
            )}

            {!accepted && (
              <>
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 3 }} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "background.default",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={confirmed}
                          onChange={(e) => setConfirmed(e.target.checked)}
                          disabled={accepting}
                        />
                      }
                      label="I confirm that I have reviewed and verified this certificate of insurance"
                    />
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAccept}
                        disabled={!confirmed || accepting}
                        fullWidth
                      >
                        {accepting ? "Confirming..." : "Confirm Acceptance"}
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}
