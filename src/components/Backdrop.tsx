/** Decorative background: purple corner blobs, thin arc line and the bottom wave. */
export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="blob blob--tl" />
      <div className="blob blob--bl" />
      <div className="blob blob--r" />

      <svg className="arc" viewBox="0 0 1280 720" preserveAspectRatio="none">
        <path
          d="M560 720 C 760 560, 900 260, 1040 0"
          fill="none"
          stroke="url(#arcGrad)"
          strokeWidth="1.2"
        />
        <defs>
          <linearGradient id="arcGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#ff3d71" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ff3d71" stopOpacity="0.45" />
            <stop offset="1" stopColor="#ff3d71" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      <svg className="wave" viewBox="0 0 1440 220" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#4c1d6e" />
            <stop offset="0.55" stopColor="#7a2a6e" />
            <stop offset="1" stopColor="#ff4d7a" />
          </linearGradient>
        </defs>
        <path
          d="M0 120 C 240 60, 420 70, 640 110 S 1080 170, 1440 60 L1440 220 L0 220 Z"
          fill="url(#waveGrad)"
        />
        <path
          d="M0 150 C 260 95, 460 120, 700 150 S 1120 190, 1440 110 L1440 220 L0 220 Z"
          className="wave__shade"
          fill="#0d0a0e"
          opacity="0.55"
        />
      </svg>
    </div>
  );
}
