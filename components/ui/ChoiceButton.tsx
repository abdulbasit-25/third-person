import type { CSSProperties, ReactNode } from "react";

type ChoiceButtonProps = {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
};

const idleStyles = {
  borderColor: "#cdc4b2",
  color: "#6b6252",
};

export function ChoiceButton({ active, onClick, children }: ChoiceButtonProps) {
  const buttonStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontFamily: "inherit",
    borderRadius: "3px",
    border: `1.5px solid ${active ? "#b5541c" : "#cdc4b2"}`,
    backgroundColor: active ? "#c1611f" : "#f6f1e7",
    color: active ? "#fff8ef" : "#6b6252",
    boxShadow: active ? "0 2px 6px rgba(180,84,28,0.35)" : "none",
    cursor: "pointer",
    transition: "border-color 150ms ease, color 150ms ease",
  };

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={(event) => {
        if (!active)
          Object.assign(event.currentTarget.style, {
            borderColor: "#3a352b",
            color: "#3a352b",
          });
      }}
      onMouseLeave={(event) => {
        if (!active) Object.assign(event.currentTarget.style, idleStyles);
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "14px",
          height: "14px",
          borderRadius: "2px",
          border: active ? "1.5px solid #fff8ef" : "1.5px solid #b3a894",
          backgroundColor: active ? "#fff8ef" : "transparent",
          flexShrink: 0,
        }}
      >
        {active && (
          <svg
            width="9"
            height="9"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c1611f"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      {children}
    </button>
  );
}
