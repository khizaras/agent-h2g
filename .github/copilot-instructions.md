# Hands2gether AI Coding Agent Instructions

## Project Overview

Hands2gether is a monorepo for a community-driven food assistance platform. It connects people in need with contributors, featuring cause creation, user profiles, notifications, admin tools, and an AI-powered chatbot. The stack includes React.js (Ant Design, Redux Toolkit), Node.js/Express, MySQL, and OpenRouter.ai for AI.

## Architecture & Key Patterns

- **Monorepo Structure**: Shared `node_modules` and root `package.json` for both frontend and backend. See `README.md` for directory layout.
- **Frontend**: React with Redux Toolkit, Ant Design UI, React Router. Components in `frontend/src/components`, pages in `frontend/src/pages`, state in `frontend/src/redux`.
- **Backend**: Express.js REST API, controllers in `backend/controllers`, models in `backend/models`, routes in `backend/routes`. Auth via JWT/Google OAuth. Image uploads use Multer & ImageKit.
- **Chatbot**: AI assistant (see `docs/chatbot-feature.md` and `backend/controllers/chatbotController.js`) uses RAG (Retrieval Augmented Generation) with causes data sent to OpenRouter LLM. Only authenticated users can access chatbot features.
- **Notifications**: Managed via backend controllers/routes, with push/email support. See `backend/controllers/notificationController.js` and `backend/routes/notificationRoutes.js`.

## Developer Workflows

- **Install & Setup**: `npm install` at root. Configure `.env` (see `.env.example`).
- **Database**: MySQL. Create DB, then seed with `npm run seed`.
- **Run Dev Servers**: `npm run dev` (starts both frontend and backend).
- **Testing**:
  - All tests: `npm test`
  - Backend only: `cd backend && npm test`
  - Frontend only: `cd frontend && npm test`
  - E2E: `cd frontend && npm run test:e2e`
- **Build & Deploy**: `npm run build` then `npm start` for production.
- **Branching**: Gitflow-inspired (`main`, `develop`, `feature/*`, `bugfix/*`, etc.).
- **Commits**: Use conventional prefixes (`feat:`, `fix:`, etc.).

## Project-Specific Conventions

- **React**: Use functional components and hooks. Prefer Redux Toolkit for state. Use PropTypes for validation. Ant Design for UI.
- **Backend**: RESTful routes, async/await, JSDoc for API docs. Error handling via middleware.
- **Styling**: BEM naming, SCSS/CSS modules, consistent color/spacing. See `frontend/src/index.css` and component styles.
- **Testing**: Jest/React Testing Library for frontend, Mocha/Chai for backend. See `frontend/src/__tests__` and `backend/__tests__`.
- **Chatbot**: Format responses in Markdown, follow system prompt rules in `chatbotController.js`.

## Integration Points

- **ImageKit**: Cloud image storage. See `docs/imagekit-integration.md`.
- **OpenRouter.ai**: AI assistant API. Requires `OPENROUTER_API_KEY` in `.env`.
- **Notifications**: Email via Nodemailer, push via backend controllers.

## Examples

- **Protected Route**: See `frontend/src/components/auth/PrivateRoute.js` and its test for auth patterns.
- **Chatbot**: See `frontend/src/components/chatbot/Chatbot.js` and `backend/controllers/chatbotController.js` for RAG and LLM integration.
- **Cause Creation**: See `frontend/src/pages/causes/EditCausePage.js` for form validation and UI conventions.

## References

- [README.md](../README.md)
- [docs/developer-guide.md](../docs/developer-guide.md)
- [docs/chatbot-feature.md](../docs/chatbot-feature.md)
- [docs/api.md](../docs/api.md)

---

**Feedback:** If any section is unclear or missing, please specify so it can be improved for future AI agents.
