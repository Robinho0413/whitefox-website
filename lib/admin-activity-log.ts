import type { SupabaseClient } from "@supabase/supabase-js"

type ActivityAction = "create" | "update" | "delete"
type ActivityEntity = "news" | "album"

type LogAdminActivityParams = {
  actionType: ActivityAction
  entityType: ActivityEntity
  entityId: string | number
  actorId: string
  titleSnapshot?: string | null
}

export async function logAdminActivity(
  supabase: SupabaseClient,
  params: LogAdminActivityParams
) {
  const { actionType, entityType, entityId, actorId, titleSnapshot } = params

  const { error } = await supabase.from("admin_activity_logs").insert({
    action_type: actionType,
    entity_type: entityType,
    entity_id: String(entityId),
    actor_id: actorId,
    title_snapshot: titleSnapshot ?? null,
  })

  if (error) {
    // Keep admin actions functional even if activity logging fails.
    console.error("Failed to log admin activity:", error.message)
  }
}
