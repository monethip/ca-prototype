const CONTACTS = [
  { label: "Phone", value: "+856 21 123 456", href: "tel:+85621123456" },
  { label: "WhatsApp", value: "+856 20 5555 1234", href: "https://wa.me/8562055551234" },
  { label: "Email", value: "help@ca-prototype.la", href: "mailto:help@ca-prototype.la" },
];

export default function ContactFab() {
  return (
    <div className="contact-fab">
      <button className="contact-fab-btn" type="button" aria-label="Contact us">
        Contact us
      </button>
      <div className="contact-fab-panel" role="menu">
        <strong>Contact us</strong>
        {CONTACTS.map((c) => (
          <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
            <span>{c.label}</span>
            {c.value}
          </a>
        ))}
      </div>
    </div>
  );
}
