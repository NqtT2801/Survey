import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <nav className="flex items-center gap-1">
            <Link
              href="/admin/questions"
              className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
            >
              Questions
            </Link>
            <Link
              href="/admin/sessions"
              className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
            >
              Sessions
            </Link>
          </nav>
          <form action="/api/admin/logout" method="POST">
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
