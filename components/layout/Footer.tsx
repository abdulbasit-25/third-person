type FooterVariant = "public-home";

interface FooterProps {
  variant?: FooterVariant;
}

export function Footer({ variant = "public-home" }: FooterProps) {
  if (variant === "public-home") {
    return (
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-[10px] uppercase tracking-[.15em] text-[var(--muted)] md:flex-row md:items-center md:justify-between md:px-10">
        <span>ABDUL BASIT — BSAI&apos;24, SZABIST</span>
        <span>Private by design / © {new Date().getFullYear()}</span>
      </footer>
    );
  }
  return null;
}
