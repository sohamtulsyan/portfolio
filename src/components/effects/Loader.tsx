import LatticeLoader from "./vendor/LatticeLoader";

/** React Bits Lattice Loader (sweep, 4×4, glow) coloured by --loader-* tokens. */
export default function Loader({ label = "Loading", size = 9 }: { label?: string; size?: number }) {
  return (
    <LatticeLoader
      pattern="sweep"
      grid={4}
      glow
      shape="round"
      color="var(--loader-color)"
      glowColor="var(--loader-glow)"
      cellSize={size}
      gap={Math.round(size / 3)}
      fontSize={15}
      label={label}
      showTimer={false}
      className="text-muted"
    />
  );
}
