import { SoftButton } from "@/components/ui/SoftButton";

export default function NotFound() {
  return (
    <section className="container-page grid min-h-[70svh] content-center pt-28">
      <p className="display text-subtle">404</p>
      <h1 className="mt-6 text-2xl font-semibold">This page doesn&apos;t exist</h1>
      <p className="measure mt-3 text-muted">The link may be old, or the page moved. Head home and pick a path from there.</p>
      <div className="mt-8">
        <SoftButton href="/" tone="primary">Go home</SoftButton>
      </div>
    </section>
  );
}
