# Portfolio Website Tech Specification

## Overview
A modern, dark-themed portfolio website for Denilson Lopez built with Next.js, featuring a hero landing page and a split-view navigation system with smooth scroll animations.

## Key Features

### 1. **Hero Landing Page**
- Full-screen desert landscape background image
- Centered "Denilson Lopez" name at the top
- Top navigation bar with: Projects, Contact, Blog
- Settings/theme toggle icon (gear) in top-right
- Welcome message overlay on the landscape
- Compass/navigation indicator in bottom-left

### 2. **Split Section View**
- **Left Sidebar Navigation:**
  - "Denilson Lopez" name (animated - moves from center to left on scroll)
  - Navigation links: About, Work Exp., Projects, Contact
  - Active section highlighting
  - Small "N" icon/badge at bottom-left
  
- **Right Content Area:**
  - Dynamic content based on selected section
  - Smooth transitions between sections
  - Dark theme with accent colors (light blue borders)

### 3. **Sections**

#### About Me
- Large "About Me" heading
- 3 paragraphs of bio text
- Two skill boxes side-by-side:
  - Frontend: React, Next.js, TypeScript, Tailwind CSS
  - Backend: Node.js, Python, REST APIs, GraphQL

#### Work Experience
- "Work Experience" heading
- Job cards with:
  - Job title (bold)
  - Company name
  - Date range (right-aligned)
  - Description
  - Light blue border accent

#### Projects
- Project showcase section (to be defined)

#### Contact
- Contact form/information (to be defined)

## Technical Stack

### Core Framework
- **Next.js 14+** (App Router)
  - Server Components for optimal performance
  - Client Components for interactivity
  - File-based routing

### Styling
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations and transitions
- Custom CSS for complex animations if needed

### State Management
- **React Context** or **Zustand** for:
  - Active section tracking
  - Theme management (dark/light)
  - Scroll position tracking

### Animation Libraries
- **Framer Motion** for:
  - Name position animation on scroll
  - Section transitions
  - Page transitions
  - Scroll-triggered animations

### Image Optimization
- **Next.js Image** component for optimized background images
- Support for responsive images

## Architecture & Implementation Plan

### 1. **Project Structure**
```
dlopez_portfolio_v3/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Hero landing page
│   ├── portfolio/
│   │   └── page.tsx        # Split-view portfolio page
│   ├── globals.css         # Global styles
│   └── components/
│       ├── Hero/
│       │   ├── HeroSection.tsx
│       │   ├── HeroNav.tsx
│       │   └── WelcomeMessage.tsx
│       ├── Portfolio/
│       │   ├── PortfolioLayout.tsx    # Split view container
│       │   ├── Sidebar.tsx            # Left navigation
│       │   ├── AnimatedName.tsx       # Name with scroll animation
│       │   ├── ContentArea.tsx        # Right content area
│       │   └── SectionIndicator.tsx   # Active section indicator
│       ├── Sections/
│       │   ├── AboutSection.tsx
│       │   ├── WorkExperienceSection.tsx
│       │   ├── ProjectsSection.tsx
│       │   └── ContactSection.tsx
│       └── UI/
│           ├── ThemeToggle.tsx
│           ├── SkillCard.tsx
│           └── WorkCard.tsx
├── public/
│   └── images/
│       └── desert-landscape.jpg
├── lib/
│   ├── hooks/
│   │   ├── useScrollPosition.ts
│   │   └── useActiveSection.ts
│   └── utils/
│       └── cn.ts            # Class name utility
└── types/
    └── index.ts             # TypeScript types
```

### 2. **Key Implementation Details**

#### Hero Page (`app/page.tsx`)
- Full-screen background with `fixed` positioning
- Centered layout for name and navigation
- Smooth scroll-to-portfolio transition
- No split view navigation visible

#### Portfolio Split View (`app/portfolio/page.tsx`)
- **Layout Structure:**
  ```
  <div className="flex h-screen">
    <Sidebar />        {/* Left: 300px fixed width */}
    <ContentArea />    {/* Right: flex-1, scrollable */}
  </div>
  ```

#### Animated Name Component
- **Initial State:** Centered at top (hero page)
- **Scroll Trigger:** When entering portfolio view or scrolling past threshold
- **Animation:** 
  - Use `framer-motion` `useScroll` hook
  - Transform: `translateX` from `0` to `-50%` (or specific pixel value)
  - Position: `fixed` → `absolute` (relative to sidebar)
  - Smooth easing: `easeInOut` or custom cubic-bezier
- **Implementation:**
  ```tsx
  const { scrollY } = useScroll()
  const nameX = useTransform(scrollY, [0, 500], [0, -200])
  ```

#### Section Navigation
- **Scroll Spy:** Track which section is in viewport
- **Active State:** Highlight current section in sidebar
- **Smooth Scrolling:** Use `scrollIntoView` with `behavior: 'smooth'`
- **Intersection Observer:** Detect section visibility

#### Theme Management
- **Dark Mode:** Default dark theme
- **Toggle:** Settings icon in top-right
- **Persistence:** `localStorage` for preference
- **Context Provider:** Wrap app with theme context

### 3. **Responsive Design**
- **Mobile (< 768px):**
  - Stack sidebar and content vertically
  - Hide sidebar, use hamburger menu
  - Name animation simplified or disabled
- **Tablet (768px - 1024px):**
  - Reduced sidebar width
  - Adjusted name animation
- **Desktop (> 1024px):**
  - Full split view
  - Full animation effects

### 4. **Performance Optimizations**
- **Code Splitting:** Lazy load sections
- **Image Optimization:** Next.js Image with proper sizing
- **Animation Performance:** Use `will-change` and `transform` properties
- **Scroll Performance:** Throttle scroll listeners
- **Font Loading:** Optimize font loading strategy

### 5. **Accessibility**
- Semantic HTML
- ARIA labels for navigation
- Keyboard navigation support
- Focus management
- Screen reader friendly

## Animation Specifications

### Name Animation ("Denilson Lopez")
- **Trigger:** Scroll position or route change
- **Duration:** 600-800ms
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design)
- **Properties:**
  - `transform: translateX()`
  - `font-size` (optional: slight scale down)
  - `opacity` (optional: slight fade)

### Section Transitions
- **Fade In:** 300ms
- **Stagger:** 100ms delay between elements
- **Direction:** Slide up with fade

### Scroll Indicators
- **Active Section:** Smooth highlight transition
- **Progress Bar:** Optional scroll progress indicator

## Data Structure

### Work Experience
```typescript
interface WorkExperience {
  title: string
  company: string
  dateRange: string
  description: string
}
```

### Skills
```typescript
interface SkillCategory {
  title: string
  skills: string[]
}
```

## Development Phases

### Phase 1: Setup & Foundation
- [ ] Initialize Next.js project with TypeScript
- [ ] Setup Tailwind CSS
- [ ] Install Framer Motion
- [ ] Create basic layout structure
- [ ] Setup routing

### Phase 2: Hero Page
- [ ] Implement hero section with background
- [ ] Add navigation bar
- [ ] Create welcome message component
- [ ] Add theme toggle

### Phase 3: Portfolio Split View
- [ ] Create split layout structure
- [ ] Implement sidebar navigation
- [ ] Build content area with sections
- [ ] Add scroll spy functionality

### Phase 4: Animations
- [ ] Implement name scroll animation
- [ ] Add section transition animations
- [ ] Smooth scroll behavior
- [ ] Active section highlighting

### Phase 5: Content Sections
- [ ] About Me section
- [ ] Work Experience section
- [ ] Projects section
- [ ] Contact section

### Phase 6: Polish & Optimization
- [ ] Responsive design
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Testing

## Questions for Refinement

1. **Navigation Flow:**
   - Should clicking "Projects" in hero nav go directly to portfolio/projects section?
   - Or should it go to portfolio page and then scroll to projects?

2. **Name Animation:**
   - Should the name be visible on both hero and portfolio pages?
   - Or should it transition from hero to sidebar position?

3. **Scroll Behavior:**
   - Should sections be full viewport height (snap scrolling)?
   - Or natural scroll with smooth transitions?

4. **Content:**
   - Do you have the actual content (bio, work experience, projects)?
   - Or should we use placeholder content for now?

5. **Blog Section:**
   - Is the blog a separate page or integrated into portfolio?
   - What CMS/blog system should we use?

6. **Theme:**
   - Dark mode only, or light/dark toggle?
   - Any specific color palette preferences?

---

## Next Steps
1. Review and refine this spec
2. Confirm technical decisions
3. Gather content/assets
4. Begin Phase 1 implementation

