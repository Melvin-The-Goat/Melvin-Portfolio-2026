/**
 * Optional GA4 when VITE_GA_MEASUREMENT_ID is set in env; otherwise no-ops.
 */
function sendToGtag(...args) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
}

export const analytics = {
  init() {
    const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (!id || typeof document === 'undefined') return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtagPush() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: false });
  },

  trackPageView(path) {
    const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (!id) return;
    sendToGtag('config', id, {
      page_path: path,
      page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    });
  },

  trackSectionView(sectionId) {
    sendToGtag('event', 'section_view', { section_id: sectionId });
  },

  trackProjectView(projectTitle) {
    sendToGtag('event', 'project_view', { project_title: projectTitle });
  },

  trackCyberModeToggle(enabled) {
    sendToGtag('event', 'cyber_mode_toggle', { enabled });
  },
};
