## Summary

Authentication Architecture Summary

### Key Design Decisions:

- localStorage over httpOnly cookies - Better UX and simpler MVP implementation **(Will be revisited in the future)**
- Role entities - Easier to extend and query on the BE
- No business context in JWT - Multi-tenancy support, business ID from request
- Proactive token refresh from the client side
- Zod for validation - Runtime safety and TypeScript integration - **TODO: (Need to add Zod support on BE)**
- React Query for state on FE

### Security Considerations:

**Access and Refresh JWT Pattern for auth**

- Short-lived access tokens (15 min)
- Refresh token rotation on each refresh
- Hashed refresh tokens in database
- Role validation on both frontend and backend
- Business access validation server-side

### Backend (NestJS) Requirements:

#### 1. Database Structure:

- User entity with role entities **(AdminRole, OwnerRole, StaffRole)**
- Multi-tenancy: Owners can have multiple businesses
- Staff can be assigned to multiple restaurants/businesses
- Role-based relationships through separate role entities

#### 2. JWT Strategy:

- Access tokens: 15 minutes, contain userId, email, roles[]
- Refresh tokens: 7 days, stored hashed in database
- NO business context in JWT - comes from request parameters
- Tokens returned as JSON (not httpOnly cookies for MVP)

#### 3. Auth Endpoints:

```
POST /auth/login -> { access_token, refresh_token, user }
POST /auth/refresh -> { access_token, refresh_token }
POST /auth/logout -> clears refresh token in DB
GET /auth/me -> returns current user with roles
```

#### 4. Authorization Guards:

- [RolesGuard](../src/auth/guards/roles.guard.ts): Checks if user has required role(s)
- [BusinessAccessGuard](../src/auth/guards/business-access.guard.ts.guard.ts): - Validates user can access specific business
- Business ID comes from route params/body, not JWT

#### 5. Role Management:

<p>Users typically have ONE primary role (admin, owner, staff)
Role entities handle business relationships:</p>

- OwnerRole → businesses (one-to-many)
- StaffRole → restaurants (many-to-many)
- AdminRole → no specific business relationships

### Frontend (Next.js + React Query) Requirements:

#### 1. Token Storage Strategy:

- localStorage for access/refresh tokens (MVP approach)
- JWT decoding for immediate role access
- Proactive token refresh (before expiration)

#### 2. State Management:

- TanStack React Query for API state
- Zod schemas for runtime validation and TypeScript types
- Auth context wrapping React Query hooks

#### 3. Token Management:

- Automatic refresh when tokens expire soon (2-minute buffer)
- Request queuing during refresh operations
- Automatic logout on refresh failure
- Token expiration monitoring

#### 4. Auth Flows:

- Login Flow (sign-in page):

```
1. User submits credentials (validated with Zod) on sign-in page
2. API call to /auth/login
3. Store tokens in localStorage
4. Decode JWT for immediate role access
5. Cache user data in React Query
6. Redirect to dashboard
```

- Authenticated Request Flow:

```
1. Check if access token expires soon
2. If yes, refresh proactively
3. Add Bearer token to request
4. Handle 401 as fallback (redirect to login)
```

- Role-based Protection:

```
1. ProtectedRoute component checks roles from JWT
2. Immediate role checking (no API calls needed)
3. hasRole() helper for conditional UI rendering
4. Business access checked via API when needed
```

- Logout Flow:

```
1. API call to /auth/logout (clears refresh token)
2. Clear localStorage
3. Clear React Query cache
4. Redirect to login
```

#### 5. Component Architecture:

- AuthProvider wrapping app with React Query
- ProtectedRoute for route-level protection
- useAuth() hook for auth state and actions
- hasRole() helper for role-based UI
