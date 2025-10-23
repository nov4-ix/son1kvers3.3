/**
 * Formatting utilities for SON1KVERS3 platform
 */

/**
 * Format duration in human readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Format date relative to now
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
}

/**
 * Format date in localized format
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(date);
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Format musical key
 */
export function formatMusicalKey(key: string): string {
  const keyMap: Record<string, string> = {
    'C': 'C major',
    'C#': 'C# major',
    'Db': 'Db major',
    'D': 'D major',
    'D#': 'D# major',
    'Eb': 'Eb major',
    'E': 'E major',
    'F': 'F major',
    'F#': 'F# major',
    'Gb': 'Gb major',
    'G': 'G major',
    'G#': 'G# major',
    'Ab': 'Ab major',
    'A': 'A major',
    'A#': 'A# major',
    'Bb': 'Bb major',
    'B': 'B major',
    'Cm': 'C minor',
    'C#m': 'C# minor',
    'Dbm': 'Db minor',
    'Dm': 'D minor',
    'D#m': 'D# minor',
    'Ebm': 'Eb minor',
    'Em': 'E minor',
    'Fm': 'F minor',
    'F#m': 'F# minor',
    'Gbm': 'Gb minor',
    'Gm': 'G minor',
    'G#m': 'G# minor',
    'Abm': 'Ab minor',
    'Am': 'A minor',
    'A#m': 'A# minor',
    'Bbm': 'Bb minor',
    'Bm': 'B minor'
  };

  return keyMap[key] || key;
}

/**
 * Format BPM
 */
export function formatBPM(bpm: number): string {
  return `${Math.round(bpm)} BPM`;
}

/**
 * Format genre for display
 */
export function formatGenre(genre: string): string {
  return genre
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format mood for display
 */
export function formatMood(mood: string): string {
  return mood
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format username for display
 */
export function formatUsername(username: string): string {
  return username.startsWith('@') ? username : `@${username}`;
}

/**
 * Format hashtag
 */
export function formatHashtag(tag: string): string {
  return tag.startsWith('#') ? tag : `#${tag}`;
}

/**
 * Format track title
 */
export function formatTrackTitle(title: string): string {
  return title
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

/**
 * Format description text
 */
export function formatDescription(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: string | Error): string {
  if (typeof error === 'string') return error;

  return error.message || 'An unknown error occurred';
}

/**
 * Format API error for display
 */
export function formatAPIError(error: { code?: string; message: string; details?: any }): string {
  if (error.code) {
    return `${error.code}: ${error.message}`;
  }
  return error.message;
}

/**
 * Format collaboration status
 */
export function formatCollaborationStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'DRAFT': 'Draft',
    'ACTIVE': 'Active',
    'COMPLETED': 'Completed',
    'ARCHIVED': 'Archived'
  };

  return statusMap[status] || status;
}

/**
 * Format user tier
 */
export function formatUserTier(tier: string): string {
  const tierMap: Record<string, string> = {
    'FREE': 'Free',
    'PREMIUM': 'Premium',
    'ENTERPRISE': 'Enterprise'
  };

  return tierMap[tier] || tier;
}

/**
 * Format NFT status
 */
export function formatNFTStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'MINTING': 'Minting',
    'AVAILABLE': 'Available',
    'SOLD': 'Sold',
    'AUCTION': 'In Auction'
  };

  return statusMap[status] || status;
}

/**
 * Format generation status
 */
export function formatGenerationStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'PENDING': 'Pending',
    'PROCESSING': 'Processing',
    'COMPLETED': 'Completed',
    'FAILED': 'Failed'
  };

  return statusMap[status] || status;
}

/**
 * Format audio quality
 */
export function formatAudioQuality(quality: string): string {
  const qualityMap: Record<string, string> = {
    'low': 'Low Quality',
    'medium': 'Medium Quality',
    'high': 'High Quality',
    'lossless': 'Lossless'
  };

  return qualityMap[quality] || quality;
}

/**
 * Format social count (likes, followers, etc.)
 */
export function formatSocialCount(count: number): string {
  if (count < 1000) {
    return count.toString();
  }

  if (count < 1000000) {
    return `${(count / 1000).toFixed(1)}K`;
  }

  return `${(count / 1000000).toFixed(1)}M`;
}

/**
 * Format play count
 */
export function formatPlayCount(count: number): string {
  return formatSocialCount(count) + (count === 1 ? ' play' : ' plays');
}

/**
 * Format like count
 */
export function formatLikeCount(count: number): string {
  return formatSocialCount(count) + (count === 1 ? ' like' : ' likes');
}

/**
 * Format comment count
 */
export function formatCommentCount(count: number): string {
  return formatSocialCount(count) + (count === 1 ? ' comment' : ' comments');
}

/**
 * Format follower count
 */
export function formatFollowerCount(count: number): string {
  return formatSocialCount(count) + (count === 1 ? ' follower' : ' followers');
}

/**
 * Format following count
 */
export function formatFollowingCount(count: number): string {
  return formatSocialCount(count) + (count === 1 ? ' following' : ' following');
}

/**
 * Format share count
 */
export function formatShareCount(count: number): string {
  return formatSocialCount(count) + (count === 1 ? ' share' : ' shares');
}

/**
 * Format view count
 */
export function formatViewCount(count: number): string {
  return formatSocialCount(count) + (count === 1 ? ' view' : ' views');
}

/**
 * Format download count
 */
export function formatDownloadCount(count: number): string {
  return formatSocialCount(count) + (count === 1 ? ' download' : ' downloads');
}

/**
 * Format collaboration participant count
 */
export function formatParticipantCount(count: number): string {
  return formatSocialCount(count) + (count === 1 ? ' participant' : ' participants');
}

/**
 * Format track length
 */
export function formatTrackLength(minutes: number, seconds: number): string {
  if (minutes === 0) {
    return `${seconds}s`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format audio bitrate
 */
export function formatBitrate(bitrate: number): string {
  return `${bitrate} kbps`;
}

/**
 * Format sample rate
 */
export function formatSampleRate(sampleRate: number): string {
  return `${formatNumber(sampleRate)} Hz`;
}

/**
 * Format frequency
 */
export function formatFrequency(frequency: number): string {
  if (frequency >= 1000) {
    return `${(frequency / 1000).toFixed(1)} kHz`;
  }
  return `${Math.round(frequency)} Hz`;
}

/**
 * Format decibel level
 */
export function formatDecibels(level: number): string {
  return `${level.toFixed(1)} dB`;
}

/**
 * Format timecode (SMPTE format)
 */
export function formatTimecode(seconds: number, frameRate: number = 30): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const frames = Math.floor((seconds % 1) * frameRate);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
}

/**
 * Format slug from title
 */
export function formatSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Format search query for display
 */
export function formatSearchQuery(query: string): string {
  return query.trim().replace(/\s+/g, ' ');
}

/**
 * Format tag for display
 */
export function formatTag(tag: string): string {
  return tag
    .replace(/[#@]/g, '') // Remove # and @ symbols
    .trim();
}

/**
 * Format notification message
 */
export function formatNotificationMessage(type: string, data: any): string {
  const templates: Record<string, string> = {
    'like': '{user} liked your track',
    'comment': '{user} commented on your track',
    'follow': '{user} started following you',
    'collaboration_invite': '{user} invited you to collaborate',
    'collaboration_update': '{user} updated the collaboration',
    'mention': '{user} mentioned you in a post',
    'achievement': 'You earned the {achievement} achievement!',
    'generation_complete': 'Your music generation is complete',
    'subscription_upgrade': 'Your subscription has been upgraded'
  };

  const template = templates[type] || '{user} interacted with your content';
  return template.replace(/{(\w+)}/g, (match, key) => {
    return data[key] || match;
  });
}

/**
 * Format analytics metric
 */
export function formatAnalyticsMetric(value: number, type: string): string {
  switch (type) {
    case 'percentage':
      return formatPercentage(value);
    case 'currency':
      return formatCurrency(value);
    case 'duration':
      return formatDuration(value);
    case 'count':
      return formatNumber(value);
    default:
      return value.toString();
  }
}

/**
 * Format progress percentage
 */
export function formatProgress(percentage: number): string {
  return `${Math.round(percentage)}%`;
}

/**
 * Format remaining time
 */
export function formatRemainingTime(seconds: number): string {
  if (seconds <= 0) return 'Complete';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s remaining`;
  }

  return `${minutes}m ${remainingSeconds}s remaining`;
}

/**
 * Format elapsed time
 */
export function formatElapsedTime(seconds: number): string {
  return formatDuration(seconds) + ' elapsed';
}

/**
 * Format memory usage
 */
export function formatMemoryUsage(bytes: number): string {
  return formatFileSize(bytes);
}

/**
 * Format CPU usage
 */
export function formatCPUUsage(percentage: number): string {
  return formatProgress(percentage) + ' CPU';
}

/**
 * Format network speed
 */
export function formatNetworkSpeed(bytesPerSecond: number): string {
  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
  let speed = bytesPerSecond;
  let unitIndex = 0;

  while (speed >= 1024 && unitIndex < units.length - 1) {
    speed /= 1024;
    unitIndex++;
  }

  return `${speed.toFixed(1)} ${units[unitIndex]}`;
}
