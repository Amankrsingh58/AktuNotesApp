import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";


const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    platform: [
      { label: 'Browse Notes', path: '/notes/years' },
      { label: 'Featured Content', path: '/home' },
      { label: 'How It Works', path: '/home' },
      { label: 'Pricing', path: '/home' }
    ],
    support: [
      { label: 'Help Center', path: '/home' },
      { label: 'Contact Us', path: '/home' },
      { label: 'FAQs', path: '/home' },
      { label: 'Report Issue', path: '/home' }
    ],
    legal: [
      { label: 'Terms of Service', path: '/home' },
      { label: 'Privacy Policy', path: '/home' },
      { label: 'Refund Policy', path: '/home' },
      { label: 'Cookie Policy', path: '/home' }
    ],
    community: [
      { label: 'Join Now', path: 'https://chat.whatsapp.com/BIgo6lPEzwF5G0xoAHerH7' },
      { label: 'Work With Us', path: '/home' },
      { label: 'Blog', path: '/home' },
      { label: 'Partnerships', path: '/home' }
    ]
  };

  const socialLinks = [
    // { icon: 'Facebook', url: '#', label: 'Facebook' },
    // { icon: 'Twitter', url: '#', label: 'Twitter' },
    // { icon: 'Instagram', url: '#', label: 'Instagram' },
    { icon: 'Linkedin', url: 'https://www.linkedin.com/in/aman-kumar-singh-030083243?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', label: 'LinkedIn' },
    // { icon: 'whatsapp', url: 'https://chat.whatsapp.com/BIgo6lPEzwF5G0xoAHerH7', label: 'Whatsapp' }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-10 lg:gap-12 mb-10 md:mb-12">
          <div className="lg:col-span-2">
            <Link to="/home" className="flex items-center space-x-3 mb-4 md:mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon name="GraduationCap" size={24} className="text-primary" />
              </div>
              <span className="text-xl font-semibold text-foreground">AKTUNotes</span>
            </Link>
            <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-sm">
              An Unofficial AKTU platform for quality B.Tech academic notes and AKTU PYQs. Empowering students to achieve excellence through accessible education.
            </p>
            <div className="flex items-center space-x-3">
              {socialLinks?.map((social) => (
                <a
                  key={social?.label}
                  href={social?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-muted rounded-lg text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                  aria-label={social?.label}
                >
                  <Icon name={social?.icon} size={18} />
                </a>
              ))}
              <a href="https://chat.whatsapp.com/BIgo6lPEzwF5G0xoAHerH7" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faWhatsapp} size='lg' className="w-10 p-2.5 h-10 bg-muted rounded-lg text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"/>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks?.platform?.map((link) => (
                <li key={link?.label}>
                  <Link
                    to={link?.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks?.support?.map((link) => (
                <li key={link?.label}>
                  <Link
                    to={link?.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks?.legal?.map((link) => (
                <li key={link?.label}>
                  <Link
                    to={link?.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Community</h3>
            <ul className="space-y-3">
              {footerLinks?.community?.map((link) => (
                <li key={link?.label}>
                  <Link
                    to={link?.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} EduNotes Marketplace. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} color="var(--color-success)" />
                <span className="text-xs text-muted-foreground">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Lock" size={16} color="var(--color-success)" />
                <span className="text-xs text-muted-foreground">Safe Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;