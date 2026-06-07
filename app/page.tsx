import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-8 py-12">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">Thí nghiệm</h1>
        <p className="text-muted-foreground">
          Chào mừng. Bạn hãy bấm vào nút bắt đầu bên dưới để vào phần thí nghiệm. Vui chơi có thưởng (tiền mặt) đấy nhé.          
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild size="lg">
          <Link href="/survey">Bắt đầu thí nghiệm</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/admin">Admin</Link>
        </Button>
      </div>
    </main>
  );
}
