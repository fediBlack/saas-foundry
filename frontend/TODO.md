# 📋 Frontend - TODO List

## Phase 1: Architecture Refactoring 🔴 CRITIQUE

### Utilities & Config
- [ ] `src/utils/api.ts` - Axios configuration centralisée avec interceptors
  - [ ] Set baseURL from env
  - [ ] Add auth headers automatically
  - [ ] Handle 401 errors (logout redirect)
  - [ ] Log requests/responses in dev
  
### Composables
- [ ] `src/composables/useApi.ts` - Wrapper autour de axios
  - [ ] GET/POST/PUT/DELETE methods
  - [ ] Error handling
  - [ ] Loading state
  
- [ ] `src/composables/useTasks.ts` - Task logic
  - [ ] fetchTasks()
  - [ ] addTask(title, description)
  - [ ] deleteTask(id)
  - [ ] toggleTask(id)
  - [ ] Loading and error handling

### Stores
- [ ] `src/stores/task.ts` - Pinia store for tasks
  - [ ] State: tasks[], loading, error
  - [ ] Actions: fetch, add, delete, toggle
  - [ ] Getters: taskCount, completedCount
  - [ ] Persistence (localStorage)

### Types
- [ ] `src/types/index.ts` - Export all types
- [ ] `src/types/auth.ts` - User, AuthState, AuthError
- [ ] `src/types/task.ts` - Task, TaskState, TaskError  
- [ ] `src/types/api.ts` - ApiError, ApiResponse<T>, ValidationError

### Refactor Existing
- [ ] Update `stores/auth.ts` - Use new error handling
- [ ] Refactor `main.ts` - Import api config
- [ ] Update `router/index.ts` - Clean up if needed
- [ ] Remove duplicate code from all views

---

## Phase 2: Components Creation 🟡 IMPORTANT

### Layout Components
- [ ] `src/layouts/AppLayout.vue` - Main app layout
  - [ ] Navbar with user info
  - [ ] Logout button
  - [ ] Router outlet
  - [ ] Mobile-responsive

- [ ] `src/layouts/AuthLayout.vue` - Auth pages layout
  - [ ] Simple centered layout
  - [ ] Background styling

### Reusable Components
- [ ] `src/components/TaskForm.vue` - Create/Edit task form
  - [ ] Title input
  - [ ] Description textarea
  - [ ] Submit button
  - [ ] Loading state
  - [ ] Error display

- [ ] `src/components/TaskList.vue` - List of tasks
  - [ ] Display tasks
  - [ ] Delete button
  - [ ] Toggle done button
  - [ ] Empty state
  - [ ] Loading state

- [ ] `src/components/TaskItem.vue` - Single task item
  - [ ] Title + description
  - [ ] Completed state styling
  - [ ] Action buttons

- [ ] `src/components/ErrorDisplay.vue` - Error message display
  - [ ] Support for string errors
  - [ ] Support for validation errors (array)
  - [ ] Dismissible
  - [ ] Color coding by type

- [ ] `src/components/LoadingSpinner.vue` - Loading indicator
  - [ ] Animated spinner
  - [ ] Message support
  - [ ] Overlay option

- [ ] `src/components/Header.vue` - Navigation header
  - [ ] Logo/title
  - [ ] User info
  - [ ] Logout button
  - [ ] Mobile menu toggle

### Refactor Views
- [ ] `src/views/LoginView.vue` - Simplify using ErrorDisplay
- [ ] `src/views/RegisterView.vue` - Simplify using ErrorDisplay
- [ ] `src/views/DashboardView.vue` - Refactor:
  - [ ] Use useTasks composable
  - [ ] Use TaskForm component
  - [ ] Use TaskList component
  - [ ] Use AppLayout
  - [ ] Use ErrorDisplay
  - [ ] Reduce from 175 to ~40 lines

---

## Phase 3: Validation & UX 🟡 IMPORTANT

### Client-Side Validation
- [ ] Install `zod` package
- [ ] Create `schemas/auth.ts` - Login/Register schemas
- [ ] Create `schemas/task.ts` - Task schemas
- [ ] Add real-time validation to forms
- [ ] Show field-specific errors

### Error Handling Enhancement
- [ ] Parse backend `details` array for validation errors
- [ ] Display field-level error messages
- [ ] Distinguish user vs server errors
- [ ] Add retry mechanism for failed requests

### Environment Management
- [ ] Create `.env.local` template
  - [ ] VITE_API_URL=http://localhost:5000/api
  - [ ] VITE_API_TIMEOUT=10000
- [ ] Update `api.ts` to use env variables
- [ ] Create `.env.production` for build

### Responsive Design
- [ ] Test on mobile (360px, 480px, 768px)
- [ ] Create responsive navbar (hamburger menu)
- [ ] Adapt card layouts for mobile
- [ ] Test touch interactions
- [ ] Optimize font sizes for mobile

---

## Phase 4: Testing 🟢 CAN WAIT

### Setup
- [ ] Install `vitest` + `@vue/test-utils`
- [ ] Create `vitest.config.ts`
- [ ] Add `test` script to package.json

### Store Tests
- [ ] `stores/__tests__/auth.test.ts` - Auth store tests
- [ ] `stores/__tests__/task.test.ts` - Task store tests

### Composable Tests
- [ ] `composables/__tests__/useApi.test.ts`
- [ ] `composables/__tests__/useTasks.test.ts`

### Component Tests
- [ ] `components/__tests__/TaskForm.test.ts`
- [ ] `components/__tests__/TaskList.test.ts`
- [ ] `components/__tests__/ErrorDisplay.test.ts`

---

## Optional Improvements 🟢 NICE TO HAVE

- [ ] Dark mode toggle
- [ ] Animations with framer-motion or transitions
- [ ] Keyboard shortcuts
- [ ] Auto-save drafts
- [ ] Task categories/tags
- [ ] Search/filter tasks
- [ ] Sorting options
- [ ] Task priorities
- [ ] Due dates
- [ ] Notifications

---

## File Structure After Improvements

```
src/
├── composables/
│   ├── __tests__/
│   ├── useApi.ts          ← NEW
│   └── useTasks.ts        ← NEW
├── components/
│   ├── __tests__/
│   ├── ErrorDisplay.vue   ← NEW
│   ├── Header.vue         ← NEW
│   ├── LoadingSpinner.vue ← NEW
│   ├── TaskForm.vue       ← NEW
│   ├── TaskItem.vue       ← NEW
│   ├── TaskList.vue       ← NEW
│   └── HelloWorld.vue     (to remove)
├── layouts/               ← NEW
│   ├── AppLayout.vue
│   └── AuthLayout.vue
├── stores/
│   ├── __tests__/
│   ├── auth.ts            (improved)
│   └── task.ts            ← NEW
├── types/                 ← NEW
│   ├── api.ts
│   ├── auth.ts
│   ├── task.ts
│   └── index.ts
├── utils/                 ← NEW
│   ├── api.ts
│   └── constants.ts
├── views/
│   ├── DashboardView.vue  (simplified)
│   ├── LoginView.vue      (simplified)
│   └── RegisterView.vue   (simplified)
├── router/
│   └── index.ts           (unchanged)
├── App.vue
├── main.ts
└── style.css
```

---

## Estimated Time

- Phase 1 (Refactoring): 2 hours
- Phase 2 (Components): 2 hours
- Phase 3 (Validation): 1-2 hours
- Phase 4 (Tests): 2 hours
- **Total: 7-9 hours** for production-ready frontend

---

## Commit Strategy

Each phase should be a single commit:

```
feat: create axios utilities and composables (Phase 1)
feat: create reusable components (Phase 2)
feat: add client-side validation and responsive design (Phase 3)
test: add frontend unit tests (Phase 4)
```

---

## Quality Metrics After Improvements

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Components | 0 composants | 6+ | ✅ |
| Max file size | 175 lines | <50 lines | ✅ |
| Code reuse | Low | High | ✅ |
| Test coverage | 0% | ~60% | ✅ |
| Types | Basic | Full | ✅ |
| Error handling | Basic | Advanced | ✅ |
| Mobile ready | No | Yes | ✅ |

---

**Status**: Ready to implement Phase 1
**Recommended start**: NOW before new features!
