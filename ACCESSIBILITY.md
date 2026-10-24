# Accessibility Statement

At **Interactive Learning & Quiz Platform (ILQP)**, we believe that web applications and digital learning tools should be accessible to everyone, including individuals with visual, auditory, motor, or cognitive disabilities.

We are committed to continually improving the user experience for all users and applying relevant accessibility standards across our React and Tailwind CSS frontend interfaces.

---

## Conformance Status

The **WCAG (Web Content Accessibility Guidelines)** defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.

* **Target Standard:** WCAG 2.1 Level AA
* **Current Status:** Partially Conformant

*Partially conformant means that while the core user journeys (quiz taking, deck creation, and navigation) are built with accessibility in mind, some parts of the content or dynamic state updates may not yet fully conform to the highest accessibility standard.*

---

## Accessibility Features Implemented

To ensure a broad and inclusive user experience, ILQP includes the following technical accessibility practices:

* **Semantic HTML Markup:** Extensive use of native landmark elements (`<header>`, `<main>`, `<nav>`, `<article>`, `<button>`) to support logical DOM structure and screen reader navigation.
* **Keyboard Navigation:** Core interactive components (buttons, form inputs, quiz option selectors, navigation links) are fully reachable and actionable via standard `Tab`, `Enter`, and `Spacebar` keys.
* **Focus Indicator Styles:** Clear, high-contrast focus rings styled with Tailwind CSS (`focus:ring-2`, `focus:outline-none`) to ensure keyboard users can track their visual position.
* **Color Contrast Ratios:** UI color palettes designed with sufficient contrast ratios between text and background elements in accordance with WCAG AA guidelines.
* **Responsive Layouts:** Flexible viewports utilizing modern Tailwind layouts (Flexbox/Grid) allowing smooth page zooming up to 200% without loss of content or broken controls.
* **Form & Input Labels:** Explicit form labels and visual error messaging for input fields in quiz creation and deck management views.

---

## Supported Environments & Assistive Technologies

ILQP is tested for compatibility across standard modern desktop browsers and modern assistive technology setups:

* **Supported Browsers:** Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge (latest versions).
* **Screen Reader Compatibility:** Tested for basic screen reader compatibility using **NVDA** (Windows) and **VoiceOver** (macOS / iOS).
* **Device Responsiveness:** Compatible with desktop, tablet, and mobile displays.

---

## Known Limitations & Ongoing Enhancements

Despite our best efforts to ensure accessibility across all interactive views, we are actively working on addressing the following known areas for improvement:

1. **Dynamic Quiz Timers:** Screen reader announcements for real-time countdown timers (`aria-live="polite"`) are currently under active refinement to prevent continuous audio disruptions during timed quizzes.
2. **Complex Analytics Data:** Dynamic data charts on the `AnalyticsDashboard` may require supplemental tabular data views for enhanced screen reader output.
3. **Focus Trap Management:** Modal overlays and confirmation dialogs are being updated to ensure keyboard focus remains strictly trapped inside active dialog windows until dismissed.

---

## Feedback & Reporting Accessibility Barriers

We welcome your feedback on the accessibility of the Interactive Learning & Quiz Platform. If you encounter accessibility barriers, experience difficulty reading or interacting with any component, or have suggestions for improvement, please let us know:

* **Maintainer:** Aliaksandr Kulinkovich (**A1exKH**)
* **Email:** [alexander.kulinkovich@gmail.com](mailto:alexander.kulinkovich@gmail.com)
* **GitHub Issues:** Open an issue titled `[Accessibility]` in our [GitHub Issue Tracker](https://github.com/A1exKH/ILQP/issues).

We aim to acknowledge and respond to accessibility barrier reports within **48 hours**.

---

*This statement was last updated in October 2026.*
