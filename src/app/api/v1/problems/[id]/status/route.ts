import { getCurrentUserFromToken } from "@/lib/auth";
import { ProblemService } from "@/services/problem.service";
import { UpdateProblemStatusSchema } from "@/validators/problem.schema";
import { ApiResponse } from "@/lib/api-response";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUserFromToken();
    if (!user) {
      return ApiResponse.unauthorized();
    }

    const body = await request.json();
    const validated = UpdateProblemStatusSchema.parse(body);

    const updated = await ProblemService.updateProblemStatus(
      params.id,
      validated.status,
      user.userId
    );

    return ApiResponse.success(updated, "Status yangilandi");
  } catch (error: any) {
    if (error.name === "ZodError") {
      return ApiResponse.zodError(error);
    }
    return ApiResponse.error(error.message || "Statusni yangilashda xatolik", 400);
  }
}
