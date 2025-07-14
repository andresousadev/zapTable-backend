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
