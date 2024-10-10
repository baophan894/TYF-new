type NavLink = {
  href: string;
  label: string;
};

export const links: NavLink[] = [
  { href: "/", label: "home" },
  { href: "/favorites ", label: "favorites" },
  { href: "/booking-example ", label: "bookings" },
  { href: "/reviews ", label: "reviews" },
  { href: "/reservations ", label: "reservations" },
  { href: "/rentals/create ", label: "create rental" },
  { href: "/rentals", label: "my rentals" },
  { href: "/admin", label: "admin" },
  { href: "/babysitter", label: "babysitter" },
  { href: "/profile ", label: "profile" },
];
