import { NextResponse } from "next/server";
import { buildResultsWorkbook } from "@/lib/excel-export";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const buf = await buildResultsWorkbook();
  const filename = `survey-results-${new Date()
    .toISOString()
    .slice(0, 10)}.xlsx`;
  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      "content-type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="${filename}"`,
    },
  });
}
