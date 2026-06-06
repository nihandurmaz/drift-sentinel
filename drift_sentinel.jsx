import React, { useState, useEffect, useRef } from "react";

// ============================================================================
// Drift Sentinel — v5
// Lovable's voice and visual system, our scenario (F-04 approval-too-fast,
// recovery flow, P0 dismiss confirmation, design notes as popovers).
// v5: visual snapshots, source links, and design notes from peer critique.
// ============================================================================

// --- Design tokens ---------------------------------------------------------
const T = {
  // Surfaces
  bg: "#F5F6F8",
  surface: "#FFFFFF",
  surfaceMuted: "#FAFBFC",
  // Ink
  ink: "#0B1220",
  inkSoft: "#3A4254",
  inkMuted: "#6B7280",
  inkFaint: "#9AA3B2",
  // Lines
  line: "#E5E7EB",
  lineSoft: "#EEF0F3",
  // Brand / nav
  navy: "#0F172A",
  navyHover: "#1E293B",
  // Semantic
  p0: "#B91C1C",
  p0Bg: "#FEF2F2",
  p0Border: "#FECACA",
  p1: "#B45309",
  p1Bg: "#FFFBEB",
  p1Border: "#FDE68A",
  p2: "#1F2937",
  p2Bg: "#F3F4F6",
  p2Border: "#E5E7EB",
  ok: "#047857",
  okBg: "#ECFDF5",
  okBorder: "#A7F3D0",
  warn: "#92400E",
  warnBg: "#FEF3C7",
  warnBorder: "#FDE68A",
  errorBg: "#FEF2F2",
  errorBorder: "#FCA5A5",
};

const FONT = `'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
const MONO = `'Geist Mono', 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace`;

// --- Icons -----------------------------------------------------------------
const Icon = {
  shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  doc: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  moon: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
  lock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  archive: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="2" y="3" width="20" height="5" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  ),
  chevron: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  sparkle: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z" />
    </svg>
  ),
  eye: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  alert: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  undo: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 7v6h6" />
      <path d="M3 13a9 9 0 1 0 3-7.7L3 8" />
    </svg>
  ),
  info: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  externalLink: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
};

// --- Reusable bits ---------------------------------------------------------
const SeverityBadge = ({ sev }) => {
  const map = {
    P0: { bg: T.p0Bg, fg: T.p0, border: T.p0Border },
    P1: { bg: T.p1Bg, fg: T.p1, border: T.p1Border },
    P2: { bg: T.p2Bg, fg: T.p2, border: T.p2Border },
  };
  const s = map[sev] || map.P2;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", fontSize: 11, fontWeight: 700, color: s.fg, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 6, letterSpacing: 0.3, fontFamily: MONO }}>
      {sev}
    </span>
  );
};

const ChipTag = ({ children, tone = "neutral" }) => {
  const tones = {
    neutral: { bg: T.surfaceMuted, fg: T.inkSoft, border: T.line },
    ok: { bg: T.okBg, fg: T.ok, border: T.okBorder },
    warn: { bg: T.warnBg, fg: T.warn, border: T.warnBorder },
    accent: { bg: "#EEF2FF", fg: "#3730A3", border: "#C7D2FE" },
  };
  const s = tones[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", fontSize: 11, fontWeight: 500, color: s.fg, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 6 }}>
      {children}
    </span>
  );
};

// Design note popover marker — shows on hover/click
const NoteMarker = ({ show, label, body }) => {
  const [open, setOpen] = useState(false);
  if (!show) return null;
  return (
    <span style={{ position: "relative", display: "inline-flex", marginLeft: 8 }}>
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        aria-label="Design note"
        style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px", fontSize: 10, fontWeight: 600, color: "#3730A3", background: "#EEF2FF", border: "1px dashed #A5B4FC", borderRadius: 999, cursor: "help", letterSpacing: 0.4, textTransform: "uppercase", fontFamily: MONO }}
      >
        <Icon.info width="10" height="10" />
        note
      </button>
      {open && (
        <span style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 50, width: 320, padding: 14, background: T.navy, color: "#E5E7EB", borderRadius: 10, fontSize: 12.5, lineHeight: 1.55, boxShadow: "0 18px 40px -12px rgba(0,0,0,0.35)" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: "#A5B4FC", marginBottom: 6 }}>{label}</div>
          <div>{body}</div>
        </span>
      )}
    </span>
  );
};

// Source link with middle-truncation and tooltip
const SourceLink = ({ path }) => {
  if (!path) return null;
  const display = (() => {
    if (path.length <= 44) return path;
    const lastSlash = path.lastIndexOf("/");
    const tail = path.slice(lastSlash + 1);
    return `src/.../${tail}`;
  })();
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      title={`${path}\n\nIn production this would link directly to the exact line in the codebase, the corresponding Figma frame, or the live URL.`}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 9px", fontSize: 12, fontFamily: MONO,
        color: T.inkSoft, background: T.surfaceMuted,
        border: `1px solid ${T.line}`, borderRadius: 6,
        textDecoration: "none", cursor: "help",
        maxWidth: 360, overflow: "hidden",
        textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}
    >
      <Icon.externalLink width="11" height="11" style={{ color: T.inkMuted, flexShrink: 0 }} />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{display}</span>
    </a>
  );
};

// Visual snapshot panel wrapper
const SnapshotPanel = ({ side, children }) => {
  const isObserved = side === "observed";
  const accent = isObserved ? T.p1 : T.ok;
  const accentBg = isObserved ? T.p1Bg : T.okBg;
  const accentBorder = isObserved ? T.p1Border : T.okBorder;
  const label = isObserved ? "Observed" : "Expected";
  return (
    <div style={{ border: `1px solid ${T.line}`, borderRadius: 10, overflow: "hidden", background: T.surface }}>
      <div style={{ padding: "6px 11px", fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: accent, background: accentBg, borderBottom: `1px solid ${accentBorder}`, fontFamily: MONO }}>
        {label}
      </div>
      {children}
    </div>
  );
};

// Color swatch with sample text
const ColorSwatchSample = ({ color, background, sampleText }) => (
  <div style={{ padding: 14, background, display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 36, height: 36, background: color, borderRadius: 6, border: `1px solid ${T.line}`, flexShrink: 0 }} />
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 500, color, lineHeight: 1.2, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {sampleText || "Aa"}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 11, color: T.inkMuted, letterSpacing: 0.3 }}>{color}</div>
    </div>
  </div>
);

// Focus-ring sample for F-02
const FocusRingSample = ({ withRing }) => (
  <div style={{ padding: 18, background: T.surface, display: "flex", justifyContent: "center" }}>
    <div style={{ padding: "9px 12px", background: T.surface, border: `1px solid ${T.line}`, borderRadius: 6, fontSize: 13, color: T.inkSoft, outline: withRing ? `2px solid #0F5DC2` : "none", outlineOffset: withRing ? 2 : 0, minWidth: 140 }}>
      Agency name
    </div>
  </div>
);

// The actual snapshot renderer — picks the right visual per finding
const DriftSnapshot = ({ f }) => {
  if (f.id === "F-01") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <SnapshotPanel side="observed">
          <div style={{ padding: 18, background: T.surface, display: "flex", justifyContent: "center" }}>
            <div style={{ padding: "8px 16px", background: "#FED7AA", color: "#C2410C", borderRadius: 6, fontSize: 13.5, fontWeight: 600 }}>Review now</div>
          </div>
          <div style={{ padding: "8px 11px", fontFamily: MONO, fontSize: 11, color: T.inkMuted, borderTop: `1px solid ${T.lineSoft}`, background: T.surfaceMuted }}>3.1:1 — fails WCAG AA</div>
        </SnapshotPanel>
        <SnapshotPanel side="expected">
          <div style={{ padding: 18, background: T.surface, display: "flex", justifyContent: "center" }}>
            <div style={{ padding: "8px 16px", background: "#FED7AA", color: "#7C2D12", borderRadius: 6, fontSize: 13.5, fontWeight: 600 }}>Review now</div>
          </div>
          <div style={{ padding: "8px 11px", fontFamily: MONO, fontSize: 11, color: T.inkMuted, borderTop: `1px solid ${T.lineSoft}`, background: T.surfaceMuted }}>6.8:1 — passes WCAG AA</div>
        </SnapshotPanel>
      </div>
    );
  }
  if (f.id === "F-02") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <SnapshotPanel side="observed">
          <FocusRingSample withRing={false} />
          <div style={{ padding: "8px 11px", fontFamily: MONO, fontSize: 11, color: T.inkMuted, borderTop: `1px solid ${T.lineSoft}`, background: T.surfaceMuted }}>outline: none on :focus</div>
        </SnapshotPanel>
        <SnapshotPanel side="expected">
          <FocusRingSample withRing={true} />
          <div style={{ padding: "8px 11px", fontFamily: MONO, fontSize: 11, color: T.inkMuted, borderTop: `1px solid ${T.lineSoft}`, background: T.surfaceMuted }}>ring/focus: 2px solid · 2px offset</div>
        </SnapshotPanel>
      </div>
    );
  }
  if (f.id === "F-03") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <SnapshotPanel side="observed">
          <div style={{ padding: 18, background: T.surface, display: "flex", justifyContent: "center" }}>
            <div style={{ padding: "4px 12px", background: "#1F7AE0", color: "white", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>In review</div>
          </div>
          <div style={{ padding: "8px 11px", fontFamily: MONO, fontSize: 11, color: T.inkMuted, borderTop: `1px solid ${T.lineSoft}`, background: T.surfaceMuted }}>#1F7AE0 — raw hex</div>
        </SnapshotPanel>
        <SnapshotPanel side="expected">
          <div style={{ padding: 18, background: T.surface, display: "flex", justifyContent: "center" }}>
            <div style={{ padding: "4px 12px", background: "#0F5DC2", color: "white", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>In review</div>
          </div>
          <div style={{ padding: "8px 11px", fontFamily: MONO, fontSize: 11, color: T.inkMuted, borderTop: `1px solid ${T.lineSoft}`, background: T.surfaceMuted }}>#0F5DC2 — color/brand/primary</div>
        </SnapshotPanel>
      </div>
    );
  }
  if (f.id === "F-04") {
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <SnapshotPanel side="observed">
            <ColorSwatchSample color="#0066B2" background="#FFFFFF" sampleText="Partner Directory" />
          </SnapshotPanel>
          <SnapshotPanel side="expected">
            <ColorSwatchSample color="#0B5FFF" background="#FFFFFF" sampleText="Partner Directory" />
          </SnapshotPanel>
        </div>
        <div style={{ marginTop: 10, padding: "9px 12px", fontSize: 12, color: T.warn, background: T.warnBg, border: `1px solid ${T.warnBorder}`, borderRadius: 8, fontStyle: "italic", lineHeight: 1.5 }}>
          Shown as drift, but may be intentional partner branding — the agent cannot tell from code alone.
        </div>
      </div>
    );
  }
  return null;
};

// --- Mock data: the overnight scenario -------------------------------------
const SCENARIO = {
  ran: { start: "02:14", end: "03:47", date: "tonight" },
  nextRun: "02:00",
  scanned: { components: 1284, routes: 47, routesTotal: 49, tokenBundle: "v4.12.0" },
  skipped: [
    { route: "/internal/admin", reason: "auth required" },
    { route: "/billing/invoice/:id", reason: "auth required" },
  ],
  counts: { P0: 2, P1: 1, P2: 1, lowConfidence: 1 },
};

// Exemptions already on file — findings the user previously marked "Allowed exception".
// In a real product this would come from a persistent store; here it's seeded to make
// the suppression layer legible.
const SEEDED_EXEMPTIONS = [
  { id: "E-118", title: "Partner-mandated orange on Acme banner", category: "Color", markedAt: "3 weeks ago" },
  { id: "E-104", title: "Legacy modal uses pre-token spacing", category: "Spacing", markedAt: "2 months ago" },
  { id: "E-091", title: "Marketing CTA font weight outside scale", category: "Typography", markedAt: "2 months ago" },
];

const INITIAL_FINDINGS = [
  {
    id: "F-01",
    severity: "P0",
    title: "Insufficient contrast on warning button text",
    category: "Accessibility",
    location: "Diagnostic / Risk summary panel",
    confidence: "high",
    drifted: "Button uses #C2410C text on #FED7AA background. Contrast ratio is 3.1:1.",
    why: "WCAG 2.1 AA requires 4.5:1 for normal text. This affects users with low vision reading regulatory warnings — directly relevant to our compliance commitments.",
    observed: "#C2410C on #FED7AA — 3.1:1",
    expected: "color/warn/ink-strong (#7C2D12) on warn/surface — 6.8:1",
    fix: "Swap text color to color/warn/ink-strong. No background change.",
    foundAt: "tonight",
    status: "open",
    sourcePath: "src/components/diagnostic/RiskSummaryPanel.jsx:142",
    reviewKind: "trivial",
  },
  {
    id: "F-02",
    severity: "P0",
    title: "Form field missing visible focus ring",
    category: "Accessibility",
    location: "Agency onboarding / Step 2",
    confidence: "high",
    drifted: "Focus indicator removed via outline: none; no replacement provided.",
    why: "Keyboard-only users can't see where focus is. This is a compliance-level failure and was likely an unintentional CSS reset.",
    observed: "outline: none on :focus state",
    expected: "ring/focus token: 2px solid color/accent/primary with 2px offset",
    fix: "Apply ring/focus token to the input :focus state.",
    foundAt: "tonight",
    status: "open",
    sourcePath: "src/pages/onboarding/Step2AgencyDetails.jsx:78",
    reviewKind: "trivial",
  },
  {
    id: "F-03",
    severity: "P1",
    title: "Non-token blue used on Status pill",
    category: "Color",
    location: "Reports › Compliance summary header",
    confidence: "high",
    drifted: "Background uses hex #1F7AE0 directly. This color is not in the palette and is one step lighter than color/brand/primary.",
    why: "Off-token colors break theming, dark-mode adaptation, and downstream automated contrast checks.",
    observed: "#1F7AE0 (raw hex)",
    expected: "color/brand/primary #0F5DC2",
    fix: "Swap inline hex for the color/brand/primary token.",
    foundAt: "tonight",
    status: "open",
    sourcePath: "src/components/reports/StatusPill.jsx:23",
    reviewKind: "trivial",
  },
  {
    id: "F-04",
    severity: "P2",
    title: "Possibly off-token blue on header band",
    category: "Color",
    location: "Partner directory / Section banner",
    confidence: "low",
    drifted: "Header band uses #0066B2, which is not a system token. It is close to several palette blues but not an exact match.",
    why: "I can detect that the color differs from the system, but I cannot tell whether the difference is a mistake or intentional. The location is the Partner directory section banner — a region that may display a partner organization's required branding. If it is partner branding, fixing it would overwrite the partner's color.",
    observed: "#0066B2",
    expected: "Either color/brand/secondary #0B5FFF (drift) — or kept as-is if this is required partner branding",
    fix: "Swap to color/brand/secondary token. ⚠ Verify this is not partner branding before approving.",
    foundAt: "tonight",
    status: "open",
    sourcePath: "src/components/partner/SectionBanner.jsx:17",
    reviewKind: "judgment",
  },
];

// --- App -------------------------------------------------------------------
export default function DriftSentinel() {
  const [view, setView] = useState("audit"); // audit | digest | boundaries | archive
  const [findings, setFindings] = useState(INITIAL_FINDINGS);
  const [archive, setArchive] = useState([]); // dismissed / intentional / released findings
  const [expandedId, setExpandedId] = useState("F-04");
  const [confirmingDismissId, setConfirmingDismissId] = useState(null);
  const [confirmingIntentionalId, setConfirmingIntentionalId] = useState(null);
  const [confirmingRelease, setConfirmingRelease] = useState(false);
  const [exemptionsOpen, setExemptionsOpen] = useState(false);
  const [showDemoBanner, setShowDemoBanner] = useState(true);
  const [exemptions, setExemptions] = useState(SEEDED_EXEMPTIONS);
  const [toast, setToast] = useState(null);
  const [showNotes, setShowNotes] = useState(true);
  const [prCounter, setPrCounter] = useState(247); // next PR number
  const [archiveFilter, setArchiveFilter] = useState("all"); // all | released | dismissed | intentional
  const [autonomy, setAutonomy] = useState({
    Color: "flag+draft",
    Typography: "flag-only",
    Spacing: "flag-only",
    Components: "flag-only",
    Accessibility: "flag-only",
  });

  // Toast: 6s with hover-pause
  const toastTimer = useRef(null);
  const showToast = (t) => {
    setToast(t);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  };
  const pauseToast = () => clearTimeout(toastTimer.current);
  const resumeToast = () => {
    if (toast) toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  // --- Action handlers -----------------------------------------------------
  const approveFix = (id) => {
    const f = findings.find((x) => x.id === id);
    setFindings((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              status: "staged",
              // F-04 is seeded as a low-confidence approval. The "second look" prompt
              // appears only when the user re-expands the card from the Staged section,
              // not immediately on approval — that way the catch is genuinely the user's.
              needsRecheck: x.confidence === "low",
              showRecovery: false,
            }
          : x
      )
    );
    // Collapse the just-approved card so re-opening it later is a deliberate act.
    setExpandedId((cur) => (cur === id ? null : cur));
    showToast({
      kind: "approve",
      message: `Staged draft for ${id}. Nothing applied to production.`,
      undo: () => setFindings((prev) => prev.map((x) => (x.id === id ? { ...x, status: "open", showRecovery: false, needsRecheck: false } : x))),
    });
  };

  const dismiss = (id) => {
    const f = findings.find((x) => x.id === id);
    if (f.severity === "P0") {
      setConfirmingDismissId(id);
      return;
    }
    moveToArchive(id, "dismissed");
  };

  const confirmDismiss = (reason) => {
    const id = confirmingDismissId;
    setConfirmingDismissId(null);
    moveToArchive(id, "dismissed", reason);
  };

  const markIntentional = (id) => {
    // Marking intentional permanently suppresses re-flagging — gate behind confirmation
    // for every severity, not just P0. The asymmetry matters: Dismiss re-checks next run,
    // Intentional doesn't, so the higher-friction one should be the more dangerous action.
    setConfirmingIntentionalId(id);
  };

  const confirmMarkIntentional = (reason) => {
    const id = confirmingIntentionalId;
    setConfirmingIntentionalId(null);
    moveToArchive(id, "intentional", reason);
  };

  const moveToArchive = (id, archiveKind, reason) => {
    const f = findings.find((x) => x.id === id);
    if (!f) return;
    const archived = { ...f, status: archiveKind, archivedAt: "just now", dismissReason: reason };
    setFindings((prev) => prev.filter((x) => x.id !== id));
    setArchive((prev) => [archived, ...prev]);
    showToast({
      kind: "archive",
      message: `${id} moved to Archive (${archiveKind}). Nothing is permanently deleted.`,
      undo: () => {
        setArchive((prev) => prev.filter((x) => x.id !== id));
        setFindings((prev) => [...prev, { ...f, status: "open" }].sort(byFindingId));
      },
    });
  };

  const decideLater = (id) => {
    setFindings((prev) => prev.map((x) => (x.id === id ? { ...x, status: "reviewed" } : x)));
    showToast({
      kind: "review",
      message: `${id} marked as Reviewed. It will stay in your audit report.`,
      undo: () => setFindings((prev) => prev.map((x) => (x.id === id ? { ...x, status: "open" } : x))),
    });
  };

  const rollBack = (id) => {
    setFindings((prev) => prev.map((x) => (x.id === id ? { ...x, status: "open", showRecovery: false, needsRecheck: false } : x)));
    showToast({
      kind: "rollback",
      message: `${id} rolled back. The staged draft was discarded.`,
    });
  };

  // Unstage: roll back a staged draft (regular case, not the F-04 error)
  const unstage = (id) => {
    setFindings((prev) => prev.map((x) => (x.id === id ? { ...x, status: "open", showRecovery: false, needsRecheck: false } : x)));
    showToast({
      kind: "unstage",
      message: `${id} unstaged. It's back in your open findings.`,
      undo: () => setFindings((prev) => prev.map((x) => (x.id === id ? { ...x, status: "staged", needsRecheck: x.confidence === "low" } : x))),
    });
  };

  // Acknowledge: user has done the second look and confirmed the staged draft is correct
  const acknowledgeRecheck = (id) => {
    setFindings((prev) => prev.map((x) => (x.id === id ? { ...x, needsRecheck: false } : x)));
  };

  // Release: send all staged drafts to engineering as a PR
  const releaseStaged = () => {
    const stagedFindings = findings.filter((f) => f.status === "staged");
    if (stagedFindings.length === 0) return;
    const prNumber = `DS-${prCounter}`;
    setPrCounter((n) => n + 1);
    setConfirmingRelease(false);

    // Move staged findings to archive with "released" status
    const released = stagedFindings.map((f) => ({ ...f, status: "released", archivedAt: "just now", releasedAs: prNumber }));
    setArchive((prev) => [...released, ...prev]);
    setFindings((prev) => prev.filter((f) => f.status !== "staged"));

    showToast({
      kind: "release",
      message: `Released ${stagedFindings.length} fix${stagedFindings.length === 1 ? "" : "es"} as pull request ${prNumber}. Engineering has been notified.`,
    });
  };

  const restoreFromArchive = (id) => {
    const f = archive.find((x) => x.id === id);
    if (!f) return;
    if (f.status === "released") return; // released items are owned by engineering
    setArchive((prev) => prev.filter((x) => x.id !== id));
    setFindings((prev) => [...prev, { ...f, status: "open" }].sort(byFindingId));
    showToast({ kind: "restore", message: `${id} restored to the audit report.` });
  };

  const byFindingId = (a, b) => a.id.localeCompare(b.id);

  const stagedCount = findings.filter((f) => f.status === "staged").length;
  const openCount = findings.filter((f) => f.status === "open" || f.status === "reviewed").length;

  // --- Layout --------------------------------------------------------------
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.ink, fontFamily: FONT, display: "flex", fontSize: 14, WebkitFontSmoothing: "antialiased" }}>
      <Sidebar view={view} setView={setView} stagedCount={stagedCount} openCount={openCount} archiveCount={archive.length} showNotes={showNotes} />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <TopBar showNotes={showNotes} setShowNotes={setShowNotes} />

        <main style={{ flex: 1, padding: "40px 56px 80px", maxWidth: 1280, width: "100%" }}>
          {view === "audit" && (
            <AuditView
              findings={findings}
              archive={archive}
              exemptions={exemptions}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              approveFix={approveFix}
              dismiss={dismiss}
              markIntentional={markIntentional}
              decideLater={decideLater}
              rollBack={rollBack}
              unstage={unstage}
              acknowledgeRecheck={acknowledgeRecheck}
              openRelease={() => setConfirmingRelease(true)}
              openExemptions={() => setExemptionsOpen(true)}
              showNotes={showNotes}
              stagedCount={stagedCount}
              showDemoBanner={showDemoBanner}
              dismissDemoBanner={() => setShowDemoBanner(false)}
            />
          )}
          {view === "digest" && <DigestView findings={findings} archive={archive} showNotes={showNotes} setView={setView} stagedCount={stagedCount} />}
          {view === "boundaries" && <BoundariesView autonomy={autonomy} setAutonomy={setAutonomy} showNotes={showNotes} />}
          {view === "archive" && <ArchiveView archive={archive} restore={restoreFromArchive} showNotes={showNotes} filter={archiveFilter} setFilter={setArchiveFilter} />}
        </main>
      </div>

      {confirmingDismissId && <DismissConfirmModal id={confirmingDismissId} onCancel={() => setConfirmingDismissId(null)} onConfirm={confirmDismiss} finding={findings.find((f) => f.id === confirmingDismissId)} />}

      {confirmingIntentionalId && <IntentionalConfirmModal finding={findings.find((f) => f.id === confirmingIntentionalId)} onCancel={() => setConfirmingIntentionalId(null)} onConfirm={confirmMarkIntentional} />}

      {confirmingRelease && <ReleaseConfirmModal stagedFindings={findings.filter((f) => f.status === "staged")} prNumber={`DS-${prCounter}`} onCancel={() => setConfirmingRelease(false)} onConfirm={releaseStaged} />}

      {exemptionsOpen && <ExemptionsModal exemptions={exemptions} archivedIntentional={archive.filter((f) => f.status === "intentional")} onClose={() => setExemptionsOpen(false)} />}

      {toast && <Toast toast={toast} pause={pauseToast} resume={resumeToast} dismiss={() => setToast(null)} />}
    </div>
  );
}

// --- Sidebar ---------------------------------------------------------------
function Sidebar({ view, setView, stagedCount, openCount, archiveCount, showNotes }) {
  const items = [
    { id: "audit", icon: Icon.doc, label: "Audit report", count: openCount + stagedCount },
    { id: "digest", icon: Icon.moon, label: "While you were away" },
    { id: "boundaries", icon: Icon.lock, label: "Agent boundaries" },
    { id: "archive", icon: Icon.archive, label: "Archive", count: archiveCount || undefined },
  ];

  return (
    <aside style={{ width: 260, background: T.surface, borderRight: `1px solid ${T.line}`, padding: "24px 16px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 8px 20px", borderBottom: `1px solid ${T.lineSoft}` }}>
        <div style={{ width: 38, height: 38, borderRadius: 9, background: T.navy, color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon.shield width="20" height="20" />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>Drift Sentinel</div>
          <div style={{ fontSize: 12, color: T.inkMuted, marginTop: 2 }}>Design-system audit agent</div>
        </div>
      </div>

      <nav style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((it) => {
          const active = view === it.id;
          const IconEl = it.icon;
          return (
            <button
              key={it.id}
              onClick={() => setView(it.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                background: active ? T.navy : "transparent",
                color: active ? "white" : T.inkSoft,
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: FONT,
                transition: "background 120ms ease",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = T.surfaceMuted; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <IconEl width="17" height="17" />
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.count !== undefined && it.count > 0 && (
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 999, background: active ? "rgba(255,255,255,0.16)" : T.surfaceMuted, color: active ? "white" : T.inkMuted, fontFamily: MONO }}>
                  {it.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", padding: "12px 8px", borderTop: `1px solid ${T.lineSoft}` }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: T.inkMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Last run</div>
        <div style={{ fontSize: 12.5, color: T.inkSoft, fontFamily: MONO }}>
          {SCENARIO.ran.date}, {SCENARIO.ran.start} – {SCENARIO.ran.end} UTC
        </div>
        <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, padding: "4px 9px", background: T.okBg, color: T.ok, border: `1px solid ${T.okBorder}`, borderRadius: 999 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: T.ok }} />
          Idle — next run {SCENARIO.nextRun} UTC
        </div>
        <div style={{ marginTop: 10 }}>
          <NoteMarker
            show={showNotes}
            label="Ad hoc audits — peer critique (Michael)"
            body="Today the agent runs on a fixed nightly cadence. In a longer-term version, the user could trigger an audit on demand — pointing the agent at a specific Figma file, a code branch before merge, or a single page she suspects has drifted — without waiting for the next scheduled run. The same trust mechanisms (staging, low-confidence flags, release-as-PR) would still apply."
          />
        </div>
      </div>
    </aside>
  );
}

// --- Top bar (Design notes toggle) -----------------------------------------
function TopBar({ showNotes, setShowNotes }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "18px 56px 0", gap: 12 }}>
      <span style={{ fontSize: 12, color: T.inkMuted }}>Course-submission view</span>
      <button
        onClick={() => setShowNotes((s) => !s)}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", fontSize: 12.5, fontWeight: 500, color: showNotes ? "#3730A3" : T.inkMuted, background: showNotes ? "#EEF2FF" : T.surface, border: `1px solid ${showNotes ? "#C7D2FE" : T.line}`, borderRadius: 8, cursor: "pointer", fontFamily: FONT }}
      >
        <Icon.info width="14" height="14" />
        Design notes {showNotes ? "on" : "off"}
      </button>
    </div>
  );
}

// --- Audit view ------------------------------------------------------------
function AuditView({ findings, archive, exemptions, expandedId, setExpandedId, approveFix, dismiss, markIntentional, decideLater, rollBack, unstage, acknowledgeRecheck, openRelease, openExemptions, showNotes, stagedCount, showDemoBanner, dismissDemoBanner }) {
  const open = findings.filter((f) => f.status === "open" || f.status === "reviewed");
  const staged = findings.filter((f) => f.status === "staged");

  const counts = {
    P0: open.filter((f) => f.severity === "P0").length,
    P1: open.filter((f) => f.severity === "P1").length,
    P2: open.filter((f) => f.severity === "P2").length,
  };

  const intentionalCount = exemptions.length + archive.filter((f) => f.status === "intentional").length;

  return (
    <div>
      {showDemoBanner && <DemoBanner onDismiss={dismissDemoBanner} />}
      <Header
        kicker="Overnight audit report"
        title="Here's what I found while you were away"
        titleNote={
          <NoteMarker
            show={showNotes}
            label="Framing — how this evolves over time"
            body="This prototype shows the morning after one overnight run. After multiple runs, the framing would shift: kicker becomes 'Audit report', title becomes 'Open findings (N)', subtitle becomes 'Last scan: tonight 02:14 UTC · X runs since you last reviewed'. Findings stay organized by status and severity — not by date — so a P0 from three days ago is never buried under tonight's P2. Date lives as metadata on each finding ('found tonight', 'found 3 days ago'). The 'while you were away' framing moves to the digest, where time anchoring belongs."
          />
        }
        subtitle={
          <>
            I ran a visual audit <strong style={{ color: T.ink }}>{SCENARIO.ran.date}, {SCENARIO.ran.start} – {SCENARIO.ran.end} UTC</strong> against design-token bundle <code style={{ fontFamily: MONO, fontSize: 12.5, padding: "1px 6px", background: T.surfaceMuted, borderRadius: 4 }}>{SCENARIO.scanned.tokenBundle}</code>. I scanned {SCENARIO.scanned.components.toLocaleString()} component instances across {SCENARIO.scanned.routes} of {SCENARIO.scanned.routesTotal} routes. I produced <strong style={{ color: T.ink }}>{open.length + staged.length} findings</strong>: {counts.P0} P0, {counts.P1} P1, {counts.P2} P2.
          </>
        }
      />

      {/* Summary tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 28 }}>
        <SummaryTile sev="P0" count={counts.P0} caption="Breaks accessibility or compliance commitments." />
        <SummaryTile sev="P1" count={counts.P1} caption="Noticeable drift from the design system." />
        <SummaryTile sev="P2" count={counts.P2} caption="Subtle visual inconsistency." />
        <SummaryTile sev="staged" count={stagedCount} caption="Awaiting your release. Nothing applied." />
      </div>

      {/* Reassurance line */}
      <div style={{ marginTop: 18, padding: "12px 16px", background: T.surface, border: `1px solid ${T.line}`, borderRadius: 10, display: "flex", alignItems: "center", gap: 10, color: T.inkSoft, fontSize: 13.5 }}>
        <Icon.sparkle width="16" height="16" />
        <span>I never apply changes on my own. Every fix becomes a staged draft for your review.</span>
        <NoteMarker
          show={showNotes}
          label="Legibility"
          body="The agent restates its operating constraint at the top of the report — not just in the Boundaries screen. Reinforcing the boundary inside the workflow, every session, is how trust compounds."
        />
      </div>

      {/* Scope + exemptions strip — what was and wasn't looked at */}
      <div style={{ marginTop: 10, padding: "11px 16px", background: T.surfaceMuted, border: `1px solid ${T.line}`, borderRadius: 10, display: "flex", alignItems: "center", gap: 16, color: T.inkSoft, fontSize: 13, flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Icon.eye width="14" height="14" style={{ color: T.inkMuted }} />
          <span>
            Couldn't reach <strong style={{ color: T.ink }}>{SCENARIO.skipped.length} route{SCENARIO.skipped.length === 1 ? "" : "s"}</strong> ({SCENARIO.skipped.map((s) => s.reason).join(", ")}) — those weren't audited.
          </span>
          <NoteMarker
            show={showNotes}
            label="Legibility — coverage edges"
            body="The agent tells the user what it scanned AND what it couldn't get to. A silent gap is worse than a stated one — without this, a P0 hiding behind an auth-walled route never surfaces and the user thinks they have a clean bill of health."
          />
        </span>
        <span style={{ width: 1, height: 16, background: T.line }} />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Icon.lock width="14" height="14" style={{ color: T.inkMuted }} />
          <span>
            <strong style={{ color: T.ink }}>{intentionalCount} allowed exception{intentionalCount === 1 ? "" : "s"}</strong> currently suppressed.
          </span>
          <button onClick={openExemptions} style={{ background: "transparent", border: "none", padding: 0, color: "#3730A3", fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: FONT, textDecoration: "underline" }}>
            View them
          </button>
          <NoteMarker
            show={showNotes}
            label="Suppression layer must be legible"
            body="Allowed exceptions stop being re-flagged — useful, but they easily become invisible technical debt. Surfacing the count here, with a one-click view, keeps the suppression layer auditable in every session rather than buried in Archive."
          />
        </span>
      </div>

      {/* Findings */}
      <div style={{ marginTop: 36 }}>
        <SectionLabel>Open findings ({open.length})</SectionLabel>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {open.length === 0 && <EmptyBlock text="No open findings. Nice." />}
          {open.map((f) => (
            <FindingCard
              key={f.id}
              f={f}
              expanded={expandedId === f.id}
              setExpanded={(id) => setExpandedId(id === expandedId ? null : id)}
              approveFix={approveFix}
              dismiss={dismiss}
              markIntentional={markIntentional}
              decideLater={decideLater}
              rollBack={rollBack}
              unstage={unstage}
              acknowledgeRecheck={acknowledgeRecheck}
              showNotes={showNotes}
            />
          ))}
        </div>

        {staged.length > 0 && (
          <>
            <div style={{ marginTop: 40, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <SectionLabel style={{ margin: 0 }}>Staged drafts ({staged.length}) — awaiting your release</SectionLabel>
                <NoteMarker
                  show={showNotes}
                  label="Reversibility — the release boundary"
                  body="Approval is not the end of the pipeline. Staged drafts wait here until the user releases them as a PR to engineering. Until that release, every draft is rollback-able with no consequences. Two human decisions stand between the agent and production."
                />
              </div>
              <button
                onClick={openRelease}
                style={{ ...primaryBtn, padding: "10px 18px" }}
              >
                <Icon.sparkle width="14" height="14" /> Release {staged.length} staged draft{staged.length === 1 ? "" : "s"} to engineering
              </button>
            </div>
            <p style={{ fontSize: 13, color: T.inkMuted, marginTop: 10, marginBottom: 14, lineHeight: 1.55, maxWidth: 720 }}>
              Releasing opens a pull request for the engineering team to review and merge on their schedule. Until then, nothing reaches production — and you can unstage any draft below.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {staged.map((f) => (
                <FindingCard
                  key={f.id}
                  f={f}
                  expanded={expandedId === f.id}
                  setExpanded={(id) => setExpandedId(id === expandedId ? null : id)}
                  approveFix={approveFix}
                  dismiss={dismiss}
                  markIntentional={markIntentional}
                  decideLater={decideLater}
                  rollBack={rollBack}
                  unstage={unstage}
                  acknowledgeRecheck={acknowledgeRecheck}
                  showNotes={showNotes}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Header({ kicker, title, subtitle, titleNote }) {
  return (
    <div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 600, color: T.inkMuted, textTransform: "uppercase", letterSpacing: 0.7 }}>
        <Icon.shield width="13" height="13" />
        {kicker}
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 8 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: -0.5, lineHeight: 1.15 }}>{title}</h1>
        {titleNote && <span style={{ marginTop: 12 }}>{titleNote}</span>}
      </div>
      {subtitle && <p style={{ fontSize: 14.5, color: T.inkSoft, marginTop: 14, marginBottom: 0, lineHeight: 1.65, maxWidth: 880 }}>{subtitle}</p>}
    </div>
  );
}

function SectionLabel({ children, style }) {
  return (
    <h2 style={{ fontSize: 13, fontWeight: 600, color: T.inkMuted, textTransform: "uppercase", letterSpacing: 0.7, margin: 0, ...style }}>
      {children}
    </h2>
  );
}

function SummaryTile({ sev, count, caption }) {
  const map = {
    P0: { label: "P0", fg: T.p0, bg: T.surface, border: count > 0 ? T.p0Border : T.line, accentBg: T.p0Bg },
    P1: { label: "P1", fg: T.p1, bg: T.surface, border: count > 0 ? T.p1Border : T.line, accentBg: T.p1Bg },
    P2: { label: "P2", fg: T.p2, bg: T.surface, border: T.line, accentBg: T.p2Bg },
    staged: { label: "Staged drafts", fg: T.ok, bg: T.okBg, border: T.okBorder, accentBg: T.okBg },
  };
  const s = map[sev];
  return (
    <div style={{ padding: "18px 18px", background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: s.fg, textTransform: "uppercase", letterSpacing: 0.6, fontFamily: MONO }}>{s.label}</div>
      <div style={{ fontSize: 36, fontWeight: 700, color: T.ink, marginTop: 4, lineHeight: 1, letterSpacing: -1 }}>{count}</div>
      <div style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 10, lineHeight: 1.45 }}>{caption}</div>
    </div>
  );
}

function EmptyBlock({ text }) {
  return (
    <div style={{ padding: "28px 20px", background: T.surface, border: `1px dashed ${T.line}`, borderRadius: 10, textAlign: "center", color: T.inkMuted, fontSize: 13.5 }}>
      {text}
    </div>
  );
}

// --- Finding card ----------------------------------------------------------
function FindingCard({ f, expanded, setExpanded, approveFix, dismiss, markIntentional, decideLater, rollBack, unstage, acknowledgeRecheck, showNotes }) {
  const tone = f.severity === "P0" ? T.p0 : f.severity === "P1" ? T.p1 : T.p2;
  // The "second look" prompt appears when a low-confidence finding has been staged
  // and the user has come back to re-expand it. The catch is genuinely theirs:
  // they had to navigate back to this card. The agent is re-presenting context,
  // not announcing a detection.
  const showSecondLook = f.needsRecheck && f.status === "staged" && expanded;

  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${showSecondLook ? T.warnBorder : T.line}`,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: expanded ? "0 1px 2px rgba(15, 23, 42, 0.04)" : "none",
      }}
    >
      {/* Collapsed row — scannable */}
      <button
        onClick={() => setExpanded(f.id)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: FONT, color: T.ink }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 18, height: 18 }}>
          <Icon.chevron width="14" height="14" style={{ transform: expanded ? "rotate(90deg)" : "rotate(0)", transition: "transform 140ms ease", color: T.inkFaint }} />
        </div>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: tone, flexShrink: 0 }} />
        <SeverityBadge sev={f.severity} />
        <ChipTag>{f.category}</ChipTag>
        <ChipTag tone={f.confidence === "low" ? "warn" : "ok"}>{f.confidence === "low" ? "Low confidence" : "High confidence"}</ChipTag>
        {f.reviewKind === "trivial" && (
          <ChipTag>
            <Icon.sparkle width="10" height="10" /> Trivial swap
          </ChipTag>
        )}
        {f.reviewKind === "judgment" && (
          <ChipTag tone="warn">
            <Icon.eye width="10" height="10" /> Needs judgment
          </ChipTag>
        )}
        {f.status === "staged" && <ChipTag tone="accent">Staged draft</ChipTag>}
        {f.status === "reviewed" && <ChipTag>Reviewed</ChipTag>}
        <span style={{ flex: 1, marginLeft: 8, minWidth: 0 }}>
          <span style={{ fontWeight: 600, fontSize: 14, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.title}</span>
          <span style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 3, display: "block" }}>
            {f.location}
            {f.foundAt && <span style={{ color: T.inkFaint, marginLeft: 8 }}>· found {f.foundAt}</span>}
          </span>
        </span>
        <span style={{ fontSize: 11, color: T.inkFaint, fontFamily: MONO, marginLeft: 8 }}>{f.id}</span>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div style={{ padding: "8px 22px 22px 48px", borderTop: `1px solid ${T.lineSoft}` }}>
          {/* Second-look prompt — appears when a low-confidence finding is re-opened from Staged */}
          {showSecondLook && (
            <div style={{ marginTop: 16, padding: "16px 18px", background: T.warnBg, border: `1px solid ${T.warnBorder}`, borderRadius: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.warn, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>
                <Icon.alert width="14" height="14" />
                Worth a second look before release
                <NoteMarker
                  show={showNotes}
                  label="Reversibility — the second-look moment"
                  body="The agent can detect drift but cannot judge intent. When confidence is low, the design asks the user to re-look before release rather than catching the error itself. Three layers of safety: agent flags uncertainty, user reviews, design keeps it reversible. The catch belongs to the human — the design just makes the catch possible."
                />
              </div>
              <p style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 1.6, marginTop: 10, marginBottom: 0 }}>
                The agent flagged this as low confidence. It can detect that the color differs from the system, but it cannot tell whether the difference is a mistake or intentional — that requires context only you have. In this case, the location is <em>Partner directory / Section banner</em>, which may be displaying a partner organization's required branding. If so, the staged fix would overwrite it. Roll back the staged draft if needed — nothing has been applied to production yet.
              </p>
              <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                <button onClick={() => rollBack(f.id)} style={primaryBtn}>
                  <Icon.undo width="14" height="14" /> Roll back the staged draft
                </button>
                <button onClick={() => acknowledgeRecheck(f.id)} style={secondaryBtn}>
                  Keep it staged — I've checked
                </button>
              </div>
            </div>
          )}

          {/* Source row */}
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", letterSpacing: 0.6 }}>Source</span>
            <SourceLink path={f.sourcePath} />
            <NoteMarker
              show={showNotes}
              label="Source linking — peer critique (Michael)"
              body="In production, every finding would link directly to the exact line of code, the corresponding Figma frame, or the live URL — so the user can jump straight to the origin instead of hunting for it. In this prototype the link is non-functional; hover shows what it would do."
            />
          </div>

          {/* Visual snapshot of the drift */}
          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", letterSpacing: 0.6 }}>Visual evidence</div>
              <NoteMarker
                show={showNotes}
                label="Visual snapshots — peer critique (Michael)"
                body="Drift is a visual problem, so the audit shows it visually — observed on the left, expected on the right. Text values are still shown below for precision, but the swatches let a designer recognize the issue at a glance instead of parsing hex codes."
              />
            </div>
            <DriftSnapshot f={f} />
          </div>

          {/* Detail grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 18 }}>
            <DetailBlock label="What drifted" body={f.drifted} />
            <DetailBlock label="Why it matters" body={f.why} />
            <DetailBlock label="Observed" mono body={f.observed} />
            <DetailBlock label="Expected" mono body={f.expected} />
          </div>

          {/* Suggested fix */}
          <div style={{ marginTop: 20, padding: "14px 16px", background: T.surfaceMuted, border: `1px solid ${T.line}`, borderRadius: 10 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", letterSpacing: 0.6 }}>
              <Icon.sparkle width="13" height="13" />
              Suggested fix
            </div>
            <div style={{ fontSize: 14, color: T.ink, marginTop: 8, lineHeight: 1.6 }}>{f.fix}</div>
          </div>

          {/* Actions — hidden when the second-look prompt is showing */}
          {!showSecondLook && (
            <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              {f.status === "open" && (
                <>
                  <button onClick={() => approveFix(f.id)} style={primaryBtn}>
                    <Icon.check width="14" height="14" /> Approve fix
                  </button>
                  <button
                    onClick={() => dismiss(f.id)}
                    style={secondaryBtn}
                    title="Removes from this report. The agent will re-check next run — if it still drifts, it comes back."
                  >
                    Not a real issue
                  </button>
                  <button
                    onClick={() => markIntentional(f.id)}
                    style={secondaryBtn}
                    title="Permanently suppresses re-flagging unless the underlying token changes. Use only when the drift is deliberate."
                  >
                    Allowed exception
                  </button>
                  <button onClick={() => decideLater(f.id)} style={ghostBtn}>
                    <Icon.eye width="14" height="14" /> Decide later
                  </button>
                </>
              )}
              {f.status === "reviewed" && (
                <span style={{ fontSize: 13, color: T.inkMuted }}>Reviewed and parked. Re-open to decide.</span>
              )}
              {f.status === "staged" && (
                <>
                  <span style={{ fontSize: 13, color: T.inkSoft, display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Icon.sparkle width="14" height="14" style={{ color: T.ok }} />
                    Staged as a draft. Will be released to engineering as part of your next pull request.
                  </span>
                  <button onClick={() => unstage(f.id)} style={{ ...ghostBtn, marginLeft: "auto" }}>
                    <Icon.undo width="13" height="13" /> Unstage
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailBlock({ label, body, mono }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.inkMuted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 13.5, color: T.inkSoft, lineHeight: 1.65, fontFamily: mono ? MONO : FONT, background: mono ? T.surfaceMuted : "transparent", padding: mono ? "8px 12px" : 0, border: mono ? `1px solid ${T.line}` : "none", borderRadius: mono ? 6 : 0, display: mono ? "inline-block" : "block" }}>{body}</div>
    </div>
  );
}

// --- Buttons ---------------------------------------------------------------
const baseBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "9px 14px",
  fontSize: 13.5,
  fontWeight: 600,
  border: "1px solid transparent",
  borderRadius: 8,
  cursor: "pointer",
  fontFamily: FONT,
  transition: "background 120ms, border-color 120ms",
};
const primaryBtn = {
  ...baseBtn,
  background: T.navy,
  color: "white",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.12)",
};
const secondaryBtn = {
  ...baseBtn,
  background: T.surface,
  color: T.inkSoft,
  borderColor: T.line,
};
const ghostBtn = {
  ...baseBtn,
  background: "transparent",
  color: T.inkMuted,
  fontWeight: 500,
  padding: "9px 12px",
};

// --- Digest view -----------------------------------------------------------
function DigestView({ findings, archive, showNotes, setView, stagedCount }) {
  const lowConf = findings.filter((f) => f.confidence === "low" && f.status !== "staged").length;
  const p0Open = findings.filter((f) => f.severity === "P0" && f.status === "open").length;

  return (
    <div>
      <Header
        kicker={<><Icon.moon width="13" height="13" /> While you were away</>}
        title="A short brief from your overnight agent"
        subtitle={`${SCENARIO.ran.date}, ${SCENARIO.ran.start} – ${SCENARIO.ran.end} UTC`}
        titleNote={
          <NoteMarker
            show={showNotes}
            label="Cadenced educational report — peer critique (Michael)"
            body="In a longer-term version, this digest would also include a slower-rhythm summary (weekly or monthly) that surfaces patterns over time — recurring drift sources, files where drift concentrates, and short educational notes for the developers who keep producing it. The goal: shift from catching drift to preventing it. The same trust mechanisms apply; only the cadence changes."
          />
        }
      />

      <div style={{ marginTop: 28, padding: "20px 22px", background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12 }}>
        <p style={{ margin: 0, fontSize: 15, color: T.ink, lineHeight: 1.6 }}>
          Quiet night. I scanned the production build and only surfaced what you'd want to see. Everything routine has been folded away.
        </p>
        <NoteMarker
          show={showNotes}
          label="Legibility — exception-based oversight"
          body="The digest is not a log. It tells the user what's worth their attention, then says what was filtered. This is exception-based oversight (Module 1) — the agent did 1,284 component checks but only surfaces what changes a human's decision."
        />
      </div>

      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <DigestTile
          kind="alert"
          tone={p0Open > 0 ? "error" : "neutral"}
          icon={Icon.alert}
          title={`${p0Open} P0 finding${p0Open === 1 ? "" : "s"} need a decision`}
          body="Accessibility and compliance items. I won't auto-apply anything, but these are the first I'd look at."
        />
        <DigestTile
          kind="alert"
          tone={lowConf > 0 ? "warn" : "neutral"}
          icon={Icon.alert}
          title={`${lowConf} low-confidence flag${lowConf === 1 ? "" : "s"} — please look closely`}
          body="I couldn't tell whether a color on the partner banner is drift or intentional. Your call."
        />
        <DigestTile
          kind="status"
          tone="ok"
          icon={Icon.sparkle}
          title={`${stagedCount} staged draft${stagedCount === 1 ? "" : "s"} ready for review`}
          body="Nothing has been applied. You can roll back any draft instantly."
        />
        <DigestTile
          kind="status"
          tone="ok"
          icon={Icon.shield}
          title="Stayed inside boundaries"
          body="Did not modify production code. Did not change anything without approval. As configured."
          note={showNotes && {
            label: "Boundaries — agent self-reporting",
            body: "The agent reports on its own compliance with the rules. Most agentic interfaces show what the agent did; few show what it chose not to do. That's a distinct trust signal."
          }}
        />
      </div>

      <button
        onClick={() => setView("audit")}
        style={{ marginTop: 28, display: "inline-flex", alignItems: "center", gap: 10, padding: "11px 18px", background: T.navy, color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}
      >
        Open the full audit report
        <Icon.chevron width="14" height="14" />
      </button>

      {/* Activity log */}
      <div style={{ marginTop: 44 }}>
        <SectionLabel>Activity log</SectionLabel>
        <div style={{ marginTop: 14, background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, overflow: "hidden" }}>
          {[
            { t: "02:14", body: "Started overnight audit. Scope: production build, 47 routes." },
            { t: "02:31", body: "Snapshot diffed against design-token bundle v4.12.0." },
            { t: "03:09", body: "Found 2 P0, 1 P1, 1 P2 candidates. 1 marked low-confidence." },
            { t: "03:41", body: "Held back on auto-applying any change — outside my permissions, as configured." },
            { t: "03:47", body: "Audit complete. Report ready for review." },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 24, padding: "12px 18px", borderTop: i === 0 ? "none" : `1px solid ${T.lineSoft}`, fontSize: 13.5 }}>
              <span style={{ width: 64, color: T.inkMuted, fontFamily: MONO, fontSize: 12.5 }}>{row.t} UTC</span>
              <span style={{ color: T.inkSoft }}>{row.body}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DigestTile({ tone, icon: IconEl, title, body, note }) {
  const map = {
    error: { bg: T.p0Bg, border: T.p0Border, fg: T.p0 },
    warn: { bg: T.warnBg, border: T.warnBorder, fg: T.warn },
    ok: { bg: T.okBg, border: T.okBorder, fg: T.ok },
    neutral: { bg: T.surface, border: T.line, fg: T.inkSoft },
  };
  const s = map[tone];
  return (
    <div style={{ padding: "18px 20px", background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, color: s.fg, fontWeight: 600, fontSize: 14 }}>
        <IconEl width="16" height="16" />
        {title}
        {note && <NoteMarker show={true} label={note.label} body={note.body} />}
      </div>
      <p style={{ margin: "8px 0 0", fontSize: 13, color: tone === "neutral" ? T.inkMuted : s.fg, lineHeight: 1.55, opacity: tone === "neutral" ? 1 : 0.9 }}>{body}</p>
    </div>
  );
}

// --- Boundaries view -------------------------------------------------------
function BoundariesView({ autonomy, setAutonomy, showNotes }) {
  const cats = [
    { id: "Color", desc: "Detects raw hex values and off-palette colors." },
    { id: "Typography", desc: "Detects font sizes, weights, and line-heights outside the type scale." },
    { id: "Spacing", desc: "Detects padding, margin, and gap values outside the spacing scale." },
    { id: "Components", desc: "Detects legacy or off-standard component instances." },
    { id: "Accessibility", desc: "Detects contrast and focus-state failures.", lockedTo: "flag-only", lockNote: "Compliance-critical findings always require human review — cannot be set to auto-draft." },
  ];

  return (
    <div>
      <Header
        kicker={<><Icon.lock width="13" height="13" /> Agent boundaries</>}
        title="What the agent can — and can never — do"
        subtitle="You set the standards (the design tokens) and the constraints. The agent works inside them."
        titleNote={
          <NoteMarker
            show={showNotes}
            label="Earlier-in-workflow integration — peer critique (Anna)"
            body="Today the agent runs nightly against the shipped product — it catches drift after it's there. A natural extension is to run the same checks earlier: on a pull request before merge, on a Figma file before handoff, or inside the design tool itself. The same trust architecture (boundaries, staging, low-confidence flagging, release approval) would carry over to those earlier stages."
          />
        }
      />

      <div style={{ marginTop: 28, padding: "24px 26px", background: T.navy, borderRadius: 12, color: "#E5E7EB" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, color: "#FCA5A5", textTransform: "uppercase", letterSpacing: 0.7 }}>
          <Icon.shield width="13" height="13" />
          Never zone — system enforced, not a setting
          <NoteMarker
            show={showNotes}
            label="Boundaries as capability, not instruction"
            body="The most important boundary is not an instruction the agent is asked to honor — it is a capability the agent doesn't have. The agent literally cannot apply changes to production. That is what makes silent failure impossible by design."
          />
        </div>
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 32px" }}>
          {[
            "Cannot modify production code.",
            "Cannot apply any change without your explicit approval.",
            "Cannot disable or weaken accessibility checks.",
            "Cannot edit the design-token source of truth.",
            "Cannot expand its own permissions or autonomy settings.",
            "Cannot run outside the audit window (02:00–04:00 UTC).",
          ].map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#E5E7EB" }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "#FCA5A5", flexShrink: 0, marginTop: 8 }} />
              <span>{line}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: 12.5, color: "#9CA3AF" }}>
          These are non-negotiable. They cannot be relaxed from this screen.
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon.shield width="17" height="17" />
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Per-category autonomy</h2>
          <NoteMarker
            show={showNotes}
            label="Progressive autonomy"
            body="Autonomy is set per drift category, not globally. The user starts at 'flag only' for categories they don't trust yet, and moves categories to 'flag + draft fix' as confidence builds. Match autonomy to consequence — Module 1."
          />
        </div>
        <p style={{ fontSize: 14, color: T.inkMuted, marginTop: 10, lineHeight: 1.6, maxWidth: 720 }}>
          For each drift category, choose how far the agent goes. <em>Flag only</em> means it reports and waits. <em>Flag + draft fix</em> means it also prepares a staged draft for you to approve. Either way, nothing reaches production without your approval.
        </p>

        <div style={{ marginTop: 18, background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, overflow: "hidden" }}>
          {cats.map((c, i) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderTop: i === 0 ? "none" : `1px solid ${T.lineSoft}`, gap: 24 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{c.id}</div>
                <div style={{ fontSize: 13, color: T.inkMuted, marginTop: 3 }}>{c.desc}</div>
                {c.lockedTo && <div style={{ fontSize: 12, color: T.warn, marginTop: 6, fontStyle: "italic" }}>{c.lockNote}</div>}
              </div>
              <AutonomyToggle
                value={c.lockedTo || autonomy[c.id]}
                disabled={!!c.lockedTo}
                onChange={(v) => setAutonomy((a) => ({ ...a, [c.id]: v }))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AutonomyToggle({ value, onChange, disabled }) {
  const opts = [
    { id: "flag-only", label: "Flag only" },
    { id: "flag+draft", label: "Flag + draft fix" },
  ];
  return (
    <div style={{ display: "inline-flex", padding: 3, background: T.surfaceMuted, border: `1px solid ${T.line}`, borderRadius: 8, opacity: disabled ? 0.5 : 1 }}>
      {opts.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => !disabled && onChange(o.id)}
            disabled={disabled}
            style={{ padding: "6px 12px", fontSize: 12.5, fontWeight: 500, background: active ? T.surface : "transparent", color: active ? T.ink : T.inkMuted, border: active ? `1px solid ${T.line}` : "1px solid transparent", borderRadius: 6, cursor: disabled ? "not-allowed" : "pointer", fontFamily: FONT, boxShadow: active ? "0 1px 1px rgba(15,23,42,0.04)" : "none" }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// --- Archive view ----------------------------------------------------------
function ArchiveView({ archive, restore, showNotes, filter, setFilter }) {
  const filtered = filter === "all" ? archive : archive.filter((f) => f.status === filter);
  const counts = {
    all: archive.length,
    released: archive.filter((f) => f.status === "released").length,
    dismissed: archive.filter((f) => f.status === "dismissed").length,
    intentional: archive.filter((f) => f.status === "intentional").length,
  };

  const statusChip = (status) => {
    if (status === "released") return { label: "Released", tone: "ok" };
    if (status === "dismissed") return { label: "Dismissed", tone: "neutral" };
    if (status === "intentional") return { label: "Allowed exception", tone: "accent" };
    return { label: status, tone: "neutral" };
  };

  return (
    <div>
      <Header
        kicker={<><Icon.archive width="13" height="13" /> Archive</>}
        title="Nothing is permanently deleted"
        subtitle="Released, dismissed, and intentional findings live here. Restore any of them in one click and they'll re-appear in your audit report."
      />

      <div style={{ marginTop: 18, padding: "12px 16px", background: "#EEF2FF", border: `1px solid #C7D2FE`, borderRadius: 10, display: "flex", alignItems: "center", gap: 10, color: "#3730A3", fontSize: 13 }}>
        <Icon.info width="15" height="15" />
        <span>Allowed exceptions won't be re-flagged. They will be re-checked automatically if the underlying token or standard changes <em style={{ color: "#4F46E5" }}>(future behavior)</em>.</span>
        <NoteMarker
          show={showNotes}
          label="Reversibility — the backup plan"
          body="'Not a real issue' and 'Allowed exception' could be the dangerous actions: if the user is wrong, the finding disappears and the problem becomes invisible. Archive turns those into reversible acts. Nothing is a trapdoor."
        />
      </div>

      {/* Filter chips */}
      {archive.length > 0 && (
        <div style={{ marginTop: 22, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { id: "all", label: "All" },
            { id: "released", label: "Released" },
            { id: "dismissed", label: "Dismissed" },
            { id: "intentional", label: "Allowed exception" },
          ].map((opt) => {
            const active = filter === opt.id;
            const c = counts[opt.id];
            return (
              <button
                key={opt.id}
                onClick={() => setFilter(opt.id)}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 12px", fontSize: 12.5, fontWeight: 500, background: active ? T.navy : T.surface, color: active ? "white" : T.inkSoft, border: `1px solid ${active ? T.navy : T.line}`, borderRadius: 999, cursor: "pointer", fontFamily: FONT }}
              >
                {opt.label}
                <span style={{ fontSize: 11, padding: "1px 7px", borderRadius: 999, background: active ? "rgba(255,255,255,0.18)" : T.surfaceMuted, color: active ? "white" : T.inkMuted, fontFamily: MONO }}>{c}</span>
              </button>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 22 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "44px 20px", background: T.surface, border: `1px dashed ${T.line}`, borderRadius: 12, textAlign: "center", color: T.inkMuted, fontSize: 14 }}>
            {archive.length === 0
              ? "The archive is empty. Dismiss, mark intentional, or release a staged draft and it will appear here."
              : `No ${filter} findings yet.`}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((f) => {
              const chip = statusChip(f.status);
              return (
                <div key={f.id} style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                  <SeverityBadge sev={f.severity} />
                  <ChipTag>{f.category}</ChipTag>
                  <ChipTag tone={chip.tone}>{chip.label}</ChipTag>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{f.title}</div>
                    <div style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 3 }}>
                      {f.location} · {f.archivedAt}
                      {f.releasedAs && <> · Pull request <span style={{ fontFamily: MONO, color: T.ok }}>{f.releasedAs}</span></>}
                    </div>
                    {f.dismissReason && <div style={{ fontSize: 12, color: T.inkSoft, marginTop: 6, fontStyle: "italic" }}>Reason: "{f.dismissReason}"</div>}
                  </div>
                  {f.status !== "released" && (
                    <button onClick={() => restore(f.id)} style={secondaryBtn}>
                      <Icon.undo width="13" height="13" /> Restore
                    </button>
                  )}
                  {f.status === "released" && (
                    <span style={{ fontSize: 12, color: T.inkMuted, fontStyle: "italic" }}>Owned by engineering — can't restore from here</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Dismiss confirmation modal --------------------------------------------
function DismissConfirmModal({ id, finding, onCancel, onConfirm }) {
  const [reason, setReason] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, fontFamily: FONT }}>
      <div style={{ width: 480, background: T.surface, borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.18)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.lineSoft}` }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.p0, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>
            <Icon.alert width="13" height="13" />
            Marking a P0 as "Not a real issue"
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: "10px 0 0" }}>Are you sure this isn't a real problem?</h3>
          <p style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 10, lineHeight: 1.6, marginBottom: 0 }}>
            P0 findings break accessibility or compliance commitments. Removing it takes it out of this report. The agent <strong>will re-check on the next run</strong> — if it still drifts, it comes back. Use "Allowed exception" if you want to suppress it permanently.
          </p>
          <div style={{ marginTop: 12, padding: "10px 12px", background: T.surfaceMuted, border: `1px solid ${T.line}`, borderRadius: 8, fontSize: 13, color: T.inkSoft }}>
            <strong style={{ color: T.ink }}>{finding.title}</strong><br />
            <span style={{ color: T.inkMuted, fontSize: 12.5 }}>{finding.location}</span>
          </div>
        </div>
        <div style={{ padding: "16px 24px 20px" }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: T.inkMuted, display: "block", marginBottom: 6 }}>Reason (optional, helps your team)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. False positive — confirmed by accessibility team."
            style={{ width: "100%", minHeight: 70, padding: "10px 12px", border: `1px solid ${T.line}`, borderRadius: 8, fontSize: 13.5, fontFamily: FONT, color: T.ink, resize: "vertical", boxSizing: "border-box" }}
          />
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={onCancel} style={secondaryBtn}>Keep it in the report</button>
            <button onClick={() => onConfirm(reason || null)} style={{ ...primaryBtn, background: T.p0 }}>Yes, remove this P0</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Release confirmation modal --------------------------------------------
function ReleaseConfirmModal({ stagedFindings, prNumber, onCancel, onConfirm }) {
  const count = stagedFindings.length;
  const defaultBody = buildPrBody(stagedFindings, prNumber);
  const [body, setBody] = useState(defaultBody);
  const [title, setTitle] = useState(`design-system: ${count} drift fix${count === 1 ? "" : "es"} from overnight audit`);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, fontFamily: FONT, padding: 20, overflowY: "auto" }}>
      <div style={{ width: 640, background: T.surface, borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.18)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.lineSoft}` }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.ok, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>
            <Icon.sparkle width="13" height="13" />
            Release to engineering
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: "10px 0 0" }}>
            Release {count} fix{count === 1 ? "" : "es"} as pull request <span style={{ fontFamily: MONO, color: T.ok }}>{prNumber}</span>?
          </h3>
          <p style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 10, lineHeight: 1.6, marginBottom: 0 }}>
            This is the handoff to engineering. Review and edit the PR title and body below — what you write here is what they'll read. Nothing is applied to the live product until they merge.
          </p>
        </div>

        <div style={{ padding: "16px 24px", overflowY: "auto", flex: 1 }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: T.inkMuted, display: "block", marginBottom: 6 }}>Pull request title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "9px 12px", border: `1px solid ${T.line}`, borderRadius: 8, fontSize: 13.5, fontFamily: FONT, color: T.ink, boxSizing: "border-box" }}
          />

          <label style={{ fontSize: 12.5, fontWeight: 600, color: T.inkMuted, display: "block", margin: "14px 0 6px" }}>Pull request body (Markdown)</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{ width: "100%", minHeight: 220, padding: "10px 12px", border: `1px solid ${T.line}`, borderRadius: 8, fontSize: 12.5, fontFamily: MONO, lineHeight: 1.55, color: T.ink, resize: "vertical", boxSizing: "border-box", background: T.surfaceMuted }}
          />

          <div style={{ marginTop: 12, fontSize: 12, color: T.inkMuted, lineHeight: 1.55 }}>
            Engineering will see the body above on the PR. Edit anything that needs more context for them — risk notes, deploy timing, who approved what.
          </div>
        </div>

        <div style={{ padding: "12px 24px 20px", borderTop: `1px solid ${T.lineSoft}`, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onCancel} style={secondaryBtn}>Not yet — keep them staged</button>
          <button onClick={onConfirm} style={primaryBtn}>
            <Icon.sparkle width="14" height="14" /> Yes, open pull request
          </button>
        </div>
      </div>
    </div>
  );
}

function buildPrBody(staged, prNumber) {
  const lines = [];
  lines.push(`## Summary`);
  lines.push(``);
  lines.push(`Drift Sentinel found ${staged.length} design-system drift${staged.length === 1 ? "" : "s"} in the overnight audit and staged ${staged.length === 1 ? "a fix" : "fixes"} for review. All ${staged.length === 1 ? "has" : "have"} been approved by design. This PR applies the staged token swaps.`);
  lines.push(``);
  lines.push(`## Changes`);
  lines.push(``);
  staged.forEach((f) => {
    lines.push(`- **[${f.severity}] ${f.title}**`);
    lines.push(`  - File: \`${f.sourcePath}\``);
    lines.push(`  - Observed: ${f.observed}`);
    lines.push(`  - Expected: ${f.expected}`);
    lines.push(`  - Fix: ${f.fix}`);
    lines.push(``);
  });
  lines.push(`## Notes for review`);
  lines.push(``);
  lines.push(`- No behavior changes — visual / token swaps only.`);
  lines.push(`- Reference: Drift Sentinel audit ${prNumber}`);
  return lines.join("\n");
}


// --- Allowed exception confirmation modal ----------------------------------
function IntentionalConfirmModal({ finding, onCancel, onConfirm }) {
  const [reason, setReason] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, fontFamily: FONT }}>
      <div style={{ width: 500, background: T.surface, borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.18)", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.lineSoft}` }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#3730A3", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>
            <Icon.lock width="13" height="13" />
            Marking as allowed exception
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: "10px 0 0" }}>This will suppress re-flagging.</h3>
          <p style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 10, lineHeight: 1.6, marginBottom: 0 }}>
            Allowed exceptions <strong>aren't re-checked on future runs</strong> unless the underlying token or standard changes. Use this only when the drift is deliberate — e.g., partner-mandated branding, a documented legacy area, or an approved one-off. If you're not sure, choose "Not a real issue" instead — the agent will re-evaluate next run.
          </p>
          <div style={{ marginTop: 12, padding: "10px 12px", background: T.surfaceMuted, border: `1px solid ${T.line}`, borderRadius: 8, fontSize: 13, color: T.inkSoft }}>
            <strong style={{ color: T.ink }}>{finding.title}</strong><br />
            <span style={{ color: T.inkMuted, fontSize: 12.5 }}>{finding.location}</span>
          </div>
        </div>
        <div style={{ padding: "16px 24px 20px" }}>
          <label style={{ fontSize: 12.5, fontWeight: 600, color: T.inkMuted, display: "block", marginBottom: 6 }}>Why is this exception allowed? (helps your team and your future self)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Acme is a partner — their brand orange is required on this banner per contract."
            style={{ width: "100%", minHeight: 80, padding: "10px 12px", border: `1px solid ${T.line}`, borderRadius: 8, fontSize: 13.5, fontFamily: FONT, color: T.ink, resize: "vertical", boxSizing: "border-box" }}
          />
          <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={onCancel} style={secondaryBtn}>Cancel</button>
            <button onClick={() => onConfirm(reason || null)} style={{ ...primaryBtn, background: "#3730A3" }}>
              <Icon.lock width="13" height="13" /> Confirm — allow this exception
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Exemptions inventory modal --------------------------------------------
function ExemptionsModal({ exemptions, archivedIntentional, onClose }) {
  const all = [
    ...archivedIntentional.map((f) => ({ id: f.id, title: f.title, category: f.category, markedAt: f.archivedAt, reason: f.dismissReason, fresh: true })),
    ...exemptions.map((e) => ({ ...e, fresh: false })),
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, fontFamily: FONT, padding: 20 }}>
      <div style={{ width: 640, background: T.surface, borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.18)", overflow: "hidden", maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.lineSoft}` }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#3730A3", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>
            <Icon.lock width="13" height="13" />
            Active allowed exceptions
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: "10px 0 0" }}>{all.length} finding{all.length === 1 ? "" : "s"} the agent has been told to ignore</h3>
          <p style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 10, lineHeight: 1.6, marginBottom: 0 }}>
            Each of these was once a finding that you marked as an allowed exception. The agent doesn't re-flag them — unless the underlying token or standard changes. You can revoke an exception any time from the Archive.
          </p>
        </div>
        <div style={{ padding: "12px 24px 18px", overflowY: "auto", flex: 1 }}>
          {all.length === 0 && (
            <div style={{ padding: "30px 16px", background: T.surfaceMuted, border: `1px dashed ${T.line}`, borderRadius: 10, textAlign: "center", color: T.inkMuted, fontSize: 13.5 }}>
              No allowed exceptions on file.
            </div>
          )}
          {all.map((e) => (
            <div key={e.id} style={{ padding: "12px 14px", background: T.surface, border: `1px solid ${T.line}`, borderRadius: 10, marginTop: 8, display: "flex", alignItems: "flex-start", gap: 12 }}>
              <ChipTag>{e.category}</ChipTag>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{e.title}</div>
                <div style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 3 }}>
                  Marked {e.markedAt}
                  {e.fresh && <span style={{ marginLeft: 8, color: T.ok }}>· just now</span>}
                </div>
                {e.reason && <div style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 6, fontStyle: "italic" }}>"{e.reason}"</div>}
              </div>
              <span style={{ fontFamily: MONO, fontSize: 11, color: T.inkFaint }}>{e.id}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 24px 18px", borderTop: `1px solid ${T.lineSoft}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: T.inkMuted }}>To revoke an exception, open Archive and Restore.</span>
          <button onClick={onClose} style={secondaryBtn}>Close</button>
        </div>
      </div>
    </div>
  );
}

// --- Demo scenario banner --------------------------------------------------
function DemoBanner({ onDismiss }) {
  return (
    <div style={{ marginBottom: 24, padding: "14px 16px 14px 18px", background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 12, display: "flex", alignItems: "flex-start", gap: 14, color: "#312E81" }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: "#4F46E5", color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon.info width="15" height="15" />
      </div>
      <div style={{ flex: 1, fontSize: 13.5, lineHeight: 1.6 }}>
        <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 13 }}>Demo scenario — read me first</div>
        <div>
          You're seeing the morning after one overnight audit. Four findings are loaded. To walk through the trust architecture, try this sequence:
          <ol style={{ margin: "8px 0 0", paddingLeft: 20 }}>
            <li>Expand any finding to see the visual evidence and suggested fix.</li>
            <li>Approve <strong>F-04</strong> (the P2 banner), then re-open it from <em>Staged drafts</em> below — the second-look prompt appears, because the agent flagged it as low confidence.</li>
            <li>Try <em>Allowed exception</em> on a finding to see the suppression confirmation, or <em>Release</em> staged drafts to see the PR handoff.</li>
            <li>Toggle <em>Design notes</em> in the top bar for inline commentary on each decision.</li>
          </ol>
        </div>
      </div>
      <button onClick={onDismiss} style={{ background: "transparent", border: "none", color: "#4F46E5", cursor: "pointer", padding: 4, fontSize: 18, lineHeight: 1, flexShrink: 0 }} aria-label="Dismiss demo banner">×</button>
    </div>
  );
}

// --- Toast -----------------------------------------------------------------
function Toast({ toast, pause, resume, dismiss }) {
  return (
    <div
      onMouseEnter={pause}
      onMouseLeave={resume}
      style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 90, background: T.navy, color: "white", padding: "12px 16px 12px 18px", borderRadius: 10, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", gap: 14, fontSize: 13.5, fontFamily: FONT, maxWidth: 560 }}
    >
      <Icon.sparkle width="15" height="15" />
      <span style={{ flex: 1 }}>{toast.message}</span>
      {toast.undo && (
        <button
          onClick={() => { toast.undo(); dismiss(); }}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "white", borderRadius: 6, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}
        >
          <Icon.undo width="12" height="12" /> Undo
        </button>
      )}
      <button onClick={dismiss} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: 4, fontSize: 16, lineHeight: 1 }}>×</button>
    </div>
  );
}
