import React from 'react';
import { Box, useToken } from '@chakra-ui/react';

type Variant = 'wave' | 'curve' | 'tilt' | 'scallop' | 'drip';

interface SectionDividerProps {
  /** Chakra color token of the section the curve reveals (usually the NEXT section). */
  color?: string;
  variant?: Variant;
  /** 'bottom' sits at the base of the current section; 'top' caps the next one. */
  position?: 'bottom' | 'top';
  flip?: boolean;
  height?: { base: number; md: number } | number;
}

const paths: Record<Variant, string> = {
  // gentle asymmetric wave
  wave: 'M0,40 C240,120 480,0 720,50 C960,100 1200,20 1440,60 L1440,120 L0,120 Z',
  // single soft hill
  curve: 'M0,120 L0,60 Q720,-20 1440,60 L1440,120 Z',
  // diagonal tilt
  tilt: 'M0,120 L1440,20 L1440,120 Z',
  // rounded scallops (paw-pad feel)
  scallop:
    'M0,120 L0,70 Q90,10 180,70 Q270,10 360,70 Q450,10 540,70 Q630,10 720,70 Q810,10 900,70 Q990,10 1080,70 Q1170,10 1260,70 Q1350,10 1440,70 L1440,120 Z',
  // playful drips
  drip: 'M0,120 L0,50 Q120,50 140,80 Q160,50 300,50 Q520,50 540,90 Q560,50 760,50 Q980,50 1000,85 Q1020,50 1200,50 Q1380,50 1440,50 L1440,120 Z',
};

/**
 * Curved / playful SVG transition between two coloured sections. Place it
 * inside a `position: relative` section; it fills the width and tucks against
 * the chosen edge so section colours meet on an organic shape, never a hard line.
 */
export const SectionDivider: React.FC<SectionDividerProps> = ({
  color = 'sand.100',
  variant = 'wave',
  position = 'bottom',
  flip = false,
  height = { base: 40, md: 70 },
}) => {
  const [resolved] = useToken('colors', [color]);
  const h = typeof height === 'number' ? { base: height, md: height } : height;

  const transforms = [flip ? 'scaleX(-1)' : '', position === 'top' ? 'scaleY(-1)' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <Box
      position="absolute"
      left={0}
      right={0}
      {...(position === 'bottom' ? { bottom: '-1px' } : { top: '-1px' })}
      h={h}
      lineHeight={0}
      pointerEvents="none"
      zIndex={1}
      sx={{ transform: transforms || undefined }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <path d={paths[variant]} fill={resolved} />
      </svg>
    </Box>
  );
};
