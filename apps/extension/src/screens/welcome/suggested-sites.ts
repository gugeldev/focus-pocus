// The welcome screen's suggestions, all picked at first. Each `url` is saved to
// the blocklist as is, and the blocklist matches substrings (AGENTS.md section
// 2.2), so an entry must not be part of an unrelated address: that is why X is
// missing ("x.com" is in "netflix.com").

export type SuggestedSite = { name: string; url: string };

export const suggestedSites: SuggestedSite[] = [
  { name: 'YouTube', url: 'youtube.com' },
  { name: 'Instagram', url: 'instagram.com' },
  { name: 'TikTok', url: 'tiktok.com' },
  { name: 'Facebook', url: 'facebook.com' },
  { name: 'Reddit', url: 'reddit.com' },
  { name: 'Netflix', url: 'netflix.com' },
  { name: 'Twitch', url: 'twitch.tv' },
  { name: 'Pinterest', url: 'pinterest.com' },
];
