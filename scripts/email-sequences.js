// Cold email sequences for restaurant outreach
// Each step has: delay (days after previous), subject, body
// Placeholders: {{name}}, {{city}}, {{review_count}}, {{rating}}

export const sequences = [
  {
    step: 1,
    delayDays: 0,
    subject: "Quick question about {{name}}",
    body: `Hi there,

I came across {{name}} and noticed you have {{review_count}} reviews on Google — clearly you're doing something right.

I had a quick question: how many calls do you think go unanswered during your busiest hours?

We built a phone system that picks up every call for restaurants like yours — takes bookings, answers menu questions, handles cancellations. Runs 24/7, no staff needed.

Would it be worth a 10-minute chat to see if it's a fit?

Best,
Azan
DineLine — getdineline.com`,
  },
  {
    step: 2,
    delayDays: 3,
    subject: "Re: Quick question about {{name}}",
    body: `Just following up on my last note.

One thing I should have mentioned — a restaurant in {{city}} we work with was losing about £1,200/month from calls they couldn't get to during service. Within a week of switching on DineLine, every call was answered and their no-shows dropped by a third.

Happy to show you exactly how it works in 10 minutes if you're curious.

Azan`,
  },
  {
    step: 3,
    delayDays: 4,
    subject: "Re: Quick question about {{name}}",
    body: `Hi — last one from me on this.

If missed calls or phone admin isn't a problem for you, totally ignore this. But if it is, I'd love 10 minutes to show you how DineLine handles it.

Either way, no hard feelings. Wishing {{name}} all the best.

Azan
DineLine — getdineline.com`,
  },
];

export function personalizeEmail(template, restaurant) {
  let subject = template.subject;
  let body = template.body;

  const replacements = {
    "{{name}}": restaurant.name || "your restaurant",
    "{{city}}": restaurant.city || "your area",
    "{{review_count}}": restaurant.review_count ? String(restaurant.review_count) : "great",
    "{{rating}}": restaurant.rating ? String(restaurant.rating) : "",
  };

  for (const [key, value] of Object.entries(replacements)) {
    subject = subject.replaceAll(key, value);
    body = body.replaceAll(key, value);
  }

  return { subject, body };
}
