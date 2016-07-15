
/**
 * send a custom event to Google Analytics tracking
 * Documentation on these parameters can be found at: https://developers.google.com/analytics/devguides/collection/analyticsjs/events
 * A typical call would use just the category and action ( strings ) e.g.
 * track('Project', 'New Project', 'Via Menu')
 */
export default function track(category, action, label, value, non_interaction) {
  // only send if in production env and google analytics is present
  if (process.env.NODE_ENV === 'production') {
    if (typeof ga === 'function') {
      ga('send', 'event', category, action, label, value, non_interaction);
    }
  }
}

/*
  list any common categories, actions and labels you are using:

   category             action               label
   --------             ------
   Authentication       Sign Up
   Authentication       Sign In

*/
