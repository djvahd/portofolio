const RINGS = Array.from({ length: 7 }, (_, i) => i)

export function ContourBackground() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className="contour-drift pointer-events-none absolute inset-0 h-full w-full"
      fill="none"
    >
      <defs>
        <path
          id="contour"
          d="M500 140C650 120 800 210 850 360C900 510 820 660 680 740C540 820 360 840 240 740C120 640 110 460 190 330C270 200 390 155 500 140Z"
        />
      </defs>
      {RINGS.map((i) => (
        <use
          key={i}
          href="#contour"
          stroke="var(--line)"
          strokeWidth={1.2}
          transform={`translate(500 500) rotate(${i * 7}) scale(${0.35 + i * 0.2}) translate(-500 -500)`}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}
