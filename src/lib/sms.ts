import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const FROM = process.env.TWILIO_PHONE_NUMBER!

export async function sendBookingConfirmation(
  to: string,
  name: string,
  date: string,
  time: string,
  partySize: number,
  restaurantName: string
) {
  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long'
  })
  const formattedTime = formatTime(time)

  try {
    await client.messages.create({
      to: normalizePhone(to),
      from: FROM,
      body: `Hi ${name}! Your reservation at ${restaurantName} is confirmed.\n\n📅 ${formattedDate}\n⏰ ${formattedTime}\n👥 ${partySize} guest${partySize > 1 ? 's' : ''}\n\nTo cancel or modify, call us at ${FROM}.\n\nSee you soon!`
    })
  } catch (err) {
    console.error('SMS confirmation failed:', err)
  }
}

export async function sendBookingCancellation(
  to: string,
  name: string,
  date: string,
  time: string,
  restaurantName: string
) {
  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long'
  })
  const formattedTime = formatTime(time)

  try {
    await client.messages.create({
      to: normalizePhone(to),
      from: FROM,
      body: `Hi ${name}, your reservation at ${restaurantName} on ${formattedDate} at ${formattedTime} has been cancelled.\n\nWe'd love to see you another time! Call us at ${FROM} to rebook.`
    })
  } catch (err) {
    console.error('SMS cancellation failed:', err)
  }
}

function formatTime(time: string): string {
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${m} ${ampm}`
}

function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-()]/g, '')
  // UK numbers: convert 07xxx to +447xxx
  if (cleaned.startsWith('07') && cleaned.length === 11) {
    cleaned = '+44' + cleaned.slice(1)
  }
  // Ensure + prefix
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned
  }
  return cleaned
}
