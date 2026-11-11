import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

export default function SocialLinks({ profile }) {
  const items = [
    { label: 'GitHub', href: profile.github, Icon: Github },
    { label: 'LinkedIn', href: profile.linkedin, Icon: Linkedin },
    { label: 'Instagram', href: profile.instagram, Icon: Instagram },
    { label: 'Email', href: profile.email && `mailto:${profile.email}`, Icon: Mail },
  ].filter((i) => i.href);
  return (
    <ul className="socials">
      {items.map(({ label, href, Icon }) => (
        <li key={label}>
          <a className="icon-btn" href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" aria-label={label}>
            <Icon size={20} />
          </a>
        </li>
      ))}
    </ul>
  );
}
