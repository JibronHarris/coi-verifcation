import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

interface FormData {
  name: string;
  email: string;
}

export function ProfilePage() {
  const { user, checkSession } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await apiService.getCurrentUser();
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
      });
    } catch (err) {
      setError("Failed to load profile");
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await apiService.updateUser(user.id, {
        name: formData.name,
      });
      setSuccess("Profile updated successfully!");
      // Update auth context
      await checkSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
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
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage your account information
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          value={formData.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, name: e.target.value })
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          value={formData.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, email: e.target.value })
          }
          margin="normal"
          disabled
          helperText="Email cannot be changed"
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            sx={{ mr: 2 }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="outlined"
            onClick={loadUserProfile}
            disabled={saving}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
