---
page: settings
---
A settings page where the user configures their profile and preferences.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first
- Theme: Light, minimal, modern, soft and airy
- Background: Light Gray-White Surface (#ffffff / #f6f6f8)
- Primary Accent: Primary Purple-Periwinkle (#8a71d6) for active filters and icons
- Text Primary: Soft Dark Slate (#16131f)
- Text Secondary: Muted Gray Text (#64748b)
- Forms: Inputs are pill-shaped or very softly rounded (12px), with subtle borders (#e2e8f0) and soft background fills (#f8fafc).
- Buttons: Soft rounded pills. Primary (Purple) for save/actions. Outline/Soft Gray for cancel.

**Page Structure:**
1. **Header:** Title "Settings" with a brief subtitle "Manage your profile and preferences."
2. **Main Layout (Two Columns):**
   - **Left Column (Navigation):** Vertical list of settings categories (e.g. "Profile" [Active, purple accent], "Account", "Appearance", "Integrations").
   - **Right Column (Form Content):** 
     - **Profile Section:** 
       - Profile Picture with an "Upload/Change" button.
       - Form fields: "Full Name", "Email Address" (disabled/readonly look), "Profession / Role" (e.g. Student, Researcher, Developer).
       - Action buttons at the bottom: "Save Changes" (Primary) and "Cancel" (Ghost/Outline).
