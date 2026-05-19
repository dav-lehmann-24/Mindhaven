# Test Plan - Mindhaven

## Table of Contents

- [1. Introduction](#1-introduction)
  - [1.1 Purpose](#11-purpose)
  - [1.2 Scope](#12-scope)
  - [1.3 Intended Audience](#13-intended-audience)
  - [1.4 Document Terminology and Acronyms](#14-document-terminology-and-acronyms)
  - [1.5 References](#15-references)
  - [1.6 Document Structure](#16-document-structure)
- [2. Evaluation Mission and Test Motivation](#2-evaluation-mission-and-test-motivation)
  - [2.1 Background](#21-background)
  - [2.2 Evaluation Mission](#22-evaluation-mission)
  - [2.3 Test Motivators](#23-test-motivators)
- [3. Target Test Items](#3-target-test-items)
- [4. Outline of Planned Tests](#4-outline-of-planned-tests)
  - [4.1 Outline of Test Inclusions](#41-outline-of-test-inclusions)
  - [4.2 Potential Future Tests](#42-potential-future-tests)
  - [4.3 Exclusions](#43-exclusions)
- [5. Test Approach](#5-test-approach)
  - [5.1 Tools Used](#51-tools-used)
  - [5.2 Testing Techniques and Types](#52-testing-techniques-and-types)
    - [5.2.1 Functional Testing](#521-functional-testing)
    - [5.2.2 Unit Testing](#522-unit-testing)
    - [5.2.3 Integration Testing](#523-integration-testing)
    - [5.2.4 API Testing (Postman)](<#524-api-testing-(postman)>)
    - [5.2.5 Test Coverage](#525-test-coverage)
- [6. Entry and Exit Criteria](#6-entry-and-exit-criteria)
  - [6.1 Test Plan Entry/Exit Criteria](#61-test-plan-entryexit-criteria)
  - [6.2 Test Cycle Entry/Exit Criteria](#62-test-cycle-entryexit-criteria)
- [7. Deliverables](#7-deliverables)
- [8. Testing Workflow](#8-testing-workflow)
- [9. Environmental Needs](#9-environmental-needs)
  - [9.1 Base System Hardware](#91-base-system-hardware)
  - [9.2 Base Software Elements in the Test Environment](#92-base-software-elements-in-the-test-environment)
  - [9.3 Productivity and Support Tools](#93-productivity-and-support-tools)
- [10. Responsibilities, Staffing, and Training Needs](#10-responsibilities-staffing-and-training-needs)
- [11. Iteration Milestones](#11-iteration-milestones)
- [12. Risks, Dependencies, Assumptions, and Constraints](#12-risks-dependencies-assumptions-and-constraints)
- [13. Test Execution Screenshots](#13-test-execution-screenshots)

---

## 1. Introduction

### 1.1 Purpose

This Test Plan defines the testing strategy for **Mindhaven**, including backend API testing, integration testing, and CI-based validation. The goal is to ensure correctness, stability, and maintainability of the system.
The SUT is the Mindhaven backend API.

### 1.2 Scope

This plan covers:

- Unit testing of backend logic (controllers, services)
- Integration testing of API endpoints
- Manual API testing using Postman
- Functional testing using Gherkin feature files (from previous semester)
- Continuous Integration (CI) using GitHub Actions

Not covered:

- Performance or load testing
- Third-party service reliability
- Full frontend UI testing (focus is backend)

### 1.3 Intended Audience

This document is intended for:

- Developers working on Mindhaven
- Lecturers evaluating the project
- Future contributors

### 1.4 Document Terminology and Acronyms

| Term | Definition                        |
| ---- | --------------------------------- |
| API  | Application Programming Interface |
| CI   | Continuous Integration            |
| E2E  | End-to-End Testing                |
| JWT  | JSON Web Token                    |
| SUT  | System Under Test                 |

### 1.5 References

| Document | Location |
| -------- | -------- |
| Software Requirements Specification | `SRS.md` |
| Software Architecture Document | `SAD.md` |
| Use Case Documents | `UC*.md` files in the project root |
| Backend Test Files | `server/tests/` |
| Feature Files | `features/` |
| CI Workflow | `.github/workflows/node.js.yml` |
| Document                            | Location              |
| ----------------------------------- | --------------------- |
| Software Requirements Specification | `SRS.md`              |
| Software Architecture Document      | `SAD.md`              |
| Project README                      | `README.md`           |
| Server README / scripts             | `server/package.json` |

### 1.6 Document Structure

- Sections 1-2: purpose, background, and motivation
- Section 3: what is being tested
- Sections 4-5: what tests are planned and how they are executed
- Sections 6-7: criteria for starting/stopping testing and deliverables
- Sections 8-12: environment, responsibilities, milestones, and risks
- Section 13: test execution screenshots

---

## 2. Evaluation Mission and Test Motivation

### 2.1 Background

Mindhaven is a mental well-being platform that allows users to:

- Create accounts and manage profiles
- Write and manage journals
- Receive tag-based alerts
- Connect with buddies
- Use AI assistance and SOS features

The backend is built using **Node.js and Express**, with REST APIs.

### 2.2 Evaluation Mission

We aim to verify that:

- API endpoints behave correctly
- Authentication and authorization work properly
- Data is stored and retrieved correctly
- Core use cases function as expected

### 2.3 Test Motivators

- **Correctness** → Ensure features work as intended
- **Stability** → Prevent regressions
- **Security** → Validate authentication flows
- **Confidence** → Ensure safe deployments via CI

---

## 3. Target Test Items

**Backend:**

- Authentication (register, login)
- JWT token issuance and protected routes
- Journal management (create, update, fetch)
- Tag-based alerts
- User-related operations
- Buddy request and buddy checklist operations
- AI support controller behavior
- SOS route and model behavior

**System Flow:**

- User registration and login
- Journal lifecycle
- API request/response handling
- Buddy connection lifecycle
- Tag trend and alert analysis

---

## 4. Outline of Planned Tests

### 4.1 Outline of Test Inclusions

| Test Type         | Tool           | Description |
| ----------------- | -------------- | ----------- |
| Unit Tests        | Jest           | Test backend controllers, models, observers, and service-level logic |
| Integration Tests | Supertest      | Test Express API endpoints through route handling |
| Functional Tests  | Gherkin        | Validate user workflows through feature files |
| API Testing       | Postman        | Manually validate endpoint request and response behavior |
| CI Testing        | GitHub Actions | Automatically run backend tests, duplication checks, and frontend linting |

### 4.2 Potential Future Tests

- Frontend testing (React)
- Additional E2E browser flows beyond login
- Performance testing

### 4.3 Exclusions

- Third-party services
- Load testing
- Multi-browser testing

---

## 5. Test Approach

### 5.1 Tools Used

- Jest → Unit testing
- Supertest → API testing
- Postman → Manual testing
- GitHub Actions → CI pipeline

### 5.2 Testing Techniques and Types

#### 5.2.1 Functional Testing

- Based on Gherkin feature files
- Tests user scenarios like login

Example:

- Successful login
- Invalid credentials
- Missing input

#### 5.2.2 Unit Testing

- Tests individual components
- Focus on controllers and logic
- Uses mocked models and dependencies where needed to isolate the component under test

Example:

- UserController
- TagController
- BuddyController
- AIController
- Models and observer classes

#### 5.2.3 Integration Testing

- Tests full request flow
- Verifies routes + middleware + controllers

Example:

- `POST /api/auth/register`

Planned integration coverage to add:

- `POST /api/auth/login`
- Journal create, update, delete, and fetch endpoints
- Buddy request endpoints
- Tag and alert endpoints

#### 5.2.4 API Testing (Postman)

- Manual testing of endpoints
- Validate request/response

Example:

- Register user
- Login
- Create journal
- Update journal
- Fetch journals

Screenshot (Postman runs):

- ![Postman Register](Pictures/Postman_Test_Register.jpeg)
- ![Postman Login](Pictures/Postman_Test_Login.jpeg)
- ![Postman Create Journal](Pictures/Postman_Test_Create_Journal.jpeg)
- ![Postman Fetch Journals](Pictures/Postman_Test_Fetch_Journals.jpeg)
- ![Postman Update Journal](Pictures/Postman_Test_Update_Journal.jpeg)

#### 5.2.5 Test Coverage

- Measured using Jest
- Identifies untested code

Focus:

- Improve controller coverage
- Increase branch coverage

Screenshot (Coverage report):

- ![Jest Coverage Summary](Pictures/Test_Coverage.png)
- Increase branch coverage
- Identify untested backend modules before future releases

Current saved backend coverage report:

| Metric | Coverage |
| ------ | -------- |
| Statements | 50.58% |
| Branches | 28.70% |
| Functions | 45.34% |
| Lines | 54.90% |

---

## 6. Entry and Exit Criteria

### 6.1 Test Plan Entry/Exit Criteria

**Entry criteria:**

- Node.js installed
- Dependencies installed (`npm install`)
- Environment variables configured

**Exit criteria:**

- All tests pass
- No critical bugs
- CI pipeline is green

### 6.2 Test Cycle Entry/Exit Criteria

**Entry:** A pull request is opened targeting `main`; GitHub Actions triggers automatically.

**Exit:** All CI workflows complete with status `success`; PR is eligible for merge.

**Abnormal termination:** CI timeout or environment build failure blocks the PR.

---

## 7. Deliverables

| Deliverable       | Location                          |
| ----------------- | --------------------------------- |
| Unit Tests        | `/server/tests/unit/`             |
| Integration Tests | `/server/tests/integration/`      |
| Feature Files     | `/features/` and `/features/e2e/` |
| Step Definitions  | `/features/steps_definition/`     |
| Coverage Report   | `/server/coverage/`               |
| CI Workflow       | `/.github/workflows/node.js.yml`  |
| Test Plan         | `/Test_Plan.md`                   |
| Deliverable       | Location              |
| ----------------- | --------------------- |
| Unit Tests        | `server/tests/unit/`  |
| Integration Tests | `server/tests/integration/` |
| Feature Files     | `/features/`          |
| CI Workflow       | `.github/workflows/`  |
| Test Plan         | `Test_Plan.md`        |

---

## 8. Testing Workflow

1. Install dependencies in `/server` and `/client`.
2. Configure `server/.env` with database credentials (local or Aiven) and secrets.
3. Run unit + integration tests from `/server`:

- `npm test`
- `npm run test:coverage`

4. Run E2E login flow (requires backend on `http://localhost:8080` and frontend on `http://localhost:3000`):

- Start backend: `node index.js`
- Start frontend: `npm start` (from `/client`)
- Run E2E: `npm run test:e2e` (from `/server`)

5. CI runs `npm test` in `/server` on every push/PR to `main`, then checks duplication and runs frontend lint.

Screenshot (Testlauf):

- ![Lokaler Jest Testlauf](Pictures/Test_Jest.png)

The testing workflow is:

1. Install backend dependencies from the `server/` directory using `npm install`.
2. Install frontend dependencies from the `client/` directory using `npm install`.
3. Run backend unit and integration tests with `npm test` from `server/`.
4. Run backend coverage with `npm run test:coverage` from `server/`.
5. Run optional Cucumber feature tests with `npm run test:cucumber` from `server/`.
6. Run frontend linting with `npm run lint` from `client/`.
7. Review test output and coverage reports.
8. Fix failed tests or defects.
9. Re-run the affected test suite.
10. Commit changes only after tests pass.

In CI, GitHub Actions runs on pushes and pull requests targeting `main`. The configured workflow installs backend dependencies, runs backend tests, checks code duplication, installs frontend dependencies, and runs frontend linting.

---

## 9. Environmental Needs

### 9.1 Base System Hardware

Any system capable of running Node.js (Windows, macOS, Linux)

### 9.2 Base Software Elements in the Test Environment

- Node.js (CI uses v20)
- npm
- MySQL (local or Aiven) for integration tests
- Environment variables in `server/.env`
- Optional: Python runtime for local AI feature
- Playwright browsers for E2E tests

| Software | Purpose |
| -------- | ------- |
| Node.js 20 | Runtime used by the GitHub Actions workflow |
| npm | Dependency installation and script execution |
| Jest | Backend unit and integration test runner |
| Supertest | HTTP endpoint testing for Express routes |
| Cucumber.js | Functional workflow tests using Gherkin feature files |
| React Scripts | Frontend test and lint tooling |
| MySQL-compatible database | Application persistence layer for local/manual testing |
| Environment variables | Database, JWT, email, and API configuration |

### 9.3 Productivity and Support Tools

| Tool           | Purpose                               |
| -------------- | ------------------------------------- |
| Jest           | Unit and integration test runner      |
| Supertest      | API integration testing               |
| Cucumber       | Gherkin-based functional tests        |
| Chai           | Assertions for E2E tests              |
| Playwright     | Browser automation for E2E login flow |
| Postman        | Manual API testing                    |
| GitHub Actions | CI test execution                     |
| JSCPD          | Code duplication check in CI          |
| ESLint         | Frontend linting in CI                |
| Tool | Purpose |
| ---- | ------- |
| GitHub Actions | Automated CI validation |
| Jest Coverage | Generates coverage reports under `server/coverage/` |
| jscpd | Detects duplicated backend code |
| ESLint | Checks frontend code quality and complexity |
| Postman | Manual API request testing |
| Gherkin Feature Files | Documents functional user scenarios |

---

## 10. Responsibilities, Staffing, and Training Needs

| Role                | Responsibility                                                      |
| ------------------- | ------------------------------------------------------------------- |
| Developers          | Write and maintain unit/integration tests, keep coverage up to date |
| QA/Testers          | Execute manual API tests (Postman), verify Gherkin scenarios        |
| CI Owner            | Maintain GitHub Actions workflow and address CI failures            |
| Reviewers/Lecturers | Validate test evidence and deliverables                             |
| Role | Responsibility |
| ---- | -------------- |
| Developers | Write and maintain unit, integration, and functional tests |
| Test Lead | Review the test plan, confirm scope, and track completion |
| Reviewer/Lecturer | Evaluate test evidence, coverage, and project quality |
| CI Maintainer | Ensure GitHub Actions remains functional |
| Product Owner/Stakeholder | Confirm that tested workflows match expected user behavior |

Training needs:

- Basic Jest and Supertest usage
- Understanding of REST API testing
- Ability to read Gherkin feature files
- Familiarity with GitHub Actions output
- Understanding of project environment variables and setup

---

## 11. Iteration Milestones

| Milestone                                     | Status  |
| --------------------------------------------- | ------- |
| Initial unit tests for controllers/models     | Done    |
| Integration test for auth routes              | Done    |
| E2E login flow (Cucumber + Playwright)        | Done    |
| CI workflow for backend tests + frontend lint | Done    |
| Additional API endpoint coverage              | Planned |
| Milestone | Status |
| --------- | ------ |
| Test plan drafted | Complete |
| Backend unit tests added for controllers and models | Complete |
| Backend integration test added for registration route | Complete |
| Gherkin feature files documented | Complete |
| GitHub Actions workflow configured | Complete |
| Backend unit test execution verified locally | Complete |
| Coverage report generated | Complete |
| Additional integration tests for login, journal, buddy, tag, and SOS APIs | Planned |
| Frontend component test expansion | Planned |
| E2E browser automation | Future work |

---

## 12. Risks, Dependencies, Assumptions, and Constraints

| Risk                                              | Probability | Impact | Mitigation                                                          |
| ------------------------------------------------- | ----------- | ------ | ------------------------------------------------------------------- |
| Integration tests depend on database availability | Medium      | High   | Use local DB in dev; document Aiven setup for CI/local runs         |
| E2E tests are flaky due to browser timing/network | Medium      | Medium | Increase timeouts, keep stable test data, run locally when CI fails |
| AI feature depends on local Python environment    | Low         | Medium | Treat as optional; skip AI tests if Python deps missing             |
| Limited frontend tests                            | Medium      | Medium | Keep frontend linting in CI; plan React tests later                 |
| Secrets/config missing in CI or local runs        | Medium      | High   | Provide `.env.example` and document required variables              |
| Risk | Probability | Impact | Mitigation |
| ---- | ----------- | ------ | ---------- |
| Environment variables are missing or incorrect | Medium | High | Document required variables and use test-specific configuration |
| Database is unavailable during manual or integration testing | Medium | High | Use mocked dependencies for unit tests and configure a stable test database for integration tests |
| Third-party services such as email or AI APIs are unavailable | Medium | Medium | Mock external services during automated testing |
| Coverage is lower for branches and integration flows | High | Medium | Add focused tests for error paths, validation failures, and route-level workflows |
| CI workflow does not run every available test type | Medium | Medium | Expand CI to include frontend tests and Cucumber tests when stable |
| Manual Postman results are not recorded consistently | Medium | Medium | Store exported Postman collections and screenshots as test evidence |
| Test data may conflict between runs | Medium | Medium | Use isolated test users, cleanup steps, or mocked persistence |

Dependencies:

- Node.js and npm must be installed.
- Backend dependencies must be installed in `server/`.
- Frontend dependencies must be installed in `client/`.
- Required environment variables must be configured for local/manual testing.
- GitHub Actions requires repository access and a valid workflow file.

Assumptions:

- Unit tests should run without a live database by mocking model/database dependencies.
- Integration tests may require Express route setup and local server binding.
- Manual API testing is performed against a locally running backend.
- Current testing focus is backend correctness; frontend UI testing is limited.

Constraints:

- Load, stress, and performance testing are outside the current scope.
- Multi-browser testing is outside the current scope.
- Third-party service reliability is outside the current scope.
- Current CI does not execute frontend test cases.

---

## 13. Test Execution Screenshots

- ![Jest Testlauf (Unit + Integration)](Pictures/Test_Jest.png)
- ![Jest Coverage Report](Pictures/Test_Coverage.png)
- ![Postman Register](Pictures/Postman_Test_Register.jpeg)
- ![Postman Login](Pictures/Postman_Test_Login.jpeg)
- ![Postman Create Journal](Pictures/Postman_Test_Create_Journal.jpeg)
- ![Postman Fetch Journals](Pictures/Postman_Test_Fetch_Journals.jpeg)
- ![Postman Update Journal](Pictures/Postman_Test_Update_Journal.jpeg)

Test execution evidence should include screenshots or copied output from:

- Backend unit test run
- Backend full test run
- Backend coverage report
- GitHub Actions workflow result
- Postman API request/response validation

Current local backend unit test result:

| Command | Result |
| ------- | ------ |
| `npx jest tests/unit --runInBand` from `server/` | 9 test suites passed, 27 tests passed |

Current saved backend coverage result:

| Metric | Coverage |
| ------ | -------- |
| Statements | 50.58% |
| Branches | 28.70% |
| Functions | 45.34% |
| Lines | 54.90% |

Screenshots can be added below this section after running the commands in the local terminal or after viewing the GitHub Actions workflow run.
