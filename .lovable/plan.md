

# Portfolio Website for B.Sc B.Ed Student

## Overview
Single-page portfolio with blue/white theme, smooth animations, and full responsiveness.

## Files to Create/Modify

### 1. `src/index.css` — Update color palette
- Primary blue: `221 83% 53%` (#2563EB)
- Light accents, white backgrounds, navy text

### 2. `tailwind.config.ts` — Add animation keyframes
- fade-in, scale-in animations for scroll effects

### 3. `src/pages/Index.tsx` — Complete portfolio page
All sections in one file with smooth scroll navigation:

- **Navbar**: Sticky, transparent-to-white on scroll, hamburger on mobile
- **Hero**: Split layout — text left (name, tagline, intro, 2 CTA buttons), placeholder image right with blue gradient background
- **About**: Card with teaching philosophy paragraph
- **Education**: Timeline card for B.Sc B.Ed at Azim Premji University
- **Skills**: Two-column grid — Teaching Skills (chips) and Technical Skills (chips)
- **Projects/Experience**: 3 placeholder cards (Teaching Internship, Volunteer Work, Curriculum Project)
- **Contact**: Info with icons + simple contact form
- **Footer**: Copyright + social links

## Design Details
- Blue gradient hero background
- Cards with subtle shadows and hover lift effects
- Intersection Observer for fade-in-on-scroll animations
- Mobile-first responsive layout

