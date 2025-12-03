import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import type { COI } from "../types/coi.types";
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

export function COIPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cois, setCois] = useState<COI[]>([]);

  useEffect(() => {
    loadCOIs();
  }, []);

  const loadCOIs = async () => {
    try {
      setLoading(true);
      setError("");
      // This endpoint will be implemented in the backend
      const data = await apiService.getCOIs();
      setCois(data);
    } catch (err) {
      // If endpoint doesn't exist yet, show empty state
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
        setCois([]);
      } else {
        setError("Failed to load COIs. Please try again later.");
        console.error("Error loading COIs:", err);
      }
    } finally {
      setLoading(false);
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
      <Typography variant="h4" component="h1" gutterBottom>
        Certificates of Insurance
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        View and manage certificates of insurance
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        {cois.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Certificates Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              COI viewing functionality will be available once the backend
              endpoint is implemented.
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
                {cois.map((coi) => (
                  <TableRow key={coi.id}>
                    <TableCell>{coi.certificateNumber}</TableCell>
                    <TableCell>{coi.insuredParty}</TableCell>
                    <TableCell>{coi.insuranceCompany}</TableCell>
                    <TableCell>{coi.effectiveDate}</TableCell>
                    <TableCell>{coi.expirationDate}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={
                          coi.status === "active"
                            ? "success.main"
                            : coi.status === "expired"
                            ? "error.main"
                            : "text.secondary"
                        }
                      >
                        {coi.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">
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
