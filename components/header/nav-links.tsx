import Link from "next/link";

interface NavLinksProps {
  isMobile?: boolean;
  onClick?: () => void;
}

// Reusable Navigation Links Component
const NavLinks: React.FC<NavLinksProps> = ({ isMobile = false, onClick }) => {
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
            isMobile ? "text-lg font-medium" : "text-md font-medium"
          } transition-colors hover:text-primary`}
          onClick={onClick} // Close the menu when clicked
        >
          {link.label}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
