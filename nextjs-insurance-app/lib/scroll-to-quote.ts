/**
 * Scroll smoothly to the quote widget with highlight animation
 * If not on home page, navigates to home first
 */
export function scrollToQuoteWidget() {
  // Check if we're on the home page
  const isHomePage = window.location.pathname === '/';
  
  if (!isHomePage) {
    // Navigate to home page with hash
    window.location.href = '/#cotizar';
    return;
  }
  
  // If already on home, dispatch custom event that QuickQuoteWidget listens to
  window.dispatchEvent(new CustomEvent("scroll-to-quote"));
  
  // Update URL hash without triggering page jump
  if (window.history.replaceState) {
    window.history.replaceState(null, "", "#cotizar");
  }
}
