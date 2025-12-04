import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import type { CreateInsuranceCertificateDto } from "../types/insurance-certificate.types";
import {
  Paper,
  Typography,
  Box,
  Alert,
  TextField,
  Button,
  Grid,
} from "@mui/material";

export function CreateInsuranceCertificatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CreateInsuranceCertificateDto>({
    certificateNumber: "",
    insuredParty: "",
    insuranceCompany: "",
    effectiveDate: "",
    expirationDate: "",
  });

  const handleChange =
    (field: keyof CreateInsuranceCertificateDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      // Clear error when user starts typing
      if (error) setError("");
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiService.createInsuranceCertificate(formData);
      // Redirect to certificates page after successful creation
      navigate("/insuranceCertificates");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(
        errorMessage || "Failed to create certificate. Please try again."
      );
      console.error("Error creating certificate:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/insuranceCertificates");
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Create Certificate of Insurance
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Fill out the form below to create a new insurance certificate
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Certificate Number"
                value={formData.certificateNumber}
                onChange={handleChange("certificateNumber")}
                required
                disabled={loading}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Insured Party"
                value={formData.insuredParty}
                onChange={handleChange("insuredParty")}
                required
                disabled={loading}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Insurance Company"
                value={formData.insuranceCompany}
                onChange={handleChange("insuranceCompany")}
                required
                disabled={loading}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Effective Date & Time"
                type="datetime-local"
                value={formData.effectiveDate}
                onChange={handleChange("effectiveDate")}
                required
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Expiration Date & Time"
                type="datetime-local"
                value={formData.expirationDate}
                onChange={handleChange("expirationDate")}
                required
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? "Creating..." : "Create Certificate"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
