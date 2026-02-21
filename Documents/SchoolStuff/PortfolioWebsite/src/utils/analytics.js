// Analytics utility for tracking user interactions
class Analytics {
  constructor() {
    this.isInitialized = false;
  }

  init() {
    // Initialize Google Analytics if needed
    if (typeof window !== 'undefined' && window.gtag) {
      this.isInitialized = true;
    }
    // You can add other analytics providers here
  }

  trackEvent(category, action, label = '', value = 0) {
    if (typeof window === 'undefined') return;

    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', { category, action, label, value });
    }
  }

  trackPageView(path) {
    if (typeof window === 'undefined') return;

    if (window.gtag) {
      window.gtag('config', 'G-XXXXXXXXXX', { // Replace with your GA4 ID
        page_path: path
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Page View:', path);
    }
  }

  trackProjectView(projectTitle) {
    this.trackEvent('Projects', 'view', projectTitle);
  }

  trackProjectClick(projectTitle, linkType) {
    this.trackEvent('Projects', 'click', `${projectTitle} - ${linkType}`);
  }

  trackSectionView(sectionName) {
    this.trackEvent('Navigation', 'section_view', sectionName);
  }

  trackCyberModeToggle(enabled) {
    this.trackEvent('Interaction', 'cyber_mode_toggle', enabled ? 'enabled' : 'disabled');
  }

  trackModelView(modelName) {
    this.trackEvent('3D Models', 'view', modelName);
  }
}

export const analytics = new Analytics();
