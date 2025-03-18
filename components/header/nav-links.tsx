import Link from "next/link";

// Reusable Navigation Links Component
const NavLinks = ({ isMobile = false }) => {
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/product", label: "Product" },
    { href: "/brand", label: "Brand" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`block ${
            isMobile ? "py-2 text-lg font-medium" : "text-sm font-medium"
          } transition-colors hover:text-primary`}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
