import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_OTP = "0000";

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { identifier, method, otp } = await req.json();

    // Validate OTP
    if (otp !== DEFAULT_OTP) {
      return new Response(
        JSON.stringify({ error: "Invalid OTP", code: "invalid_otp" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create email from identifier
    const email = method === "email" ? identifier : `${identifier.replace(/\D/g, "")}@phone.local`;
    const password = `feelgood_${email}_${DEFAULT_OTP}`;

    // Create admin client with service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Check if user exists
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error("Error listing users:", listError);
      throw listError;
    }

    const existingUser = existingUsers.users.find((u) => u.email === email);

    if (existingUser) {
      // User exists - update their password to the deterministic one
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        { password }
      );

      if (updateError) {
        console.error("Error updating password:", updateError);
        throw updateError;
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          isNewUser: false,
          email,
          password,
          message: "Password updated for existing user" 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // New user - create them with the deterministic password
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          phone: method === "phone" ? identifier : null,
          email: method === "email" ? identifier : null,
        },
      });

      if (createError) {
        console.error("Error creating user:", createError);
        throw createError;
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          isNewUser: true,
          email,
          password,
          message: "New user created" 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error: any) {
    console.error("Error in verify-otp:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
