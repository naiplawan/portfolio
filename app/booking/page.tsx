import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { ROUTES } from '@/lib/constants/routes';

const timeSlots = [
  { time: '15 minutes', type: 'Quick chat', description: 'Brief introduction or question' },
  { time: '30 minutes', type: 'Consultation', description: 'Project discussion' },
  { time: '45 minutes', type: 'Deep dive', description: 'Technical discussion' },
  { time: '60 minutes', type: 'Full meeting', description: 'Comprehensive consultation' },
];

const topics = [
  { title: 'Project inquiry', description: 'Discuss a new project or opportunity' },
  { title: 'Collaboration', description: 'Explore working together' },
  { title: 'Technical review', description: 'Code review or architecture discussion' },
  { title: 'General inquiry', description: 'Any other questions or opportunities' },
];

const preparation = [
  { title: 'Come prepared with questions', description: 'Share your project details, challenges, and goals beforehand' },
  { title: 'Be on time', description: 'I respect your time and ask the same in return' },
  { title: 'Bring your team', description: 'Feel free to invite stakeholders or decision makers' },
];

const meetingRequestHref = (subject: string) =>
  `${ROUTES.CONTACT}?subject=${encodeURIComponent(subject)}`;

export default function BookingPage() {
  return (
    <div className="container-premium section-padding">
      <SectionHeading as="h1" label="Booking" title="Schedule a call">
        Pick a length that fits, send a short request, and I&apos;ll confirm a
        time that works across our timezones. I usually reply within 24 hours.
      </SectionHeading>

      <section aria-labelledby="durations" className="mb-20 sm:mb-28">
        <h2 id="durations" className="section-label mb-4">01 — Choose a length</h2>
        <ul className="border-t border-[hsl(var(--rule))]">
          {timeSlots.map((slot) => (
            <li key={slot.time} className="border-b border-[hsl(var(--rule))]">
              <Link
                href={meetingRequestHref(`Meeting request: ${slot.time}`)}
                className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-6 sm:grid-cols-[12rem_1fr_auto]"
              >
                <span className="font-display text-3xl tracking-tight transition-colors group-hover:text-[hsl(var(--accent))]">
                  {slot.time}
                </span>
                <span className="col-start-1 text-muted-foreground sm:col-start-2">
                  <span className="text-foreground">{slot.type}</span> — {slot.description}
                </span>
                <ArrowUpRight
                  className="col-start-2 row-start-1 h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:col-start-3"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
        <section aria-labelledby="topics">
          <h2 id="topics" className="section-label mb-4">02 — What we can discuss</h2>
          <dl className="border-t border-[hsl(var(--rule))]">
            {topics.map((topic) => (
              <div key={topic.title} className="border-b border-[hsl(var(--rule))] py-4">
                <dt className="font-medium">{topic.title}</dt>
                <dd className="text-sm text-muted-foreground">{topic.description}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="preparation">
          <h2 id="preparation" className="section-label mb-4">03 — Before we meet</h2>
          <dl className="border-t border-[hsl(var(--rule))]">
            {preparation.map((item) => (
              <div key={item.title} className="border-b border-[hsl(var(--rule))] py-4">
                <dt className="font-medium">{item.title}</dt>
                <dd className="text-sm text-muted-foreground">{item.description}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <Link
        href={meetingRequestHref('Meeting request')}
        className="mt-16 inline-flex h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-sm text-background transition-opacity hover:opacity-85"
      >
        Send a meeting request
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
