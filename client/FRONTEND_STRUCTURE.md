# Frontend Application Structure

This document outlines the organization of the COI Verification frontend application.

## Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with navigation bar
│   └── ProtectedRoute.jsx  # Route guard for authenticated routes
├── contexts/           # React Context providers
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page-level components (routes)
│   ├── LoginPage.jsx   # Login/Register page
│   ├── ProfilePage.jsx # User profile management
│   └── COIPage.jsx     # Certificates of Insurance viewing page
├── services/           # API and external service integrations
│   └── api.js         # Centralized API service layer
├── theme/              # Material-UI theme configuration
│   └── theme.js        # Theme configuration (colors, typography, etc.)
├── utils/              # Utility functions (create as needed)
├── App.jsx             # Main app component with routing and ThemeProvider
└── main.jsx            # Application entry point
```

## Architecture Overview

### 1. **Pages** (`/pages`)

Page-level components represent full routes in the application. Each page is a self-contained component that handles its own state and data fetching.

- **LoginPage**: Handles user authentication (login/register)
- **ProfilePage**: User profile viewing and editing
- **COIPage**: Certificates of Insurance viewing and management (from real estate agent perspective)

### 2. **Components** (`/components`)

Reusable UI components that can be used across multiple pages.

- **Layout**: Provides consistent navigation and page structure for authenticated routes
- **ProtectedRoute**: Route guard that ensures only authenticated users can access protected pages

### 3. **Contexts** (`/contexts`)

React Context providers for global state management.

- **AuthContext**: Manages authentication state, user session, and auth-related methods (signIn, signOut, register)

### 4. **Services** (`/services`)

Centralized service layer for API calls and external integrations.

- **api.js**: Single source of truth for all backend API calls. All HTTP requests go through this service.

### 5. **Theme** (`/theme`)

Material-UI theme configuration for consistent styling across the application.

- **theme.js**: Centralized theme configuration including colors, typography, spacing, and component overrides

### 6. **Routing**

The app uses React Router for navigation:

- `/login` - Login/Register page (public)
- `/insuranceCertificates` - Insurance Certificate viewing page (protected)
- `/profile` - User profile page (protected)
- `/` - Redirects to `/insuranceCertificates`

## Styling with Material-UI

### Overview

This application uses **Material-UI's ThemeProvider** for all styling. All CSS files have been removed in favor of Material-UI's theming system.

### What Changed

We've simplified the styling architecture by:

- ✅ **Removed all CSS files** - No more separate CSS files for components or pages
- ✅ **Added ThemeProvider** - Centralized theme configuration in `/src/theme/theme.js`
- ✅ **Added CssBaseline** - Provides CSS reset and normalization
- ✅ **Unified styling approach** - All styling now uses Material-UI's `sx` prop and theme system

This results in a cleaner, more maintainable codebase with better consistency and performance.

### Theme Configuration

The theme is configured in `/src/theme/theme.js` and includes:

- **Color Palette**: Primary, secondary, error, warning, success colors
- **Typography**: Font family and heading styles
- **Spacing**: Material-UI's 8px spacing unit
- **Shape**: Border radius defaults
- **Component Overrides**: Custom styling for specific components

### ThemeProvider Setup

The app is wrapped with `ThemeProvider` in `App.jsx`:

```jsx
<ThemeProvider theme={theme}>
  <CssBaseline />
  {/* rest of app */}
</ThemeProvider>
```

The `CssBaseline` component provides:

- CSS reset/normalization
- Consistent default styling across browsers
- Material-UI's base styles

### Using the Theme

#### In Components

Access theme values using the `sx` prop or `useTheme` hook:

```jsx
import { useTheme } from "@mui/material/styles";
import { Box, Button } from "@mui/material";

// Using sx prop (recommended)
<Box sx={{ color: "primary.main", padding: 2 }}>Content</Box>;

// Using theme hook
const theme = useTheme();
<Box sx={{ color: theme.palette.primary.main }}>Content</Box>;
```

#### Theme Values Available

- `theme.palette.primary` - Primary color (blue)
- `theme.palette.secondary` - Secondary color (pink)
- `theme.palette.error` - Error color (red)
- `theme.palette.warning` - Warning color (orange)
- `theme.palette.success` - Success color (green)
- `theme.spacing()` - Spacing function (8px multiplier)
- `theme.typography` - Typography variants

#### Styling Examples

```jsx
// Using spacing
<Box sx={{ p: 2 }}> // 16px padding (2 * 8px)
<Box sx={{ mt: 4 }}> // 32px margin-top

// Using colors
<Button color="primary">Button</Button>
<Typography color="error">Error text</Typography>

// Using typography
<Typography variant="h4">Heading</Typography>
```

### Customizing the Theme

Edit `/src/theme/theme.js` to customize:

- Colors: Modify the `palette` object
- Typography: Adjust `typography` settings
- Component styles: Update `components` overrides
- Spacing: Change the `spacing` multiplier

### Adding Custom Styles

If you need custom styles not covered by Material-UI:

1. Use the `sx` prop for one-off styles
2. Use `styled` components for reusable styled components
3. Override component styles in the theme configuration

Example with styled components:

```jsx
import { styled } from "@mui/material/styles";

const CustomBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
}));
```

### Benefits of Material-UI Theming

1. **No CSS files needed**: All styling handled by Material-UI
2. **Type-safe**: Theme values are typed in TypeScript
3. **Consistent**: Centralized theme ensures design consistency
4. **Maintainable**: Easy to update colors/spacing globally
5. **Performance**: Material-UI optimizes CSS generation

## Best Practices

### 1. Separation of Concerns

- Pages handle page-level logic and layout
- Components are reusable and focused on UI
- Services handle all external communication
- Contexts manage global state

### 2. Authentication Flow

- AuthContext wraps the entire app and provides auth state
- ProtectedRoute component guards routes that require authentication
- All protected routes automatically redirect to `/login` if not authenticated

### 3. API Calls

- All API calls go through the `apiService` in `/services/api.js`
- This centralizes error handling and request configuration
- Makes it easy to add interceptors, authentication headers, etc.

### 4. Styling

- Use Material-UI components and the `sx` prop for styling
- Access theme values through the theme or `sx` prop
- Keep styling consistent by using theme values
- Avoid inline styles - use `sx` prop instead

## Adding New Features

### Adding New Pages

1. Create the page component in `/pages`
2. Add the route in `App.jsx`
3. Wrap with `ProtectedRoute` if authentication is required
4. Add navigation link in `Layout.jsx` if needed
5. Style using Material-UI components and `sx` prop

### Adding New Components

1. Create component in `/components`
2. Use Material-UI components and the `sx` prop for styling
3. Import and use in pages or other components
4. Use theme values for consistent styling

### Adding New Services

1. Add new methods to `/services/api.js` or create a new service file
2. Follow the existing pattern for API calls
3. Handle errors consistently
4. Use TypeScript types if migrating to TypeScript

## Next Steps

When implementing COI functionality:

1. Add COI-related endpoints to `/services/api.js`
2. Update `/pages/COIPage.jsx` to fetch and display real COI data
3. Create reusable COI components if needed (e.g., COICard, COIForm)
4. Add filtering, sorting, and search functionality as needed
5. Use Material-UI components for consistent UI/UX
