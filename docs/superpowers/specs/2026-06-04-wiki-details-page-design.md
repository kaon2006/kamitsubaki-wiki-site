# KAMITSUBAKI Wiki Details Page Design Spec

## 1. Overview
The project currently has a single root index page containing summary data for artists and projects. This specification details the architecture for individual entity detail pages (e.g., specific Artist or Project pages), modeled after a high-density Wikipedia layout but styled to match the Kamitsubaki Studio dark cyber aesthetic.

## 2. Layout & Routing
- **URL Structure**: `src/pages/[locale]/artists/[...id].astro` (e.g., `/zh/artists/vwp/kaf`).
- **Page Layout**:
  - Global Top Navigation.
  - Main Content Area (Left/Center).
  - Sticky Table of Contents (Right Sidebar) indicating scroll progress.
- **Style Guidelines**: Dark mode, high information density, neon/cyber UI accents.

## 3. Data Architecture (Migration to Markdown)
Current JSON-based content entries are insufficient for long-form wiki articles. 
- **Change**: Transition the `artists` and `projects` collections from `.json` to Markdown (`.md` or `.mdx`).
- **Structure**:
  - **Frontmatter**: Stores metadata (name, debut date, tags, avatar/hero images).
  - **Body**: Stores long-form markdown text, utilizing standard markdown headings (H2, H3).
- **Astro Integration**: Utilizing Astro's `getCollection` and `render()` to automatically generate HTML content and extract heading data (`headings` array) for the Table of Contents.

## 4. Core UI Components

### 4.1 WikiInfoBox
- **Purpose**: Displays the core metadata of the entity in a structured table, akin to Wikipedia infoboxes.
- **Location**: Floated to the right at the top of the main content area (or above it on mobile).
- **Visuals**: Glassmorphism panel, subtle neon borders, showcasing the character's key visual, name, designer, debut date, and social metrics.

### 4.2 TableOfContents
- **Purpose**: Allows quick navigation through long wiki articles.
- **Location**: Fixed `aside` on the right edge of the screen.
- **Behavior**: Uses an `IntersectionObserver` on the client side to track which section is currently visible and highlights the corresponding link in the ToC.

### 4.3 WikiProse (Typography system)
- **Purpose**: Ensures that all markdown-rendered text follows the unified site aesthetic.
- **Implementation**: Uses `@tailwindcss/typography` (`prose`).
- **Customization**: Styled to have dark backgrounds, highly legible light text, specific neon accent colors for links, and stylized header bottom-borders.

## 5. Scope & Validation
- **Scope**: This plan covers only the layout architecture, data migration strategy, and UI components for the Artist Detail pages. Project Detail pages will share the same infrastructure but may be implemented in a subsequent iteration.
- **Success Criteria**: 
  - A user can navigate to `/zh/artists/vwp/kaf` and see a full-page rendered article.
  - The right-side ToC updates as the user scrolls.
  - The `src/content/artists/vwp/kaf/zh.md` file correctly maps frontmatter to the InfoBox and body to the Prose component.
