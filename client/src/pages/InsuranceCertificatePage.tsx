import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiService } from "../services/api";
import type { InsuranceCertificate } from "../types/insurance-certificate.types";
import {
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

export function InsuranceCertificatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [insuranceCertificates, setInsuranceCertificates] = useState<
    InsuranceCertificate[]
  >([]);

  useEffect(() => {
    loadInsuranceCertificates();
    // Refresh when navigating back from create page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const loadInsuranceCertificates = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiService.getInsuranceCertificates();
      setInsuranceCertificates(data);
    } catch (err) {
      // If endpoint doesn't exist yet, show empty state
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
        setInsuranceCertificates([]);
      } else {
        setError(
          "Failed to load insurance certificates. Please try again later."
        );
        console.error("Error loading insurance certificates:", err);
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

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Certificates of Insurance
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            View and manage certificates of insurance
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/insuranceCertificates/create")}
        >
          Create Certificate
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        {insuranceCertificates.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Certificates Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Insurance certificate viewing functionality will be available once
              the backend endpoint is implemented.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Certificate Number</TableCell>
                  <TableCell>Insured Party</TableCell>
                  <TableCell>Insurance Company</TableCell>
                  <TableCell>Effective Date</TableCell>
                  <TableCell>Expiration Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {insuranceCertificates.map((certificate) => (
                  <TableRow key={certificate.id}>
                    <TableCell>{certificate.certificateNumber}</TableCell>
                    <TableCell>{certificate.insuredParty}</TableCell>
                    <TableCell>{certificate.insuranceCompany}</TableCell>
                    <TableCell>
                      {formatDate(certificate.effectiveDate)}
                    </TableCell>
                    <TableCell>
                      {formatDate(certificate.expirationDate)}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={
                          certificate.status === "active"
                            ? "success.main"
                            : certificate.status === "expired"
                            ? "error.main"
                            : "text.secondary"
                        }
                      >
                        {certificate.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          navigate(`/insuranceCertificates/${certificate.id}`)
                        }
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
