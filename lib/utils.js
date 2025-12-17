export function formatDate(date) {
  if (!date) return ''
  try {
    // Use ISO string parsing for consistency
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    
    // Always use en-US locale for consistency between server and client
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC' // Use UTC to avoid timezone differences
    })
  } catch (error) {
    return ''
  }
}

export function formatRelativeTime(date) {
  if (!date) return null
  
  const now = new Date()
  const target = new Date(date)
  const diffInMs = target - now
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays < 0) return 'Expired'
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Tomorrow'
  if (diffInDays <= 7) return `${diffInDays} days`
  if (diffInDays <= 30) return `${Math.ceil(diffInDays / 7)} weeks`
  return `${Math.ceil(diffInDays / 30)} months`
}

export function getStatusColor(status) {
  const colors = {
    discovered: 'gray',
    applied: 'blue',
    assessment: 'yellow',
    interview: 'purple',
    offer: 'green',
    rejected: 'red',
  }
  return colors[status] || 'gray'
}

export function truncate(str, length = 100) {
  if (!str) return ''
  if (str.length <= length) return str
  return str.substring(0, length) + '...'
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
