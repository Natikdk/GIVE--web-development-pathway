const path = require('path');


const envPath = path.join(__dirname, '../.env');
require('dotenv').config({ path: envPath });

console.log('Environment file path:', envPath);
console.log('MONGO_URI loaded?', !!process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
    console.error(' ERROR: MONGO_URI is not defined!');
    process.exit(1);
}

const mongoose = require('mongoose');
const Lesson = require('../src/models/Lesson');


const cssLessonData = {
  topic: 'CSS',
  slug: 'css',
  sections: [
    {
      title: 'Lesson 1: CSS Foundations',
      anchor: 'css-foundations',
      content: `CSS (Cascading Style Sheets) serves as the artistic voice of web development, transforming raw HTML structures into visually compelling experiences. This foundational lesson introduces you to the very essence of CSS—how it works, why it's essential, and the core principles that govern its behavior. You'll begin by understanding the relationship between HTML and CSS, recognizing that while HTML creates the skeleton of a webpage, CSS provides the skin, muscles, and clothing that give it personality and appeal. The concept of "cascading" forms the heart of CSS's power. This principle determines how styles are applied when multiple rules could affect the same element. Imagine pouring different colors of paint onto a canvas—the last color applied might dominate, but transparency and layering create the final visual result. Similarly, CSS follows specific cascading rules based on source order, specificity, and importance. You'll learn how styles inherit from parent elements to children, creating efficient styling patterns while understanding when and how to override these inherited properties. Selectors represent your first practical skill in CSS mastery. These patterns allow you to target specific elements on a page with surgical precision. From simple element selectors that style all paragraphs or headings to class and ID selectors that pinpoint individual elements, you'll develop the vocabulary to speak directly to your HTML. Understanding selectors is akin to learning how to address different people in a crowd—some by their job title, others by their name tag, and some by their relationship to those around them. The box model represents perhaps the most critical concept in CSS foundations. Every element on a webpage exists within an invisible rectangular container with distinct layers: content, padding, borders, and margins. These layers interact in predictable yet sometimes surprising ways, influencing how elements occupy space and relate to their neighbors. Mastering the box model enables you to create balanced layouts, consistent spacing, and harmonious visual relationships between elements—the difference between a cramped, chaotic page and one that breathes with intentional white space.`
    },
    {
      title: 'Lesson 2: Layout Systems',
      anchor: 'layout-systems',
      content: `Modern web layout represents a journey from restrictive table-based designs to fluid, responsive systems that adapt to countless screen sizes. This lesson guides you through the evolution and current state of CSS layout techniques, beginning with traditional methods before progressing to modern solutions. You'll first explore normal document flow—the default behavior where elements stack vertically like blocks or flow inline like text. Understanding this baseline behavior is crucial because all layout techniques essentially modify or override this natural flow. Flexbox revolutionized how developers approach one-dimensional layouts, whether horizontal rows or vertical columns. This system introduces an intelligent container that dynamically distributes space among its children, aligning and justifying them with remarkable flexibility. Learning Flexbox involves understanding a dual-axis system where items can grow, shrink, and reorder themselves based on available space. It's particularly powerful for navigation menus, card layouts, and any interface component where items need to maintain consistent spacing and alignment regardless of their content size. CSS Grid takes layout to the next dimension, allowing precise control over both rows and columns simultaneously. Unlike Flexbox's linear approach, Grid enables true two-dimensional layouts where elements can span multiple tracks and align in complex patterns. You'll learn to think in terms of grid lines, tracks, and areas—creating sophisticated magazine-like layouts with overlapping elements and asymmetrical designs. Grid's explicit control makes it ideal for overall page structures, dashboard interfaces, and any layout requiring precise placement that maintains coherence across different viewport sizes. Positioning techniques provide the fine-tuning tools within broader layout systems. Absolute positioning removes elements from normal flow, placing them precisely relative to a positioned ancestor. Fixed positioning anchors elements to the viewport, creating persistent headers or navigation bars. Sticky positioning offers a hybrid approach where elements behave normally until reaching a threshold, then become fixed. Understanding when and how to use these positioning contexts enables you to create layered interfaces with foreground elements that don't disrupt the underlying layout structure.`
    },
    {
      title: 'Lesson 3: Responsiveness',
      anchor: 'responsiveness',
      content: `The proliferation of mobile devices transformed web design from fixed-width desktop experiences to fluid interfaces that must accommodate screens ranging from smartwatches to television displays. Responsive design represents both a technical discipline and a philosophical approach to building websites that work beautifully everywhere. This lesson begins with media queries—conditional CSS rules that apply only when certain conditions are met, typically relating to viewport dimensions, device orientation, or display capabilities. You'll learn to think in terms of breakpoints where layout adjustments become necessary rather than targeting specific devices. Fluid typography and spacing represent the cornerstone of truly responsive experiences. Rather than using fixed pixel values, you'll explore relative units like percentages, viewport units (vw, vh), and the increasingly important rem unit based on root font size. These relative measurements create interfaces where elements scale proportionally rather than abruptly changing at breakpoints. You'll learn techniques for establishing vertical rhythm—consistent spacing between text elements—that maintains readability and aesthetic harmony regardless of screen size. Mobile-first design methodology flips traditional thinking by starting with the most constrained environment (mobile) and progressively enhancing for larger screens. This approach forces prioritization of essential content and functionality while naturally encouraging performance-conscious design decisions. You'll practice designing interfaces where touch targets are appropriately sized, navigation adapts to thumb-friendly patterns, and content hierarchy remains clear even when visual real estate is limited. The mobile-first philosophy extends beyond technical implementation to influence how you conceptualize and structure entire projects. Accessibility considerations intertwine deeply with responsive design principles. A truly responsive website must respond not just to different screen sizes but also to diverse user needs and interaction methods. You'll learn how proper contrast ratios, scalable text, and keyboard navigability create interfaces that serve users with visual impairments, motor limitations, or situational constraints (like bright sunlight). Responsive design thus becomes an exercise in universal design—creating experiences that adapt not only to devices but to human variability itself.`
    },
    {
      title: 'Lesson 4: Visual Enhancement',
      anchor: 'visual-enhancement',
      content: `CSS transforms structural layouts into aesthetically pleasing experiences through sophisticated control over visual presentation. This lesson explores the artistic dimension of CSS, beginning with color theory as implemented in digital interfaces. You'll move beyond simple named colors to hexadecimal, RGB, and HSL color models, learning how each system offers different advantages for manipulation and consistency. Modern CSS introduces even more powerful options like LAB and LCH color spaces that better match human perception, along with color functions for dynamic theming and accessibility compliance. Typography represents one of the most influential aspects of interface design, with CSS providing extensive control over font selection, sizing, spacing, and rendering. You'll explore web font implementation—understanding the trade-offs between system fonts, hosted fonts, and variable fonts. Beyond mere font loading, you'll learn typographic principles like establishing vertical rhythm, creating harmonious scale relationships, and implementing responsive typography that maintains readability across devices. CSS offers nuanced controls for kerning, ligatures, and font feature settings that can transform functional text into beautiful textual experiences. Visual effects and animations bring interfaces to life through motion and transformation. CSS transitions create smooth property changes between states, while keyframe animations enable complex multi-step sequences without JavaScript. You'll learn performance-conscious animation techniques that utilize the GPU for smooth rendering while avoiding common pitfalls that cause jank or layout thrashing. Modern CSS introduces sophisticated filter effects, blend modes, and backdrop filters that enable photographic adjustments and creative compositing directly in the browser. Advanced selectors and pseudo-classes allow you to create rich interactive states and target elements based on their position, state, or content. You'll learn how to style elements based on user interaction (hover, focus, active), structural position (first-child, nth-of-type), or even content characteristics (attributes, empty state). Combined with custom properties (CSS variables), these techniques enable you to create dynamic, maintainable stylesheets where values cascade not just through the document but through time and state changes, creating cohesive design systems rather than disjointed style collections.`
    },
    {
      title: 'Lesson 5: Advanced Techniques and Modern Workflows',
      anchor: 'advanced-techniques-and-modern-workflows',
      content: `Modern CSS development extends far beyond styling individual elements to encompass systematic approaches for building and maintaining complex interfaces. This final lesson introduces methodologies and techniques that distinguish professional CSS implementations from basic styling. CSS architecture represents the first consideration—you'll explore methodologies like BEM (Block Element Modifier), SMACSS, and ITCSS that provide organizational frameworks for large-scale projects. These systems establish naming conventions, file structures, and specificity management strategies that prevent stylesheet bloat and ensure long-term maintainability. CSS custom properties (variables) revolutionize how values cascade through stylesheets, enabling dynamic theming, consistent spacing systems, and runtime value adjustments. Unlike preprocessor variables that resolve during compilation, CSS variables live in the browser and can be manipulated with JavaScript, creating new possibilities for user customization and theme switching. You'll learn to establish design tokens—centralized values for colors, spacing, typography, and other design decisions—that create visual consistency while simplifying global design changes. Modern layout techniques continue evolving with features like subgrid, container queries, and layers. Subgrid allows nested grids to align with their parent grid, creating deeply consistent layouts. Container queries (a long-anticipated feature) enable components to adapt based on their own available space rather than the viewport, creating truly modular, context-aware designs. CSS layers introduce a new cascade origin that provides explicit control over specificity battles, allowing framework styles, component styles, and utility styles to coexist without constant specificity escalation. Performance optimization and tooling complete your CSS education. You'll learn techniques for efficient CSS delivery like critical CSS extraction, tree shaking unused styles, and leveraging browser caching strategies. Modern tooling—from build processes that auto-prefix properties for browser compatibility to linters that enforce code standards—transforms CSS from a manual styling language to a sophisticated part of the development pipeline. You'll also explore the growing intersection between CSS and JavaScript through CSS-in-JS libraries and frameworks that bridge the gap between component architecture and styling concerns, representing the cutting edge of how modern web applications manage presentation logic. Each lesson builds upon the previous, taking you from understanding how individual elements receive their visual appearance to architecting entire design systems that scale across projects and development teams. This comprehensive approach ensures you not only know CSS syntax but understand how to apply CSS principles to create maintainable, performant, and beautiful web experiences.`
    }
  ]
};
const seedDatabase = async () => {
  try {
    console.log(' Starting database seeding...');
    console.log('Mongoose version:', mongoose.version);
    
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log(' MongoDB connected successfully');
    
    
    const deleteResult = await Lesson.deleteMany({ slug: 'css' });
    console.log(` Deleted ${deleteResult.deletedCount} existing CSS lessons`);
    
    const cssLesson = new Lesson(cssLessonData);
    await cssLesson.save();
    
    console.log('CSS lesson seeded successfully!');
    console.log(`Lesson ID: ${cssLesson._id}`);
    console.log(`Slug: ${cssLesson.slug}`);
    console.log(`Sections: ${cssLesson.sections.length}`);
    
    
    const verifyLesson = await Lesson.findOne({ slug: 'css' });
    console.log(`Verification: Found lesson "${verifyLesson.topic}" with ${verifyLesson.sections.length} sections`);
    
  } catch (error) {
    console.error(' SEEDING FAILED:', error.message);
    console.error('Full error:', error);
    
    if (error.message.includes('timed out')) {
      console.log('\n TROUBLESHOOTING:');
      console.log('1. Check your internet connection');
      console.log('2. Make sure MongoDB Atlas cluster is running');
      console.log('3. Whitelist your IP in MongoDB Atlas:');
      console.log('   - Go to MongoDB Atlas → Network Access');
      console.log('   - Click "Add IP Address"');
      console.log('   - Add "0.0.0.0/0" for all IPs (less secure)');
      console.log('   - Or add your current IP');
    }
    
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.log('\n🔑 Authentication error - check:');
      console.log('1. Username: nad_db_user');
      console.log('2. Password is correct');
      console.log('3. User has proper permissions in MongoDB Atlas');
    }
    
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log(' Connection closed');
    }
    process.exit(0);
  }
};

seedDatabase();