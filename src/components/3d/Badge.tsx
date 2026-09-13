import { Suspense, lazy, useEffect } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { preloaderStore } from "@/lib/preloaderStore";
import Badge3DErrorBoundary from "./Badge3DErrorBoundary";
import BadgeFallback from "./BadgeFallback";

const BadgeScene = lazy(() => import("./BadgeScene"));

interface BadgeProps {
  photoUrl: string;
  name: string;
  role: string;
}

export default function Badge({ photoUrl, name, role }: BadgeProps) {
  const tier = useDeviceTier();
  // 3D on every tier except "minimal" (only when the OS requests reduced
  // motion). On mobile ("reduced") the 3D is already configured light:
  // physics at 1/30 and capped DPR, so it still runs smoothly.
  const use3D = tier !== "minimal";

  const fallback = <BadgeFallback photoUrl={photoUrl} name={name} />;

  // No WebGL tier: there is no 3D badge to wait for, so let the preloader finish.
  useEffect(() => {
    if (use3D) return;
    preloaderStore.setProgress(100);
    preloaderStore.finish();
  }, [use3D]);

  if (!use3D) return fallback;

  return (
    <Badge3DErrorBoundary
      fallback={fallback}
      onError={() => {
        preloaderStore.setProgress(100);
        preloaderStore.finish();
      }}
    >
      <Suspense fallback={fallback}>
        <BadgeScene photoUrl={photoUrl} name={name} role={role} />
      </Suspense>
    </Badge3DErrorBoundary>
  );
}