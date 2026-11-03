# RiddlesMaster

A dedicated technical puzzle and lateral thinking platform designed to sharpen analytical problem-solving and critical reasoning skills for technical and engineering interviews.

---

## Table of Contents

- [Overview](#overview)
- [What RiddlesMaster Does](#what-riddlesmaster-does)
  - [Curated Problem Catalog](#curated-problem-catalog)
  - [Structured Practice Sets](#structured-practice-sets)
  - [Daily Challenges & Streak System](#daily-challenges--streak-system)
  - [Step-by-Step Solution Frameworks](#step-by-step-solution-frameworks)
  - [Personal Dashboard & Activity Heatmap](#personal-dashboard--activity-heatmap)
- [How to Use RiddlesMaster](#how-to-use-riddlesmaster)
  - [1. Discover and Filter Challenges](#1-discover-and-filter-challenges)
  - [2. Solve Daily Riddles](#2-solve-daily-riddles)
  - [3. Engage in Targeted Practice](#3-engage-in-targeted-practice)
  - [4. Leverage Hints and Step-by-Step Editorials](#4-leverage-hints-and-step-by-step-editorials)
  - [5. Monitor Growth and Save Problems](#5-monitor-growth-and-save-problems)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
  - [System Overview](#system-overview)
  - [Key Architecture Principles](#key-architecture-principles)
- [Project Structure](#project-structure)
- [License](#license)

---

## Overview

Technical interviews at modern technology companies evaluate more than just algorithmic coding—they increasingly test logical agility, mathematical intuition, lateral thinking, and Fermi estimation. 

**RiddlesMaster** provides an interactive platform dedicated specifically to these thinking frameworks. It offers a structured environment where software engineers, data scientists, and problem-solvers can practice, analyze, and master the puzzles and non-traditional reasoning challenges encountered in competitive technical evaluations.

---

## What RiddlesMaster Does

### Curated Problem Catalog
- **Diverse Problem Types**: Covers classical logic puzzles, probability paradoxes, brain teasers, grid puzzles, mathematical riddles, and estimation problems.
- **Difficulty Grading**: Challenges graded across standard difficulty tiers (Easy, Medium, Hard) to support progressive skill building.
- **Topic & Context Tagging**: Questions categorized by subject domain and real-world company interview contexts.
- **Full-Text Search & Filtering**: Multi-dimensional search allowing users to quickly locate specific topics, difficulty levels, or themes.

### Structured Practice Sets
- **Thematic Practice Sets**: Curated collections of related puzzles arranged to test specific reasoning paradigms (e.g., invariant analysis, pigeonhole principle, game theory).
- **Interactive Evaluation**: Submit answers and receive immediate validation with attempt status tracking.

### Daily Challenges & Streak System
- **Riddle of the Day**: A fresh challenge delivered every day to encourage consistent, bite-sized practice.
- **Consecutive Day Streaks**: Tracks consistency over time to help users build a daily habit of logical problem-solving.

### Step-by-Step Solution Frameworks
- **Structured Editorials**: Rich, formatted explanations that break down problems into their underlying principles rather than just giving away final answers.
- **Progressive Hints**: Tiered hints that guide users toward the solution organically without spoiling the breakthrough moment.

### Personal Dashboard & Activity Heatmap
- **Progress Tracking**: Clear visibility into attempted versus solved challenges.
- **Activity Visualization**: Git-style contribution heatmap reflecting practice consistency across the year.
- **Saved Collections**: Quick access to bookmarked puzzles for review and liked problems for future reference.

---

## How to Use RiddlesMaster

### 1. Discover and Filter Challenges
1. Navigate to the **Problems** section from the top navigation bar.
2. Use the filter controls to narrow down problems by category, difficulty level, or topic tags.
3. Use the search bar to find puzzles based on keywords or concepts.
4. Click on any problem card to open its dedicated view.

### 2. Solve Daily Riddles
1. Visit the **Daily** challenge section to see today's featured puzzle.
2. Contemplate the scenario, work through the reasoning, and submit your answer.
3. Completing the daily challenge keeps your consecutive active streak intact and updates your activity calendar.

### 3. Engage in Targeted Practice
1. Open the **Practice** tab to access structured problem sets.
2. Work through problems consecutively to develop confidence in specific reasoning archetypes.
3. Review your performance and revisit unattempted or tricky questions at your own pace.

### 4. Leverage Hints and Step-by-Step Editorials
1. When tackling a challenging riddle, attempt to derive the solution independently.
2. If stuck, reveal progressive hints to point your thought process in the right direction.
3. Once attempted, view the comprehensive editorial breakdown to learn formal problem-solving methodologies and alternative angles.

### 5. Monitor Growth and Save Problems
1. Access your **Profile** to view your overall statistics, total solved count, and current streak.
2. Use the **Bookmark** button on any problem to save it for revision prior to upcoming interviews.
3. Use the **Like** button to curate your personal collection of favorite puzzles.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Core Framework** | [Astro](https://astro.build/) (Server-Side Rendering) |
| **UI Components** | React (Astro Islands Architecture) |
| **Styling** | Tailwind CSS |
| **Component Primitives** | Radix UI |
| **Rich Text Engine** | Tiptap |
| **Language** | TypeScript |
| **Data Layer** | PostgreSQL & Prisma ORM |

---

## Architecture

RiddlesMaster combines the performance benefits of static and server-rendered HTML with selective client-side interactivity using an Islands architecture.

### System Overview

```
┌──────────────────────────────────────────────────────────┐
│                      Client Browser                      │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                 Edge Distribution & CDN                  │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                 Astro Server Runtime (SSR)               │
│                                                          │
│  ┌─────────────────────────┐  ┌───────────────────────┐  │
│  │   Server-Rendered Pages │  │ React Islands Hydrate │  │
│  │   • Problem Catalog     │  │   • Interactive UI    │  │
│  │   • Problem Views       │  │   • Answer Inputs     │  │
│  │   • Profile & Dashboards│  │   • Like & Save State │  │
│  └─────────────────────────┘  └───────────────────────┘  │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                  Application Services                    │
│                                                          │
│  ┌─────────────────────────┐  ┌───────────────────────┐  │
│  │   Type-Safe ORM Layer   │  │   Auth & Access Guard │  │
│  │   • Data Modeling       │  │   • Session Validation│  │
│  │   • Query Execution     │  │   • User Permissions  │  │
│  └─────────────────────────┘  └───────────────────────┘  │
│                            │                             │
│                            ▼                             │
│                 PostgreSQL Persistence                   │
└──────────────────────────────────────────────────────────┘
```

### Key Architecture Principles

- **Server-First Delivery**: High-traffic catalog and problem pages are server-rendered to maximize page delivery speed, reduce client bundle sizes, and optimize search engine discoverability.
- **Targeted Client Hydration**: Interactive elements (such as response verification, like/bookmark triggers, and navigation states) load as isolated React islands, keeping initial JavaScript execution to a minimum.
- **Type-Safe Data Flow**: Centralized TypeScript data models and ORM access ensure strict end-to-end type safety across server queries and UI components.
- **Granular Security Controls**: Server-level session verification and row-level authorization ensure user activity, bookmarks, and account records remain securely partitioned.

---

## Project Structure

```
riddles-master/
├── public/                 # Static assets, icons, and metadata
├── src/
│   ├── assets/             # Vector graphics, brand assets, and icons
│   ├── components/         # Reusable UI components & islands
│   │   ├── practice/       # Practice session & problem-solving UI
│   │   ├── ui/             # Core design system components
│   │   ├── Footer.tsx      # Site footer component
│   │   ├── Hero.astro      # Homepage hero section
│   │   ├── LikeButton.tsx  # Interactive like island
│   │   ├── Navbar.tsx      # Navigation island
│   │   └── ProblemCard.astro # Problem preview card component
│   ├── layouts/            # Base layouts and shared HTML shell
│   │   └── Layout.astro    # Master layout with SEO metadata
│   ├── lib/                # Shared utilities, client helpers, and helpers
│   │   ├── daily.ts        # Daily puzzle logic helpers
│   │   ├── problems.ts     # Problem query and format utilities
│   │   └── utils.ts        # General utility functions
│   ├── pages/              # Application routing and view templates
│   │   ├── articles/       # Educational articles and guides
│   │   ├── practice/       # Themed practice workflows and sets
│   │   ├── problems/       # Problem catalog and detailed problem views
│   │   ├── daily.astro     # Daily challenge page
│   │   ├── profile.astro   # User stats and activity dashboard
│   │   └── index.astro     # Main application landing page
│   ├── styles/             # Global CSS and Tailwind configurations
│   ├── types/              # Shared TypeScript interfaces and definitions
│   └── middleware.ts       # Request validation and auth middleware
├── astro.config.mjs        # Astro framework configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and script declarations
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
