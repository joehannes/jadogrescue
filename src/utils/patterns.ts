/**
 * Subtle, topic-fitting SVG background patterns (paws, bones, waves, dots,
 * topographic "map" lines). Each returns a CSS `background-image` value you
 * can drop onto any Box, tinted and sized to taste.
 *
 * Keep opacity low (0.04–0.12) so patterns whisper rather than shout, and let
 * neighbouring sections use different motifs that still share the palette.
 */

const enc = (svg: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s{2,}/g, ' ').trim())}")`;

/** Scattered paw prints — the signature motif. */
export function paws(color = '#004E89', opacity = 0.08, size = 90): string {
  const c = color;
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 90 90'>
    <g fill='${c}' fill-opacity='${opacity}'>
      <g transform='translate(18 20)'>
        <ellipse cx='0' cy='6' rx='4' ry='6'/><ellipse cx='11' cy='0' rx='3.4' ry='5'/>
        <ellipse cx='22' cy='6' rx='4' ry='6'/><ellipse cx='11' cy='16' rx='7' ry='6'/>
      </g>
      <g transform='translate(56 55) rotate(20)'>
        <ellipse cx='0' cy='6' rx='3.4' ry='5'/><ellipse cx='9' cy='0' rx='3' ry='4.4'/>
        <ellipse cx='18' cy='6' rx='3.4' ry='5'/><ellipse cx='9' cy='14' rx='6' ry='5'/>
      </g>
    </g>
  </svg>`;
  return enc(svg);
}

/** Dog bones. */
export function bones(color = '#FF6B35', opacity = 0.07, size = 120): string {
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 120 120'>
    <g fill='${color}' fill-opacity='${opacity}'>
      <g transform='translate(20 30) rotate(-25)'>
        <circle cx='0' cy='0' r='5'/><circle cx='0' cy='9' r='5'/>
        <circle cx='34' cy='0' r='5'/><circle cx='34' cy='9' r='5'/>
        <rect x='0' y='0' width='34' height='9' rx='2'/>
      </g>
      <g transform='translate(66 78) rotate(20)'>
        <circle cx='0' cy='0' r='4'/><circle cx='0' cy='7' r='4'/>
        <circle cx='26' cy='0' r='4'/><circle cx='26' cy='7' r='4'/>
        <rect x='0' y='0' width='26' height='7' rx='2'/>
      </g>
    </g>
  </svg>`;
  return enc(svg);
}

/** Rolling ocean waves (Caribbean / rainwater). */
export function waves(color = '#1A936F', opacity = 0.08, size = 80): string {
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size / 2}' viewBox='0 0 80 40'>
    <path d='M0 20 Q 20 4 40 20 T 80 20' fill='none' stroke='${color}' stroke-opacity='${opacity}' stroke-width='3'/>
    <path d='M0 32 Q 20 16 40 32 T 80 32' fill='none' stroke='${color}' stroke-opacity='${opacity}' stroke-width='3'/>
  </svg>`;
  return enc(svg);
}

/** Soft dot grid. */
export function dots(color = '#004E89', opacity = 0.1, size = 26): string {
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 26 26'>
    <circle cx='2' cy='2' r='2' fill='${color}' fill-opacity='${opacity}'/>
  </svg>`;
  return enc(svg);
}

/** Topographic "map" contour lines — nods to the shelter map. */
export function topo(color = '#004E89', opacity = 0.06, size = 140): string {
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 140 140'>
    <g fill='none' stroke='${color}' stroke-opacity='${opacity}' stroke-width='2'>
      <path d='M-10 40 Q 40 10 90 40 T 190 40'/>
      <path d='M-10 70 Q 40 40 90 70 T 190 70'/>
      <path d='M-10 100 Q 40 70 90 100 T 190 100'/>
    </g>
  </svg>`;
  return enc(svg);
}

/** Recycled plastic bottles — the building block of every shelter. */
export function bottles(color = '#1A936F', opacity = 0.07, size = 120): string {
  const bottle = `
    <g stroke='${color}' stroke-opacity='${opacity}' stroke-width='2' fill='none'>
      <path d='M-3 -8 h6 v3 q4 2 4 7 v18 q0 4 -4 4 h-6 q-4 0 -4 -4 v-18 q0 -5 4 -7 z'/>
      <line x1='-6' y1='2' x2='6' y2='2'/>
    </g>`;
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 120 120'>
    <g transform='translate(28 24) rotate(-12)'>${bottle}</g>
    <g transform='translate(84 74) rotate(14)'>${bottle}</g>
  </svg>`;
  return enc(svg);
}

/** Palm / coconut fronds — the natural fiber insulation. */
export function palm(color = '#1A936F', opacity = 0.07, size = 130): string {
  const frond = `
    <g stroke='${color}' stroke-opacity='${opacity}' stroke-width='2' fill='none' stroke-linecap='round'>
      <path d='M0 0 Q 22 -6 44 2'/>
      <path d='M8 -1 l6 -8'/><path d='M18 -2 l6 -9'/><path d='M28 -1 l6 -8'/><path d='M38 1 l5 -7'/>
      <path d='M8 0 l5 8'/><path d='M18 0 l6 9'/><path d='M28 1 l6 8'/><path d='M38 2 l5 7'/>
    </g>`;
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 130 130'>
    <g transform='translate(14 30) rotate(-8)'>${frond}</g>
    <g transform='translate(70 92) rotate(10)'>${frond}</g>
  </svg>`;
  return enc(svg);
}

/** Diagonal cross-hatch grid — a quiet, neutral texture for plain panels. */
export function grid(color = '#004E89', opacity = 0.05, size = 44): string {
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 44 44'>
    <g stroke='${color}' stroke-opacity='${opacity}' stroke-width='1.5'>
      <path d='M0 22 h44'/><path d='M22 0 v44'/>
    </g>
  </svg>`;
  return enc(svg);
}
