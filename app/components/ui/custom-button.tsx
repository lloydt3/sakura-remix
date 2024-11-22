import { cn } from "~/lib/utils";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}
export default function Button({
  children,
  className,
  ...props
}: CustomButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "rounded-md bg-black px-2 py-1 text-white shadow-sm transition-all hover:shadow-md active:shadow-sm dark:shadow-sky-300/20",
        className,
      )}
    >
      {children}
    </button>
  );
}
