// Cold email sequences for restaurant outreach
// Multiple sequence variants for A/B testing different angles
// Placeholders: {{name}}, {{city}}, {{review_count}}, {{rating}}, {{booking_link}}
//
// KEY PRINCIPLE: Sell the OUTCOME, not the tech.
// Don't say "AI answers your phone" — say "you're losing £1,200/mo in missed bookings"

const BOOKING_LINK = "https://cal.com/dineline/demo";

// ============================================================
// SEQUENCE A — "Missed Revenue" angle
// Best for: busy restaurants with high review counts
// ============================================================
export const sequenceA = [
  {
    step: 1,
    delayDays: 0,
    subject: "{{name}} — quick maths on missed calls",
    body: `Hi,

I looked up {{name}} — {{review_count}} reviews and a {{rating}} rating. You're clearly running a great place.

Here's what I keep seeing with restaurants at your level: during your busiest hours, around 60% of calls go unanswered. At an average of £80 per table, that's roughly £1,200/month walking out the door.

We help restaurants in {{city}} make sure every single call gets picked up — bookings taken, questions answered, confirmations sent — without your staff lifting the phone.

Worth a quick 15-minute chat to see if the numbers make sense for you?

${BOOKING_LINK}

Azan
DineLine`,
  },
  {
    step: 2,
    delayDays: 3,
    subject: "Re: {{name}} — quick maths on missed calls",
    body: `Just a quick follow-up.

To put it simply: if even 5 missed calls a week turn into bookings, that's an extra £1,600/month in revenue. The service pays for itself many times over.

Happy to walk you through how it'd work specifically for {{name}} — takes 15 minutes.

${BOOKING_LINK}

Azan`,
  },
  {
    step: 3,
    delayDays: 4,
    subject: "Re: {{name}} — quick maths on missed calls",
    body: `Last one from me — I know you're busy.

If missed calls aren't costing you anything, ignore this completely. But if there's even a chance your team is missing bookings during service, it might be worth 15 minutes to see what we can do.

Either way, wishing {{name}} all the best.

${BOOKING_LINK}

Azan
DineLine — getdineline.com`,
  },
];

// ============================================================
// SEQUENCE B — "Staff time" angle
// Best for: smaller restaurants where owner is hands-on
// ============================================================
export const sequenceB = [
  {
    step: 1,
    delayDays: 0,
    subject: "A question for {{name}}",
    body: `Hi,

How much time does your team spend answering the phone each week?

For most restaurants in {{city}}, it's around 20 hours — that's half a full-time employee just picking up calls, taking bookings, answering the same questions about parking and allergies.

We free up that time completely. Every call answered, every booking confirmed, every "do you have vegan options?" handled — 24/7, without interrupting service.

If you're curious how it works, I can show you in 15 minutes:

${BOOKING_LINK}

Azan
DineLine`,
  },
  {
    step: 2,
    delayDays: 3,
    subject: "Re: A question for {{name}}",
    body: `Following up — the reason I reached out is that restaurants like {{name}} with {{review_count}} reviews tend to get a lot of calls.

The ones we work with tell us the biggest change isn't even the extra bookings — it's that their staff can actually focus on the customers in front of them instead of running to the phone mid-service.

15 minutes and I'll show you exactly how it'd work for your place:

${BOOKING_LINK}

Azan`,
  },
  {
    step: 3,
    delayDays: 4,
    subject: "Re: A question for {{name}}",
    body: `Final follow-up — if phones aren't an issue for you, no worries at all.

But if your team is juggling calls during the dinner rush, it might be worth a quick look. Either way, great food and {{review_count}} reviews speaks for itself.

${BOOKING_LINK}

Azan
DineLine — getdineline.com`,
  },
];

// ============================================================
// SEQUENCE C — "Your competitors" angle
// Best for: competitive areas (London, Manchester)
// ============================================================
export const sequenceC = [
  {
    step: 1,
    delayDays: 0,
    subject: "How {{name}} compares on phone bookings",
    body: `Hi,

I've been looking at restaurants in {{city}} and noticed something interesting: the ones growing fastest right now all have one thing in common — they never miss a phone call.

When a customer calls {{name}} and nobody picks up, they don't leave a voicemail. They call the next place on Google. That booking is gone in 10 seconds.

We make sure that never happens. Every call answered on the first ring, bookings taken instantly, confirmation texts sent automatically.

Interested in seeing how it works? 15 minutes:

${BOOKING_LINK}

Azan
DineLine`,
  },
  {
    step: 2,
    delayDays: 3,
    subject: "Re: How {{name}} compares on phone bookings",
    body: `Quick follow-up — I should mention this isn't some generic call centre.

When someone calls, they hear a voice that knows your menu, your hours, your booking rules. It sounds like someone who actually works at {{name}} — because we train it specifically on your restaurant.

Worth seeing for yourself? 15 minutes:

${BOOKING_LINK}

Azan`,
  },
  {
    step: 3,
    delayDays: 4,
    subject: "Re: How {{name}} compares on phone bookings",
    body: `Last note — if you're happy with how calls are handled at {{name}}, totally fair.

But if there's any chance you're losing bookings to missed calls, especially during peak hours, I'd love to show you what we've built. 15 minutes, no pressure.

${BOOKING_LINK}

Azan
DineLine — getdineline.com`,
  },
];

// ============================================================
// SEQUENCE D — "I noticed your reviews" personalised angle
// Best for: restaurants with specific review mentions about phone/booking issues
// ============================================================
export const sequenceD = [
  {
    step: 1,
    delayDays: 0,
    subject: "Noticed something about {{name}}",
    body: `Hi,

I was looking through {{name}}'s reviews — {{review_count}} reviews at {{rating}} stars is seriously impressive for {{city}}.

One pattern I keep seeing with popular restaurants like yours: the better your food gets, the more calls you get, and the harder it becomes to answer them all. It's a good problem to have — but it's still costing you money.

We solve that specific problem. Every call picked up, every booking handled, every customer looked after — even at 2am or during Saturday night service.

Worth a quick 15-minute demo?

${BOOKING_LINK}

Azan
DineLine`,
  },
  {
    step: 2,
    delayDays: 3,
    subject: "Re: Noticed something about {{name}}",
    body: `Just following up — here's the simplest way to think about it:

Right now, when someone calls {{name}} and you can't pick up, that's a lost booking. With DineLine, that call gets answered, the booking gets made, the customer gets a confirmation text. All in about 23 seconds.

You don't change anything about how you run your restaurant. You just stop losing bookings.

15 minutes and I'll show you the whole thing live:

${BOOKING_LINK}

Azan`,
  },
  {
    step: 3,
    delayDays: 4,
    subject: "Re: Noticed something about {{name}}",
    body: `Last one from me.

If you'd like to see how {{name}} could handle every single phone call without your staff picking up the phone, I'm here. If not, no hard feelings — keep up the great work.

${BOOKING_LINK}

Azan
DineLine — getdineline.com`,
  },
];

// ============================================================
// SEQUENCE E — "No-shows" angle
// Best for: mid-to-high-end restaurants
// ============================================================
export const sequenceE = [
  {
    step: 1,
    delayDays: 0,
    subject: "Cutting no-shows at {{name}}",
    body: `Hi,

What's your no-show rate at {{name}}? For most restaurants in {{city}}, it's around 15-20% — that's 1 in 5 tables sitting empty because someone forgot they booked.

We've been helping restaurants fix this with automatic confirmation texts and day-before reminders sent to every customer who books. Restaurants we work with see no-shows drop by a third within the first month.

On top of that, every call gets answered, every booking gets taken properly, and your staff doesn't have to touch the phone.

Worth 15 minutes to see how it works?

${BOOKING_LINK}

Azan
DineLine`,
  },
  {
    step: 2,
    delayDays: 3,
    subject: "Re: Cutting no-shows at {{name}}",
    body: `Quick follow-up on this.

The maths: if you do 200 covers a week and no-shows drop from 20% to 12%, that's 16 extra covers a week. At £40 average spend, that's £2,500/month in revenue you're currently leaving on the table.

Happy to walk through the numbers for {{name}} specifically — 15 minutes:

${BOOKING_LINK}

Azan`,
  },
  {
    step: 3,
    delayDays: 4,
    subject: "Re: Cutting no-shows at {{name}}",
    body: `Last note — if no-shows aren't a problem for {{name}}, fair enough.

But if empty tables from forgotten bookings are costing you money, it's worth a quick look. Either way, all the best.

${BOOKING_LINK}

Azan
DineLine — getdineline.com`,
  },
];

// ============================================================
// All sequences for A/B testing
// ============================================================
export const allSequences = {
  A: { name: "Missed Revenue", sequences: sequenceA },
  B: { name: "Staff Time", sequences: sequenceB },
  C: { name: "Competitors", sequences: sequenceC },
  D: { name: "Reviews Personalised", sequences: sequenceD },
  E: { name: "No-Shows", sequences: sequenceE },
};

// Default sequence (used by email-sender.js)
export const sequences = sequenceA;

export function personalizeEmail(template, restaurant) {
  let subject = template.subject;
  let body = template.body;

  const replacements = {
    "{{name}}": restaurant.name || "your restaurant",
    "{{city}}": restaurant.city || "your area",
    "{{review_count}}": restaurant.review_count ? String(restaurant.review_count) : "great",
    "{{rating}}": restaurant.rating ? String(restaurant.rating) : "high",
  };

  for (const [key, value] of Object.entries(replacements)) {
    subject = subject.replaceAll(key, value);
    body = body.replaceAll(key, value);
  }

  return { subject, body };
}
