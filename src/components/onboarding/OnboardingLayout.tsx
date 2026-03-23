import type { ReactNode } from "react";

interface OnboardingLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function OnboardingLayout({
  title,
  subtitle,
  children,
}: OnboardingLayoutProps) {
  return (
    <div className="page">
      <div className="card" style={{ maxWidth: 860, margin: "40px auto" }}>
        <h2 className="section-title">{title}</h2>
        <p className="subtle">{subtitle}</p>
        <div style={{ marginTop: 24 }}>{children}</div>
      </div>
    </div>
  );
}