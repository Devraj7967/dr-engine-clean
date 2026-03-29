import { Car } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between px-6 border-b border-border">
        <Link href="/login" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
            <Car className="size-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">AutoDiag</span>
            <span className="text-xs text-muted-foreground">Smart Car Assistant</span>
          </div>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        {children}
      </main>
    </div>
  );
}
