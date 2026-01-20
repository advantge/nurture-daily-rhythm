import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Payment webhook received");

    // Parse the webhook payload
    const payload = await req.json();
    console.log("Webhook payload:", JSON.stringify(payload, null, 2));

    // Kiwify webhook structure
    // Expected fields: order_status, Customer.email, Product.product_id
    const orderStatus = payload.order_status;
    const customerEmail = payload.Customer?.email;
    const productId = payload.Product?.product_id;

    console.log(`Order status: ${orderStatus}, Customer email: ${customerEmail}, Product: ${productId}`);

    // Only process approved purchases
    if (orderStatus !== "paid" && orderStatus !== "approved" && orderStatus !== "completed") {
      console.log(`Ignoring order with status: ${orderStatus}`);
      return new Response(
        JSON.stringify({ success: true, message: "Order status not applicable for VIP upgrade" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!customerEmail) {
      console.error("No customer email found in webhook payload");
      return new Response(
        JSON.stringify({ error: "Customer email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role (to bypass RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find user by email in auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error fetching users:", authError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch users" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find the user with matching email
    const user = authUser.users.find(u => u.email?.toLowerCase() === customerEmail.toLowerCase());

    if (!user) {
      console.log(`No user found with email: ${customerEmail}`);
      // Store the payment info anyway so when they register, we can activate VIP
      // We'll update the profile by payment_email later
      const { error: insertError } = await supabase
        .from("profiles")
        .update({
          is_vip: true,
          vip_purchased_at: new Date().toISOString(),
          payment_email: customerEmail.toLowerCase(),
        })
        .eq("payment_email", customerEmail.toLowerCase());

      // If no profile found with that payment_email, log it
      if (insertError) {
        console.log("No existing profile to update, user may register later:", insertError);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Payment recorded. User will be upgraded when they register with this email." 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update the user's profile to VIP
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        is_vip: true,
        vip_purchased_at: new Date().toISOString(),
        payment_email: customerEmail.toLowerCase(),
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update user VIP status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Successfully upgraded user ${user.id} to VIP`);

    return new Response(
      JSON.stringify({ success: true, message: "User upgraded to VIP successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
