import { checkAdminAccess } from "@/lib/admin";
import { AdminService } from "@/services/admin.service";
import { ApiResponse } from "@/lib/api-response";

export async function GET() {
  const auth = await checkAdminAccess();
  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const stats = await AdminService.getDashboardStats();
    return ApiResponse.success(stats);
  } catch (error: any) {
    return ApiResponse.serverError(error);
  }
}
