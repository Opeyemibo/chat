# WebChat Interface Clone

## Overview
This project recreates a WhatsApp-inspired web chat experience using only HTML, CSS, and vanilla JavaScript. It features a left-hand contact list, an active conversation pane, theme controls, and responsive adaptations that mirror modern messaging applications.

## Features
- **Hamburger Menu**: Accessible menu toggle that opens a profile/settings dropdown and closes automatically when clicking outside or pressing `Escape`.
- **Contact Switching**: Clicking a contact updates the active chat header and avatar, bringing the chat panel into focus on both desktop and mobile.
- **Theme Selector**: Dropdown that applies different visual themes by updating a `data-theme` attribute on the document body.
- **Responsive Layout**: Collapsible sidebars and mobile bottom navigation to keep the interface usable on smaller screens.
- **Floating Actions**: Quick new chat button and filter shortcuts to mimic native messaging UX patterns.

## Project Structure
- **index.html**: Markup for the sidebar, chat list, menu, conversation area, and theme controls.
- **style.css**: Complete styling for the layout, responsive breakpoints, and theme variations.
- **script.js**: Interactive behavior for the theme switcher, hamburger menu, and chat selection.

## Getting Started
1. **Open the project**: Launch `index.html` directly in your browser or serve the folder with a lightweight static server (e.g., `npx serve`).
2. **Explore the UI**: Interact with the sidebar, select contacts, and test the theme selector.
3. **Adjust assets**: Replace placeholder avatars (`avatar1.png`, etc.) with your own images to personalize the experience.

## Customization Tips
- **Themes**: Match the available option values in the dropdown with CSS selectors in `style.css` to define distinct color palettes.
- **Menu Items**: Update the list within the `<ul id="menu">` block in `index.html` to link to your own pages or modals.
- **Mobile Behavior**: Modify the responsive rules in `style.css` (`@media (max-width: 767px)`) to refine how the interface collapses on phones.

## Deployment Notes
- The project relies solely on front-end assets, so you can host it on any static hosting service (GitHub Pages, Netlify, Vercel, etc.).
- Before deploying, ensure imagery and theme definitions exist for every option to avoid missing asset errors.