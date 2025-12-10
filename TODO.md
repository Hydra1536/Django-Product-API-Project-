# Admin Dashboard Expansion Plan

## Backend Changes
- [x] Add User model in products/models.py
- [x] Add Analytics model in products/models.py
- [x] Add Settings model in products/models.py
- [x] Add UserSerializer, AnalyticsSerializer, SettingsSerializer in products/serializers.py
- [x] Add UserViewSet, AnalyticsViewSet, SettingsViewSet in products/views.py
- [x] Update product_api/urls.py to include new viewsets
- [x] Update product_api/settings.py for static files to serve React build
- [x] Create product_api/views.py with index view for serving React app
- [x] Update product_api/urls.py to include index view

## Frontend Changes
- [x] Create src/pages/Login.tsx component
- [x] Create src/pages/Dashboard.tsx component
- [x] Create src/pages/UserManagement.tsx component
- [x] Create src/pages/Analytics.tsx component
- [x] Create src/pages/Settings.tsx component
- [x] Create src/api/userApi.ts
- [x] Create src/api/analyticsApi.ts
- [x] Create src/api/settingsApi.ts
- [x] Update src/App.tsx with new routes and navigation

## Followup Steps
- [ ] Run Django migrations for new models
- [ ] Build React app
- [ ] Test the full application flow
