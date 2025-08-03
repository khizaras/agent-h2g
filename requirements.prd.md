## Product Requirements Document (PRD) for Hands2gether Revamp

### 1. Introduction

The purpose of this project is to completely revamp the Hands2gether community platform. The current site suffers from a complicated structure and broken logic. This revamp will replace the existing system with a new, clean, and intuitive application designed to effectively connect people for offering and receiving food, clothes, and training sessions.

### 2. Scope

- **In Scope:**
  - Complete technical overhaul, removing or archiving all existing project files.
  - Implementation of a new, well-organized file structure and codebase.
  - A full redesign of the user interface (UI) to match the provided design reference.
  - Development of core features for creating, viewing, and managing causes for Food, Clothes, and Training.
  - An administrative back-office or dashboard.
- **Out of Scope:**
  - Donation processing, payment gateways, or any fundraising functionality.

### 3. Functional Requirements

#### 3.1. Cause Management

- **Cause Creation:** Registered users must be able to create a new cause by selecting a category (Food, Clothes, Training) and filling in the relevant details.
- **Cause Listing Page:** A central page that displays all active causes. Users should be able to filter the list by category (Food, Clothes, Training).
- **Cause Detail Page:** Each cause must have its own dedicated page displaying all its specific information.
- **Cause Editing:** Users must be able to edit the details of the causes they have created.

#### 3.2. Cause-Specific Information

The information required for creating a cause depends on its category:

- **Food Cause:**
  - **Cause Type:** (Required) A choice between "Wanted" or "Offered".
  - **Details:** Type of food (e.g., cooked meals, groceries), quantity (e.g., "feeds 10 people"), location, and contact information.

- **Clothes Cause:**
  - **Cause Type:** (Required) A choice between "Wanted" or "Offered".
  - **Details:** Type of clothing (e.g., men's, women's, children's), size, condition (e.g., new, used), and contact information.

- **Training Session Cause:**
  - **Session Details:** Topic, detailed description, instructor information.
  - **Logistics:** Date, time, and location/meeting link.
  - **Course Information:** Enrollment details, prerequisites, curriculum/syllabus, and links to course materials.

#### 3.3. Required Pages

The application must include the following pages:

- **Home Page:** Main landing page.
- **About Page:** Information about the Hands2gether initiative.
- **Contact Page:** A way for users to contact the site organizers.
- **Cause Listing Page:** Displays all available causes.
- **Cause Detail Page:** Displays information for a single cause.
- **Create Cause Page:** A form for users to create a new cause.
- **Edit Cause Page:** A form to modify an existing cause.
- **User Profile Page:** A page where users can view and manage the causes they have created.

### 4. Non-Functional Requirements

#### 4.1. User Interface (UI) & User Experience (UX)

- The new design must be user-friendly, modern, and intuitive.
- The layout, color scheme, theme, and overall design principles must strictly replicate the provided reference: the Google Meet product page.

#### 4.2. Codebase & Architecture

- The new implementation must have a clean, maintainable, and well-organized codebase, free from the broken logic of the previous version.
- The database schema must be designed **without using foreign keys**.

#### 4.3. Database Schema

- The complete, final database schema must be saved in a single SQL file named `new_schema.sql` and placed in the root directory of the project.
