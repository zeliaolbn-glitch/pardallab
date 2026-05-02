export function getWhatsAppUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export function getTelegramUrl(text: string) {
  return `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`
}
