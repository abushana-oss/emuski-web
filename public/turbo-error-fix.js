/**
 * Turbopack Production Error Fix
 * Addresses connection closed errors and chunk loading issues
 */

// Simple error handler without complex features
window.addEventListener('error', function(event) {
  if (event.message && event.message.includes('Connection closed')) {
    // Reload once on connection error
    if (!window.__reloadAttempted) {
      window.__reloadAttempted = true;
      setTimeout(function() {
        window.location.reload();
      }, 1000);
    }
  }
});

window.addEventListener('unhandledrejection', function(event) {
  if (event.reason && event.reason.message && event.reason.message.includes('Connection closed')) {
    // Prevent the error from showing
    event.preventDefault();
    // Reload once on connection error
    if (!window.__reloadAttempted) {
      window.__reloadAttempted = true;
      setTimeout(function() {
        window.location.reload();
      }, 1000);
    }
  }
});