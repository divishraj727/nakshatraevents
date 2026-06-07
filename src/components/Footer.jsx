import s from './Footer.module.css'

const cities = [
  'Shimoga', 'Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Dharwad',
  'Davangere', 'Tumkur', 'Hassan', 'Udupi', 'Chikmagalur', 'Sagara',
  'Belgaum', 'Bellary', 'Gulbarga', 'Mandya', 'Kodagu', 'Bidar',
  'Raichur', 'Vijayapura', 'Hosapete',
]

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
  { label: 'Admin', href: '/admin' },
]

export default function Footer() {
  return (
    <footer className={s.footer} role="contentinfo" aria-label="Nakshatra Events footer">
      <div className={s.inner}>
        <div className={s.topRow}>
          <div className={s.brand}>
            <p className={s.wordmark}>Nakshatra Events</p>
            <p className={s.tagline}>Transforming Moments, Creating Memories</p>
            <p className={s.sub}>Developed by DivishRaj O &amp; Yashwanth LS</p>
          </div>

          <nav className={s.nav} aria-label="Footer navigation">
            <p className={s.navHeading}>Navigate</p>
            <ul className={s.navList} role="list">
              {links.map(l => (
                <li key={l.label}>
                  <a href={l.href} className={s.navLink}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={s.contact} aria-label="Contact details">
            <p className={s.navHeading}>Contact</p>
            <div className={s.contactLines}>
              <a href="tel:+919740904242" className={s.contactLine}>+91 9740904242</a>
              <a href="tel:+918951403242" className={s.contactLine}>+91 8951403242</a>
              <a href="mailto:rashmirs1989@gmail.com" className={s.contactLine}>rashmirs1989@gmail.com</a>
              <address className={s.addr}>
                Gopala Bus Stop, Gopala<br />
                Shimoga, Karnataka
              </address>
            </div>
          </div>
        </div>

        <div className={s.coverageRow}>
          <p className={s.coverageLabel}>Serving all of Karnataka:</p>
          <p className={s.cityList} aria-label="Cities served">
            {cities.join(' · ')}
          </p>
        </div>

        <div className={s.bottomRow}>
          <p className={s.copy}>
            &copy; {new Date().getFullYear()} Nakshatra Events. All rights reserved.
          </p>
          <p className={s.founderLine}>
            Founded by Rashmi Satish &nbsp;·&nbsp; Developed by{' '}
            <a href="https://www.linkedin.com/in/divish-raj-o-664a1519a/" target="_blank" rel="noopener noreferrer" className={s.devLink}>DivishRaj O</a>
            {' '}&amp;{' '}
            <a href="https://www.linkedin.com/in/yashwanth-l-s-4101b636b/" target="_blank" rel="noopener noreferrer" className={s.devLink}>Yashwanth LS</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
