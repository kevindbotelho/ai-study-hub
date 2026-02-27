# Design System: Academy AI - Study Dashboard
**Project ID:** 7146038398387104347

## 1. Visual Theme & Atmosphere
The dashboard has a clean, airy, and modern aesthetic. It focuses on a soft, educational, and inviting vibe rather than a dense, hyper-technical one. The layout embraces generous whitespace, soft rounded corners, and pastel-like accents that feel approachable.

## 2. Color Palette & Roles
- **Primary Purple-Periwinkle** (#8a71d6): Used for primary actions, active navigation states, bold icons, and primary branding elements.
- **Light Gray-White Surface** (#ffffff / #f6f6f8): Used as the main application background and card surfaces to keep the cognitive load low.
- **Soft Dark Slate** (#16131f / #1e293b): Used for primary typography, ensuring high contrast readability.
- **Muted Gray Text** (#64748b): Used for secondary text, metadata (like timestamps), and subtle borders.
- **Pastel Accent Red** (#fef2f2 / #ef4444): Used for specific category tags or notification badges.
- **Pastel Accent Purple** (#faf5ff / #9333ea): Used for article tags.
- **Pastel Accent Sky** (#f0f9ff / #0ea5e9): Used for tech/twitter tags.
- **Pastel Accent Orange** (#fff7ed / #ea580c): Used for forum/reddit tags.

## 3. Typography Rules
- **Font Family:** 'Space Grotesk', sans-serif for all UI text, giving a slightly futuristic yet highly readable feel.
- **Headings:** Heavy weights (`font-bold`) with tight line-heights for sections and titles (e.g., "Dashboard", "Recent Summaries").
- **Body:** Regular weights (`font-medium` or normal) for descriptions, maintaining clear legibility.
- **Small Labels:** Uppercase, tracking-wide text for category tags and internal metadata (`text-[10px] tracking-wider uppercase`).

## 4. Component Stylings
- **Buttons (Action):** Pill-shaped or generously rounded (`rounded-xl` or `rounded-full`), usually white text on primary background, or subtle hover backgrounds for secondary actions.
- **Cards/Containers:** Subtly rounded corners (`rounded-2xl`), pure white backgrounds, very soft/whisper-soft drop shadows (`shadow-sm`), and delicate borders (`border-primary/5`). Hover states increase shadow depth.
- **Inputs/Forms:** Soft inputs with icon on the left, pill-shaped (`rounded-xl`), without heavy borders (relying on soft background fills instead).
- **Icons:** Uses Material Symbols Outlined, often wrapped in circular or rounded-xl containers with soft backgrounds matching their tint.

## 5. Layout Principles
- **Sidebar & Main Content:** A persistent left sidebar for navigation and a main scrolling area for content.
- **Whitespace:** Generous padding (`p-5`, `p-8`) inside cards and sections to let content breathe.
- **Alignment:** Grid layouts (`grid-cols-1 md:grid-cols-2 xl:grid-cols-3`) are used for dashboard cards. Vertical alignment inside cards is structured with flexible gaps.
