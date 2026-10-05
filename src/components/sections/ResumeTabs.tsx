"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Download, ExternalLink } from "lucide-react";
import SmoothTab from "@/components/effects/vendor/SmoothTab";
import { SoftButton } from "@/components/ui/SoftButton";
import type { ResumeVersion } from "@/lib/resume";

/**
 * Résumé versions as tabs. The selected version lives in the URL hash
 * (/resume#dev) so a link can open straight to it; switching tabs replaces
 * the hash rather than adding history entries.
 */

const hashListeners = new Set<() => void>();
function subscribeHash(onChange: () => void) {
  hashListeners.add(onChange);
  window.addEventListener("hashchange", onChange);
  return () => {
    hashListeners.delete(onChange);
    window.removeEventListener("hashchange", onChange);
  };
}
function setHash(id: string) {
  history.replaceState(null, "", `#${id}`);
  hashListeners.forEach((notify) => notify());
}

export function ResumeTabs({ versions, name }: { versions: ResumeVersion[]; name: string }) {
  const ids = versions.map((v) => v.id as string);
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash.slice(1), () => "");
  const selectedId = ids.includes(hash) ? hash : ids[0];
  const [direction, setDirection] = useState(0);

  const select = (id: string) => {
    if (id === selectedId) return;
    setDirection(ids.indexOf(id) > ids.indexOf(selectedId) ? 1 : -1);
    setHash(id);
  };

  return (
    <SmoothTab
      label="Résumé versions"
      idPrefix="resume"
      selectedId={selectedId}
      direction={direction}
      onSelect={select}
      items={versions.map((version) => ({
        id: version.id,
        label: `${version.label} résumé`,
        title: (
          <>
            <span className="hidden sm:inline">For </span>
            <span className="sm:lowercase">{version.label}</span>
          </>
        ),
        content: <ResumePanel version={version} name={name} />,
      }))}
    />
  );
}

function ResumePanel({ version, name }: { version: ResumeVersion; name: string }) {
  const title = `${version.label} résumé`;

  if (!version.href) {
    return (
      <div className="surface rounded-lg px-6 py-12 text-center sm:px-10">
        <p className="title text-lg font-semibold text-fg">The {version.label.toLowerCase()} résumé isn&apos;t up yet</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Another version may cover what you need, or{" "}
          <Link href="/connect" className="text-accent-text underline-offset-4 hover:underline">
            ask me for it
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="surface rounded-lg p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="title text-xl font-semibold text-fg">{title}</h2>
          <p className="meta mt-1 text-subtle">PDF, refreshed whenever the site rebuilds.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <SoftButton href={version.href} download={version.fileName} tone="primary">
            <Download aria-hidden="true" className="size-4" />
            Download PDF
          </SoftButton>
          <SoftButton href={version.href} target="_blank" rel="noreferrer">
            <ExternalLink aria-hidden="true" className="size-4" />
            Open in new tab
          </SoftButton>
        </div>
      </div>

      {/* Inline preview on screens wide enough to read it; phones open the PDF instead. */}
      <iframe
        src={`${version.href}#view=FitH`}
        title={`${name}, ${title} (preview)`}
        loading="lazy"
        className="mt-8 hidden h-[min(80vh,64rem)] w-full rounded-md border border-line bg-surface-2 md:block"
      />
    </div>
  );
}
