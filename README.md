*Architecture

**Frontend approaches (Express HTML, JavaScript, SPA/Angular).
In the customer-facing site, Express rendered server-side HTML templates (SSR). This approach is simple and fast to first paint, but each navigation triggers a full page load and the UI logic lives largely on the server. I also used plain JavaScript to progressively enhance those pages—DOM manipulation, small fetch calls, and form validation—keeping the pages lightweight while avoiding a build step. For administrator tooling, I built a single-page application (Angular). The SPA ships once, then uses client-side routing and state to deliver a desktop-like experience: faster in-app navigation, two-way data binding in forms, optimistic updates, and component-level reuse. The trade-off is added complexity (routing, state, testing) and a build pipeline, but SPA was the right fit for admin workflows that require rich interactivity, filtered lists, and inline editing.

**Why NoSQL MongoDB on the backend.
MongoDB stores data as BSON documents that map naturally to JSON used across the stack, which simplifies serialization between API and UI. The travel domain (trips, bookings, itineraries) benefits from schema flexibility—fields can evolve (e.g., adding amenities or seasonal pricing) without costly migrations. Horizontal scaling and built-in sharding fit read-heavy catalogs, and Mongoose gives validation/hooks where I need stronger guarantees. Finally, its aggregation pipeline makes common reporting (counts, groupings, date filters) straightforward.

*Functionality

**JSON vs. JavaScript and how JSON ties front and back together.
JavaScript is a programming language; JSON is a lightweight data format (text) for representing objects/arrays with strings, numbers, booleans, null. The API sends and receives JSON bodies (application/json). On the server, Node/Express parses JSON and maps it to Mongoose models; on the client, Angular’s HttpClient returns typed objects used to populate components and forms. That shared, language-agnostic format is the “glue” allowing the SPA, the vanilla JS pages, and the Express API to interoperate cleanly.

**Refactoring for functionality/efficiency + benefits of reusable UI components.
I refactored by:

***Separating concerns
moved from reading static JSON files in Express views to dedicated REST endpoints (/api/trips, /api/trips/:code) with controllers/services; the views then consume the API instead of filesystem reads. Result: cleaner layering and easier testing.

***Extracting Angular services
consolidated HTTP calls in a TripService so components are dumb/presentational. Result: fewer duplicates, easier mocking in tests.

***Component reuse
factored listing rows/cards into a TripCard/TripList and made a shared TripForm used for create/edit. Result: consistent UI/UX, less code to maintain, faster feature work.

***Centralized utilities
date/price pipes and a small validator library avoided repeating formatting and rules. Result: fewer bugs and simpler changes.

Reusable components improve consistency, maintainability, and performance (one optimized component used many times), and they unlock faster delivery because new pages compose existing building blocks.

*Testing

**Methods, endpoints, and security—how they affect testing.

***Methods & endpoints
A REST API differentiates intent by method—GET /api/trips (read), GET /api/trips/:code (detail), POST /api/trips (create), PUT /api/trips/:code (update), DELETE /api/trips/:code (remove). Each requires tests for success paths (200/201) and failure modes (400 validation, 401/403 authZ, 404 not found, 409 duplicates, 500 server).

***Request/response validation
test that the server rejects malformed JSON, enforces schemas (e.g., dates, required fields), and returns predictable error shapes the frontend can handle.

***Security layers
With JWT auth, I verify (1) no token → 401, (2) expired/invalid token → 401, (3) valid token without role → 403, and (4) valid token with role → allowed. I also test CSRF posture for state-changing calls in SSR contexts, CORS for SPA origins, and rate-limit paths where applicable.

***Frontend tests
Angular service tests use HttpClientTestingModule to mock endpoints and assert correct serialization and error handling. Component tests check that forms validate before submit and that guards redirect unauthenticated users.

***Integration smoke tests
Minimal end-to-end flows—login → create trip → edit → delete—ensure wiring across DB, API, and UI works with realistic data.

*Reflection

This course moved me from assembling pages to engineering a layered system: modeling data with Mongoose, designing RESTful APIs, and building a component-based SPA coupled to those APIs. I strengthened skills in TypeScript/Angular, Node/Express, MongoDB schema design, authentication/authorization with JWT, and testable architectures (services, controllers, and presentational components). On the professional side, I’m now more marketable because I can deliver a full vertical slice—database model → secure endpoints → accessible, responsive UI—documented with diagrams and an SDD, versioned with Git/GitHub, and backed by tests. Perhaps most importantly, I developed habits of refactoring for reuse, writing clear API contracts, and treating security and testing as first-class requirements, which are exactly what teams look for in a full-stack developer.
