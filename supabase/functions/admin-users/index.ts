import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify the requesting user is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await userClient.auth.getClaims(token);
    
    if (claimsError || !claims?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claims.claims.sub;

    // Use service role client for admin operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is admin
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: "Forbidden - Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // GET: List all users with VIP status
    if (req.method === "GET" && action === "list") {
      const { data: users, error: usersError } = await adminClient.auth.admin.listUsers();
      
      if (usersError) {
        console.error("Error fetching users:", usersError);
        return new Response(
          JSON.stringify({ error: "Failed to fetch users" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get profiles with VIP status
      const { data: profiles } = await adminClient
        .from("profiles")
        .select("user_id, first_name, is_vip, vip_purchased_at, avatar_url");

      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      const usersWithVip = users.users.map(u => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        profile: profilesMap.get(u.id) || null,
      }));

      return new Response(
        JSON.stringify({ users: usersWithVip }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST: Update VIP status
    if (req.method === "POST" && action === "toggle-vip") {
      const { targetUserId, isVip } = await req.json();

      if (!targetUserId) {
        return new Response(
          JSON.stringify({ error: "Target user ID is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error: updateError } = await adminClient
        .from("profiles")
        .update({
          is_vip: isVip,
          vip_purchased_at: isVip ? new Date().toISOString() : null,
        })
        .eq("user_id", targetUserId);

      if (updateError) {
        console.error("Error updating VIP status:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update VIP status" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Admin ${userId} updated VIP status for ${targetUserId} to ${isVip}`);

      return new Response(
        JSON.stringify({ success: true, message: `VIP status updated to ${isVip}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Admin endpoint error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
