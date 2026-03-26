'use client';

import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';
import React from 'react';

export const DemoVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  // Intro Sequence Animations
  const logoScale = spring({ frame, fps, config: { damping: 12 } });
  const titleOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });

  // Transition to Scene 2
  const shiftUp = interpolate(frame, [60, 90], [0, -height], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill className="bg-surface-container-lowest text-on-surface font-body overflow-hidden">
      {/* SCENE 1: Intro */}
      <Sequence durationInFrames={90}>
        <AbsoluteFill
          style={{ transform: `translateY(${shiftUp}px)` }}
          className="flex items-center justify-center flex-col bg-surface-container-lowest"
        >
          <div
            style={{ transform: `scale(${logoScale})` }}
            className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center text-on-primary mb-6 shadow-2xl"
          >
            <span className="material-symbols-outlined text-5xl">dentistry</span>
          </div>
          <h1
            style={{ opacity: titleOpacity }}
            className="text-5xl font-extrabold font-headline mb-2 text-primary"
          >
            DentFlow
          </h1>
          <p
            style={{ opacity: titleOpacity }}
            className="text-xl text-on-surface-variant font-bold tracking-widest uppercase"
          >
            Clinical OS
          </p>
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 2: AI Typing effect */}
      <Sequence from={90} durationInFrames={150}>
        <AbsoluteFill className="p-12 items-center justify-center bg-surface-container-low">
          <h2 className="text-3xl font-bold font-headline mb-8 text-secondary self-start">
            AI Note Generation
          </h2>
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-outline-variant/20 p-8 h-64 overflow-hidden relative">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="font-mono text-sm leading-relaxed text-surface-dim">
              {'> '}Patient presented with acute pain in lower right quadrant...
            </div>
            {/* Blinking cursor */}
            <div className="absolute top-[88px] left-[350px] w-2 h-4 bg-primary animate-pulse"></div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 3: Outro */}
      <Sequence from={240}>
        <AbsoluteFill className="flex items-center justify-center bg-primary text-on-primary">
          <h1 className="text-6xl font-extrabold font-headline mb-8">Ready to grow?</h1>
          <div className="px-8 py-4 bg-white text-primary rounded-xl font-bold text-2xl shadow-lg">
            Start Free Trial
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
