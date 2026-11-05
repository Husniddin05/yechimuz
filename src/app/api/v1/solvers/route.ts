import { SolverService } from "@/services/solver.service";
import { ApiResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const limit = Number(searchParams.get("limit") || "10");

    const solvers = await SolverService.getTopSolvers({ region, limit });

    return ApiResponse.success(solvers);
  } catch (error: any) {
    return ApiResponse.serverError(error);
  }
}
