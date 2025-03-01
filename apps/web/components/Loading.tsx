import { Loader2Icon } from "lucide-react";

export default function Loading({
  strokeWidth,
  size,
}: {
  strokeWidth: number;
  size: number;
}) {
  return (
    <div className="w-full h-20 flex justify-center items-center animate-spin">
      <Loader2Icon size={size} strokeWidth={strokeWidth} color="#000" />{" "}
    </div>
  );
}
