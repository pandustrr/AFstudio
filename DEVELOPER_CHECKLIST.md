# ✅ DEVELOPER CHECKLIST - MOBILE RESPONSIVENESS

**Version:** 1.0  
**Last Updated:** 5 Februari 2026  
**For:** AFstudio Development Team

---

## 📱 PRE-DEVELOPMENT CHECKLIST

Sebelum mulai development atau bug fix, pastikan Anda memahami best practices:

### Understanding Responsive Design
- [ ] Familiar dengan Tailwind CSS v4 responsive utilities
- [ ] Understand breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)
- [ ] Know mobile-first approach concept
- [ ] Understand dark mode implementation with `dark:` prefix

### Environment Setup
- [ ] Have Tailwind CSS v4 properly configured
- [ ] Can run dev server: `npm run dev`
- [ ] Have DevTools mobile view ready
- [ ] Have multiple devices for testing (or emulators)

### Tools & Extensions
- [ ] VS Code Tailwind CSS IntelliSense extension installed
- [ ] Browser DevTools mobile emulator working
- [ ] Can inspect responsive classes in browser

---

## 🎨 WHEN CREATING A NEW PAGE

### Step 1: Plan Mobile-First
- [ ] Sketch mobile layout first (320px+)
- [ ] Think about touch interactions
- [ ] Plan breakpoint changes (tablet, desktop)

### Step 2: Use Correct Patterns
```jsx
// ✅ Mobile-first approach
<div className="px-4 md:px-6 lg:px-8">
  <h1 className="text-2xl md:text-3xl lg:text-4xl">
    Heading
  </h1>
</div>

// ❌ Don't do
<div className="px-8"> {/* Too much padding on mobile */}
  <h1 className="text-4xl"> {/* Too large on mobile */}
    Heading
  </h1>
</div>
```

### Step 3: Implement Responsive Layouts
```jsx
// ✅ Use flex for responsive layouts
<div className="flex flex-col md:flex-row gap-4 md:gap-6">
  <div className="flex-1">{/* Side 1 */}</div>
  <div className="flex-1">{/* Side 2 */}</div>
</div>

// ✅ Use grid for card layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} />)}
</div>

// ✅ Use hidden/block for showing/hiding
<nav className="hidden md:flex items-center gap-6">
  {/* Desktop nav */}
</nav>
<button className="md:hidden">
  {/* Mobile hamburger */}
</button>
```

### Step 4: Test on Multiple Devices
- [ ] Test on iPhone SE (375px)
- [ ] Test on Android phone (412px)
- [ ] Test on iPad (768px)
- [ ] Test on Desktop (1280px+)
- [ ] Test dark mode
- [ ] Test landscape orientation

### Step 5: Performance Check
- [ ] No horizontal scroll
- [ ] Images load properly
- [ ] Animations smooth
- [ ] No overlapping elements
- [ ] Touch targets 44px+

---

## 🔧 COMMON COMPONENTS CHECKLIST

### When Creating Input Fields
```jsx
// ✅ Proper responsive input
<input
  className="w-full px-4 py-3 md:px-6 md:py-4 
             bg-white dark:bg-white/5 
             border border-black/10 dark:border-white/10 
             rounded-xl focus:outline-none focus:border-brand-red
             text-sm md:text-base transition-colors"
  placeholder="Enter something"
/>

// Checklist:
// ☐ Full width: w-full
// ☐ Responsive padding: px-4 md:px-6
// ☐ Dark mode: bg-white dark:bg-white/5
// ☐ Focus state: focus:outline-none focus:border-brand-red
// ☐ Readable font: text-sm md:text-base
```

### When Creating Buttons
```jsx
// ✅ Proper responsive button
<button
  className="px-4 md:px-6 py-3 md:py-4
             bg-brand-black dark:bg-brand-gold
             text-white dark:text-brand-black
             rounded-xl font-black uppercase tracking-widest
             text-xs md:text-sm
             hover:scale-105 active:scale-95
             transition-all duration-200
             disabled:opacity-50 disabled:cursor-not-allowed
             shadow-lg shadow-brand-red/10"
>
  Click Me
</button>

// Checklist:
// ☐ Responsive sizing: px-4 md:px-6 py-3 md:py-4
// ☐ Min height 44px (for touch): py-3 = 12px + padding
// ☐ Dark mode support: dark:bg-brand-gold
// ☐ Hover/active states: hover:scale-105 active:scale-95
// ☐ Disabled state: disabled:opacity-50
// ☐ Proper contrast on dark mode
```

### When Creating Cards
```jsx
// ✅ Proper responsive card
<div className="p-4 md:p-6 lg:p-8
               bg-white dark:bg-white/5
               border border-black/5 dark:border-white/5
               rounded-2xl
               hover:shadow-lg hover:border-brand-gold/30
               transition-all duration-500
               group">
  <h3 className="text-base md:text-lg font-black
                 text-brand-black dark:text-brand-white
                 mb-2 md:mb-4 uppercase tracking-wider">
    Card Title
  </h3>
  <p className="text-sm text-brand-black/60 dark:text-brand-white/60
                leading-relaxed">
    Card content
  </p>
</div>

// Checklist:
// ☐ Responsive padding: p-4 md:p-6 lg:p-8
// ☐ Dark mode: dark:bg-white/5 dark:border-white/5
// ☐ Responsive typography
// ☐ Hover states
// ☐ Good spacing between elements
// ☐ Proper contrast for readability
```

### When Creating Tables
```jsx
// ✅ Mobile-friendly table approach
<>
  {/* Desktop Table */}
  <div className="hidden md:block overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left px-4 py-3">Column 1</th>
          <th className="text-left px-4 py-3">Column 2</th>
        </tr>
      </thead>
      <tbody>
        {/* Rows */}
      </tbody>
    </table>
  </div>

  {/* Mobile Card View */}
  <div className="md:hidden space-y-4">
    {data.map(item => (
      <div key={item.id} className="p-4 border rounded-lg space-y-2">
        <div className="flex justify-between">
          <span className="text-xs uppercase font-black opacity-60">Column 1</span>
          <span>{item.col1}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs uppercase font-black opacity-60">Column 2</span>
          <span>{item.col2}</span>
        </div>
      </div>
    ))}
  </div>
</>

// Checklist:
// ☐ Hide table on mobile (hidden md:block)
// ☐ Show card layout on mobile (md:hidden)
// ☐ Proper responsive padding
// ☐ Labels for each field in mobile view
// ☐ Actions easily accessible
```

### When Creating Modals
```jsx
// ✅ Mobile-friendly modal
<Dialog
  className="fixed inset-0 flex overflow-y-auto
             px-4 py-6 sm:px-0 items-center z-[999]"
>
  <Dialog.Panel
    className="w-[calc(100%-2rem)] max-w-sm sm:max-w-md
               bg-white dark:bg-brand-black
               rounded-3xl shadow-2xl
               mx-auto transform transition-all"
  >
    {/* Modal content */}
  </Dialog.Panel>
</Dialog>

// Checklist:
// ☐ Responsive width: w-[calc(100%-2rem)]
// ☐ Max width for desktop: max-w-sm sm:max-w-md
// ☐ Padding handling: px-4 py-6 sm:px-0
// ☐ Dark mode support
// ☐ Close button accessible
// ☐ Scrollable on small screens
```

---

## 🚀 PERFORMANCE CHECKLIST

### Before Submitting Pull Request
- [ ] Mobile view tested in DevTools
- [ ] Real device testing completed
- [ ] No console errors
- [ ] No horizontal scroll
- [ ] Images optimized and loading properly
- [ ] Animations smooth (no jank)
- [ ] Dark mode tested
- [ ] Lighthouse mobile score > 80
- [ ] Accessibility checked (tab navigation, contrast)

### Lighthouse Testing
```bash
# Run Lighthouse audit in Chrome DevTools
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Mobile" view
4. Click "Analyze page load"
5. Check score for Performance, Accessibility, Best Practices
```

---

## 🎯 QUICK FIXES CHECKLIST

### Bug: Text is too large on mobile
```jsx
// ❌ Before
<h1 className="text-5xl font-black">Heading</h1>

// ✅ After
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black">
  Heading
</h1>
```

### Bug: Padding too large on mobile
```jsx
// ❌ Before
<div className="p-8">Content</div>

// ✅ After
<div className="p-4 sm:p-6 md:p-8">Content</div>
```

### Bug: Grid not stacking on mobile
```jsx
// ❌ Before
<div className="grid grid-cols-3 gap-6">
  <Item /><Item /><Item />
</div>

// ✅ After
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <Item /><Item /><Item />
</div>
```

### Bug: Table overflowing on mobile
```jsx
// ❌ Before
<table className="w-full">
  {/* Many columns */}
</table>

// ✅ After - Option 1
<div className="overflow-x-auto">
  <table className="w-full whitespace-nowrap">
    {/* Many columns */}
  </table>
</div>

// ✅ After - Option 2 (Better UX)
<div className="hidden md:block">
  {/* Desktop table */}
</div>
<div className="md:hidden space-y-4">
  {/* Mobile cards */}
</div>
```

### Bug: Button not tappable on mobile
```jsx
// ❌ Before
<button className="px-2 py-1 text-xs">
  Tap Me
</button>

// ✅ After
<button className="px-4 py-3 md:px-6 md:py-4 
                   min-h-[44px] md:min-h-auto
                   text-sm md:text-base">
  Tap Me
</button>
```

---

## 📋 CODE REVIEW STANDARDS

When reviewing responsive code, check:

### Layout & Spacing
- [ ] Mobile-first approach used
- [ ] Proper breakpoints applied
- [ ] No hardcoded widths (use flex/grid)
- [ ] Responsive padding/margin
- [ ] Proper gap between elements

### Typography
- [ ] Font sizes responsive (text-sm md:text-base)
- [ ] Line height appropriate
- [ ] Readable on mobile (16px minimum on inputs)
- [ ] Proper heading hierarchy

### Components
- [ ] All form inputs responsive
- [ ] Buttons 44px+ touch target
- [ ] Cards properly stacked on mobile
- [ ] Tables either scrollable or card-layout
- [ ] Modals mobile-friendly

### Dark Mode
- [ ] All dark: classes present
- [ ] Proper contrast maintained
- [ ] No hardcoded colors without dark:

### Interactions
- [ ] Hover states work
- [ ] Focus states visible
- [ ] Touch-friendly
- [ ] No overlapping elements

### Performance
- [ ] No Tailwind bloat
- [ ] Images optimized
- [ ] Animations smooth
- [ ] No excessive re-renders

---

## 🧪 TESTING CHECKLIST

### Manual Testing Steps
```bash
# 1. Desktop Testing
Chrome: 1920x1080, 1440x900
Firefox: Same widths
Safari: Same widths (if Mac)

# 2. Tablet Testing
iPad: 768x1024 (portrait), 1024x768 (landscape)
iPad Pro: 1024x1366

# 3. Mobile Testing
iPhone SE: 375x667
iPhone 12/13: 390x844
iPhone 14/15: 393x852
Pixel 7: 412x915
Galaxy S23: 360x800

# 4. Browser DevTools Mobile Emulator
Chrome DevTools → Device Toolbar (Ctrl+Shift+M)
Test each device from list above

# 5. Real Device Testing
Actual iPhone (if available)
Actual Android phone (if available)
Test on actual 4G/5G connection

# 6. Orientation Testing
Portrait and landscape for each device
Check for layout issues in both orientations
```

### Functional Testing
- [ ] All navigation works on mobile
- [ ] Forms submittable on mobile
- [ ] Tables scrollable if needed
- [ ] Modals dismissible
- [ ] Images load properly
- [ ] Dark mode toggle works
- [ ] No console errors
- [ ] No JavaScript errors

---

## 📱 DEVICE TESTING LOG

Use this template for device testing:

```markdown
## Device Testing Report

**Date:** [Date]  
**Developer:** [Name]  
**Page:** [Page name]

### Device: iPhone SE (375px)
**Status:** ☐ Pass ☐ Fail

**Observations:**
- Navigation: [Working/Not working]
- Text readability: [Good/Poor]
- Button tappable: [Yes/No]
- Images: [Correct/Distorted]
- Dark mode: [Correct/Wrong]

**Issues Found:**
- [Issue 1]
- [Issue 2]

**Screenshots:** [Attach if issue found]

---

## Device: Android Phone (412px)
[Repeat for each device]
```

---

## 🎓 LEARNING RESOURCES

### For Tailwind CSS Responsive
- Official Docs: https://tailwindcss.com/docs/responsive-design
- Breakpoints Guide: https://tailwindcss.com/docs/breakpoints
- Utility-First Approach: https://tailwindcss.com/docs/utility-first

### For Mobile-First Design
- Mobile-First Strategy
- Progressive Enhancement
- Touch-Friendly Design

### For Accessibility
- WCAG Guidelines
- Color Contrast
- Touch Target Size (44px minimum)

---

## 🆘 TROUBLESHOOTING

### Problem: Tailwind classes not applying
```
Solution:
1. Check if file is in content paths in tailwind.config.js
2. Rebuild CSS: npm run dev
3. Clear browser cache
4. Check for typos in class names
```

### Problem: Responsive class not working
```
Solution:
1. Verify breakpoint is correct (sm:, md:, lg:, xl:)
2. Check if class is actually responsive
3. Use DevTools to inspect applied classes
4. Make sure base class is first
```

### Problem: Dark mode not working
```
Solution:
1. Check dark: prefix is used
2. Verify dark mode is enabled in tailwind.config.js
3. Check theme toggle is actually changing class
4. Test in incognito/private window (cache issue)
```

### Problem: Mobile view looks bad
```
Solution:
1. Use DevTools mobile emulator first
2. Test on real device
3. Check for hardcoded widths
4. Verify responsive classes applied
5. Check for overflow issues
```

---

## 📞 GETTING HELP

### Common Issues & Contacts
- **Responsive Layout Issue:** Check with Frontend Lead
- **Tailwind Setup Issue:** Check with DevOps
- **Mobile Testing Device:** Ask QA Team
- **Accessibility Question:** Check with UX Lead

### Resources
- Code Repository: [GitHub Link]
- Figma Designs: [Figma Link]
- Component Storybook: [Storybook Link]
- Team Slack Channel: #frontend-responsive

---

## ✍️ SIGN-OFF BEFORE SUBMISSION

Before submitting PR, complete this checklist:

### Code Quality
- [ ] All responsive classes present
- [ ] No hardcoded widths/heights
- [ ] Mobile-first approach used
- [ ] Dark mode supported
- [ ] No console errors

### Testing
- [ ] DevTools mobile view tested
- [ ] Real device tested (if available)
- [ ] Landscape orientation tested
- [ ] Dark mode tested
- [ ] Lighthouse score acceptable

### Documentation
- [ ] Code commented if complex
- [ ] No debug console.log left
- [ ] Meaningful commit message
- [ ] PR description clear

### Ready for Review
- [ ] All above items checked
- [ ] Ready for code review
- [ ] No blocking issues

---

**Last Updated:** 5 Februari 2026  
**Version:** 1.0  
**Status:** Active & Ready for Use

For questions or updates, contact Frontend Team Lead.
