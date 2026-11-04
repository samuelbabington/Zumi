import Image from "next/image";

type Props = {
  /** Eyes-open frame. */
  open: string;
  /** Same frame with eyes closed (generated with Higgsfield). */
  closed: string;
  alt: string;
  /** Eye area as an ellipse in % of the image: [centerX, centerY, radiusX, radiusY]. */
  eyes: [number, number, number, number];
  className?: string;
  priority?: boolean;
};

/**
 * Zumi mascot that blinks: the eyes-closed frame is layered on top and
 * flashed on with a CSS keyframe. A feathered mask limits it to the eye
 * area so nothing else in the picture changes.
 */
export default function BlinkingZumi({ open, closed, alt, eyes, className, priority }: Props) {
  const [cx, cy, rx, ry] = eyes;
  const mask = `radial-gradient(ellipse ${rx}% ${ry}% at ${cx}% ${cy}%, #000 65%, transparent 100%)`;

  return (
    <div className={`zumi ${className ?? ""}`}>
      <Image
        src={open}
        alt={alt}
        width={1024}
        height={1024}
        priority={priority}
        sizes="(max-width: 900px) 90vw, 620px"
      />
      <Image
        src={closed}
        alt=""
        aria-hidden="true"
        width={1024}
        height={1024}
        priority={priority}
        className="zumi__lids"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        sizes="(max-width: 900px) 90vw, 620px"
      />
    </div>
  );
}
