# Design System Document

## 1. Overview & Creative North Star
The HVAC industry is built on precision, climate control, and technical mastery. To reflect this, the Creative North Star for this design system is **"The Digital Atmosphere."** 

We are moving away from the "cluttered industrial" look of traditional marketplaces. Instead, we embrace a high-end editorial experience that feels as clean and refreshing as the air our products provide. By leveraging mathematical typography, intentional asymmetry, and "glassmorphism," we create a space that feels engineered yet inviting. This system rejects generic templates in favor of a bespoke, layered architecture that emphasizes expertise and verified quality.

---

## 2. Colors
Our palette balances the clinical precision of HVAC technology with the warmth of human service.

*   **Primary Hierarchy:** Use `primary` (#004e99) for core branding and `primary_container` (#0a66c2) for high-impact interaction points.
*   **The "No-Line" Rule:** To achieve a premium, editorial feel, **prohibit the use of 1px solid borders for sectioning.** Structural boundaries must be defined solely by background shifts. For example, a `surface_container_low` (#eff4ff) section should sit directly against a `surface` (#f8f9ff) background to imply a change in context.
*   **Surface Hierarchy & Nesting:** Treat the UI as a series of physical layers. Use `surface_container_lowest` (#ffffff) for the most prominent foreground elements (like product cards) and `surface_container` (#e5eeff) for secondary grouping areas.
*   **The "Glass & Gradient" Rule:** Floating elements, such as navigation bars or "Trust Badges," should utilize Glassmorphism. Use a semi-transparent `surface_container_lowest` with a `backdrop-filter: blur(12px)`.
*   **Signature Textures:** Main CTAs should not be flat. Apply a subtle linear gradient from `primary` to `primary_container` to provide a "machined" metallic depth that feels intentional and high-end.

---

## 3. Typography
We employ a **Perfect Fourth (1.333)** scale to ensure mathematical harmony and an authoritative vertical rhythm.

*   **Display & Headlines:** Use **Inter** for all headings. The `display-lg` (3.5rem) and `headline-lg` (2rem) are designed for impact. Use tight letter-spacing (-0.02em) for headlines to create a "technical journal" aesthetic.
*   **Body & Utility:** `body-lg` (1rem) serves as our primary reading grade. Ensure `on_surface_variant` (#414752) is used for secondary body text to maintain a soft, legible contrast that isn't as harsh as pure black.
*   **The Trust Badge Label:** Use `label-md` (0.75rem) in all-caps with increased letter-spacing (0.05em) when paired with technician certifications to denote authority.

---

## 4. Elevation & Depth
In this system, depth is a function of light and atmosphere, not heavy shadows.

*   **The Layering Principle:** Stacking tiers (e.g., a `surface_container_lowest` card on a `surface_container_low` background) creates natural elevation. This "tonal lift" is our primary method of hierarchy.
*   **Ambient Shadows:** Where a floating effect is required (e.g., a hovering product card), use an extra-diffused shadow: `box-shadow: 0 12px 32px rgba(11, 28, 48, 0.06)`. The tint is derived from `on_surface` to mimic natural ambient occlusion.
*   **The "Ghost Border" Fallback:** If a container requires a boundary for accessibility, use the `outline_variant` token at **15% opacity**. This creates a "breath" of a line rather than a hard edge.
*   **Atmospheric Glass:** Use semi-transparent layers for elements that overlap imagery. This allows the "vibrancy" of high-quality HVAC photography to bleed through, keeping the layout integrated.

---

## 5. Components

### Buttons
*   **Primary:** Gradient from `primary` to `primary_container`. 12px (`md`) rounded corners. High-contrast `on_primary` text.
*   **Secondary:** `surface_container_highest` background with `on_secondary_container` text. No border.
*   **Tertiary:** Ghost style. No background, `primary` text, shifts to `surface_container_low` on hover.

### Product Cards
*   **Structure:** No borders or dividers. Use `surface_container_lowest` for the card body.
*   **Condition Badges:** Use `tertiary_container` (#007650) with `on_tertiary_fixed` (#002113) for "Certified Refurbished" status.
*   **Visuals:** Image must take up the top 60% of the card, utilizing a subtle inner-glow to lift it off the white background.

### Trust Elements (Technician Badges)
*   **Style:** Glassmorphic floating chips.
*   **Icons:** Use `tertiary` (#005b3d) for "Verified" checkmarks to signify safety and efficiency.

### Input Fields
*   **Surface:** Use `surface_container_low` backgrounds. 
*   **State:** On focus, the background transitions to `surface_container_lowest` with a 1px "Ghost Border" using the `primary` token at 40% opacity.

### Lists & Dividers
*   **Strict Rule:** **Forbid the use of horizontal divider lines.** Separate list items using the **spacing scale** (e.g., `8` (2rem) or `10` (2.5rem)) or subtle background zebra-striping using `surface` and `surface_container_low`.

---

## 6. Do's and Don'ts

### Do:
*   **DO** use whitespace as a functional tool. If a section feels crowded, increase the padding to the next step in the spacing scale (e.g., move from `12` to `16`).
*   **DO** use "surface-on-surface" layering to define the content hierarchy.
*   **DO** ensure all "Trust Badges" (Warranty, Technician Certified) are placed near price points to alleviate buyer friction.

### Don't:
*   **DON'T** use 1px solid #CCCCCC borders. It breaks the "Digital Atmosphere" and makes the site look like a generic template.
*   **DON'T** use pure black (#000000) for text. Always use `on_surface` (#0b1c30) to maintain tonal depth.
*   **DON'T** use standard "Drop Shadows." If an element needs to float, it must use the diffused "Ambient Shadow" or Glassmorphism.
*   **DON'T** use more than two font weights in a single component. Let the size and scale do the work, not the weight.