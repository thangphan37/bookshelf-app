function formatTime(time) {
  if (!time) return ''

  const date = new Date(time)
  return date.toLocaleDateString('en', {year: '2-digit', month: 'short'})
}

export {formatTime}
