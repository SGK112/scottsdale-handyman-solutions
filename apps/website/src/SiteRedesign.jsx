import React from 'react';
import {
  Wrench, Hammer, Home, HardHat, Siren, CalendarCheck,
  Phone, Mail, MapPin, Check, ShieldCheck, Star, Clock,
  BadgeCheck, Percent, CalendarClock, XCircle, ArrowRight,
} from 'lucide-react';
import { servicePackages, testimonials } from './data';
import { BUSINESS_PHONE, BUSINESS_PHONE_HREF } from './leadCapture';

const PACKAGE_ICONS = {
  'Quick Fix': Wrench,
  'Handyman Essentials': Hammer,
  'Home Improvement Pro': Home,
  'Complete Renovation': HardHat,
  'Emergency Service': Siren,
  'Monthly Maintenance': CalendarCheck,
};

const byName = (name) => servicePackages.find((p) => p.name === name);

const NAV = [
  { href: '#plan', label: 'Maintenance plan' },
  { href: '#jobs', label: 'One-off jobs' },
  { href: '#emergency', label: 'Emergency' },
  { href: '#reviews', label: 'Reviews' },
];

const WHY = [
  { icon: BadgeCheck, title: 'Experienced & vetted', body: 'Every technician is background-checked and knows the trade properly.' },
  { icon: ShieldCheck, title: 'Licensed, bonded & insured', body: 'Fully covered in the State of Arizona. Proof available on request.' },
  { icon: Percent, title: 'Transparent pricing', body: 'You get the price before we start. No surprises on the invoice.' },
  { icon: Clock, title: 'Punctual & reliable', body: 'We turn up in the window we promised, or we tell you why.' },
  { icon: Star, title: '100% satisfaction guarantee', body: 'Not right? Tell us within 7 days and we come back at no labor charge.' },
  { icon: Home, title: 'Clean & tidy workmanship', body: 'We leave the room the way we found it, minus the problem.' },
];

const PLAN_POINTS = [
  { icon: CalendarClock, title: 'One visit a month', body: 'We work the same checklist every time, so nothing quietly gets missed.' },
  { icon: Clock, title: 'Priority booking', body: 'Plan members go ahead of the queue — including in monsoon season.' },
  { icon: Percent, title: '15% off any extra work', body: 'Anything beyond the checklist is discounted labor for members.' },
  { icon: XCircle, title: 'Cancel any time', body: "30 days' notice, no long-term contract, no cancellation penalty." },
];

const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

/* ---------------------------------------------------------------- */

function Header({ onQuote }) {
  return (
    <header className="sh-header">
      <div className="sh-wrap sh-header__in">
        <a className="sh-brand" href="#top">
          <span className="sh-brand__mark"><Wrench size={20} strokeWidth={2.4} /></span>
          <span>
            <span className="sh-brand__name">Scottsdale Handyman</span>
            <span className="sh-brand__sub">Solutions</span>
          </span>
        </a>

        <nav className="sh-nav" aria-label="Main">
          {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>

        <div className="sh-header__cta">
          <a className="sh-callbtn" href={BUSINESS_PHONE_HREF}>
            <Phone size={17} strokeWidth={2.4} />
            <span className="sh-callbtn__num">{BUSINESS_PHONE}</span>
            <span className="sh-callbtn__word">Call</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero({ onStartPlan, onQuote }) {
  return (
    <section className="sh-hero" id="top">
      <div className="sh-wrap">
        <p className="sh-eyebrow sh-eyebrow--light">Scottsdale · Paradise Valley · Fountain Hills</p>
        <h1>Home maintenance,<br />handled <em>every month</em>.</h1>
        <p className="sh-hero__lede">
          One visit a month keeps small problems small. Plan members get priority booking,
          15% off any extra work, and a standing checklist so nothing gets forgotten.
        </p>

        <div className="sh-hero__actions">
          <button type="button" className="sh-btn sh-btn--primary" onClick={onStartPlan}>
            Start the plan — <span className="sh-btn__num">$79/mo</span>
          </button>
          <button type="button" className="sh-btn sh-btn--ghostLight" onClick={onQuote}>
            Get a free estimate
          </button>
        </div>

        <div className="sh-hero__trust">
          <div className="sh-trust">
            <ShieldCheck size={22} strokeWidth={2.2} />
            <span><b>Licensed &amp; insured</b><span>Bonded in Arizona</span></span>
          </div>
          <div className="sh-trust">
            <Star size={22} strokeWidth={2.2} />
            <span><b>100+ 5-star reviews</b><span>From local homeowners</span></span>
          </div>
          <div className="sh-trust">
            <Siren size={22} strokeWidth={2.2} />
            <span><b>24/7 emergency</b><span>No overtime charges</span></span>
          </div>
          <div className="sh-trust">
            <XCircle size={22} strokeWidth={2.2} />
            <span><b>No contract</b><span>Cancel with 30 days</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The signature: the plan shown as a service record for the house. */
function Plan({ onStartPlan }) {
  const plan = byName('Monthly Maintenance');
  if (!plan) return null;

  return (
    <section className="sh-section sh-plan" id="plan">
      <div className="sh-wrap">
        <div className="sh-plan__grid">
          <div className="sh-plan__pitch">
            <p className="sh-eyebrow">The maintenance plan</p>
            <h2 className="sh-h2">A service record for your home.</h2>
            <p className="sh-lede">
              Cars get a service history. Houses rarely do — which is why a $40 washer
              becomes a $4,000 ceiling. The plan is a standing monthly checklist, kept
              per property, so you can see exactly what was checked and when.
            </p>

            <ul className="sh-plan__points">
              {PLAN_POINTS.map(({ icon: Icon, title, body }) => (
                <li className="sh-plan__point" key={title}>
                  <Icon size={22} strokeWidth={2.2} />
                  <span><b>{title}</b><span>{body}</span></span>
                </li>
              ))}
            </ul>
          </div>

          <div className="sh-record">
            <div className="sh-record__head">
              <div>
                <div className="sh-record__title">{plan.name}</div>
                <div className="sh-record__sub">Service record · per property</div>
              </div>
              <div className="sh-record__price">
                <div className="sh-record__amount">{plan.price}</div>
                <span className="sh-record__per">per month</span>
              </div>
            </div>

            <div className="sh-record__body">
              {plan.features.map((f) => (
                <div className="sh-record__item" key={f}>
                  <span className="sh-record__tick"><Check size={14} strokeWidth={3} /></span>
                  <b>{f}</b>
                </div>
              ))}
            </div>

            <div className="sh-record__foot">
              <button type="button" className="sh-btn sh-btn--dark" onClick={onStartPlan} style={{ width: '100%' }}>
                Start the plan <ArrowRight size={18} strokeWidth={2.4} />
              </button>
              <p className="sh-record__note">
                Billed monthly in advance. Cancel any time with 30 days&rsquo; notice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Jobs({ onBookNow }) {
  const oneOff = servicePackages.filter(
    (p) => p.name !== 'Monthly Maintenance' && p.name !== 'Emergency Service'
  );

  return (
    <section className="sh-section" id="jobs">
      <div className="sh-wrap">
        <p className="sh-eyebrow">One-off jobs</p>
        <h2 className="sh-h2">Just need one thing fixed?</h2>
        <p className="sh-lede">Fixed prices, agreed before we start. No plan required.</p>

        <div className="sh-cards">
          {oneOff.map((pkg) => {
            const Icon = PACKAGE_ICONS[pkg.name] || Wrench;
            return (
              <article className="sh-card" key={pkg.name}>
                <span className="sh-card__icon"><Icon size={21} strokeWidth={2.2} /></span>
                <h3 className="sh-card__name">{pkg.name}</h3>
                <span className="sh-card__meta">{pkg.duration}</span>
                <div>
                  <span className="sh-card__price">{pkg.price}</span>
                  {pkg.originalPrice && <span className="sh-card__was">{pkg.originalPrice}</span>}
                </div>
                <ul className="sh-card__list">
                  {pkg.features.slice(0, 4).map((f) => (
                    <li key={f}><Check size={14} strokeWidth={3} />{f}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="sh-btn sh-btn--dark sh-card__btn"
                  onClick={() => onBookNow(pkg)}
                  style={{ width: '100%' }}
                >
                  Book {pkg.name}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Emergency({ onBookNow }) {
  const pkg = byName('Emergency Service');
  return (
    <section className="sh-section sh-emergency" id="emergency">
      <div className="sh-wrap sh-emergency__in">
        <div>
          <span className="sh-emergency__badge"><Siren size={15} strokeWidth={2.4} /> Available 24/7</span>
          <h2>Burst pipe at 2am? We answer.</h2>
          <p>
            Active leaks, electrical safety problems, and doors or windows that will not
            secure. {pkg ? `${pkg.price} flat call-out` : 'Flat call-out'} — and we never add
            overtime, weekend or holiday charges on top.
          </p>
        </div>
        <div className="sh-emergency__call">
          <a className="sh-emergency__num" href={BUSINESS_PHONE_HREF}>{BUSINESS_PHONE}</a>
          <a className="sh-btn sh-btn--onDark" href={BUSINESS_PHONE_HREF} style={{ color: '#8a2c0c' }}>
            <Phone size={18} strokeWidth={2.4} /> Call now
          </a>
          {pkg && (
            <button type="button" className="sh-btn sh-btn--ghostLight" onClick={() => onBookNow(pkg)}>
              Book online instead
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function Why() {
  return (
    <section className="sh-section sh-why" id="why">
      <div className="sh-wrap">
        <p className="sh-eyebrow sh-eyebrow--light">Why us</p>
        <h2 className="sh-h2">Not just another handyman service.</h2>
        <div className="sh-why__grid">
          {WHY.map(({ icon: Icon, title, body }) => (
            <div className="sh-why__item" key={title}>
              <Icon size={22} strokeWidth={2.2} />
              <span><b>{title}</b><span>{body}</span></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="sh-section" id="reviews">
      <div className="sh-wrap">
        <p className="sh-eyebrow">Reviews</p>
        <h2 className="sh-h2">What neighbours say.</h2>
        <div className="sh-reviews__grid">
          {testimonials.map((t) => (
            <figure className="sh-review" key={t.name}>
              <div className="sh-review__stars" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="sh-review__quote">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="sh-review__who">
                <span className="sh-review__av" aria-hidden="true">{initials(t.name)}</span>
                <span><b>{t.name}</b><span>{t.location}</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Close({ onStartPlan }) {
  return (
    <section className="sh-section sh-close">
      <div className="sh-wrap sh-close__in">
        <h2>Stop fixing. Start maintaining.</h2>
        <p>
          Join the homeowners who have swapped emergency call-outs for one predictable
          monthly visit.
        </p>
        <div className="sh-close__actions">
          <button type="button" className="sh-btn sh-btn--onGold" onClick={onStartPlan}>
            Start the plan — <span className="sh-btn__num">$79/mo</span>
          </button>
          <a className="sh-btn sh-btn--ghostGold" href={BUSINESS_PHONE_HREF}>
            <Phone size={18} strokeWidth={2.4} />
            <span className="sh-btn__num">{BUSINESS_PHONE}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer({ onProPortalClick, onWorkWithUsClick }) {
  return (
    <footer className="sh-footer">
      <div className="sh-wrap">
        <div className="sh-footer__grid">
          <div>
            <h4>Scottsdale Handyman</h4>
            <p>
              Your trusted partner for home repair and maintenance across Scottsdale,
              Paradise Valley and Fountain Hills. Licensed, bonded and insured.
            </p>
          </div>

          <div>
            <h4>Services</h4>
            <ul>
              <li><a href="#plan">Maintenance plan</a></li>
              <li><a href="#jobs">One-off jobs</a></li>
              <li><a href="#emergency">Emergency call-out</a></li>
              <li><a href="#reviews">Reviews</a></li>
            </ul>
          </div>

          <div>
            <h4>For professionals</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onProPortalClick(); }}>Pro portal</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onWorkWithUsClick(); }}>Work with us</a></li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <div className="sh-footer__contact">
              <a href={BUSINESS_PHONE_HREF}><Phone size={16} strokeWidth={2.2} />{BUSINESS_PHONE}</a>
              <a href="mailto:help.scottsdalehandyman@gmail.com"><Mail size={16} strokeWidth={2.2} />help.scottsdalehandyman@gmail.com</a>
              <span><MapPin size={16} strokeWidth={2.2} />Scottsdale, AZ</span>
            </div>
          </div>
        </div>

        <div className="sh-footer__bottom">
          <span>&copy; {new Date().getFullYear()} Scottsdale Handyman Solutions LLC. All rights reserved.</span>
          <a href="/terms.html">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

function MobileBar({ onStartPlan }) {
  return (
    <div className="sh-mobilebar">
      <a className="sh-btn sh-btn--ghostLight" href={BUSINESS_PHONE_HREF}>
        <Phone size={17} strokeWidth={2.4} /> Call
      </a>
      <button type="button" className="sh-btn sh-btn--primary" onClick={onStartPlan}>
        Start plan
      </button>
    </div>
  );
}

export default function SiteRedesign({ onBookNow, onProPortalClick, onWorkWithUsClick }) {
  const startPlan = () => onBookNow(byName('Monthly Maintenance') || null);
  const quote = () => onBookNow(null);

  return (
    <div className="sh-page">
      <Header onQuote={quote} />
      <main>
        <Hero onStartPlan={startPlan} onQuote={quote} />
        <Plan onStartPlan={startPlan} />
        <Jobs onBookNow={onBookNow} />
        <Emergency onBookNow={onBookNow} />
        <Why />
        <Reviews />
        <Close onStartPlan={startPlan} />
      </main>
      <Footer onProPortalClick={onProPortalClick} onWorkWithUsClick={onWorkWithUsClick} />
      <MobileBar onStartPlan={startPlan} />
    </div>
  );
}
