// Debug utility for Add Expense/Income issues
// Copy and paste in DevTools Console to test

const debugApp = {
  // Check environment variables
  checkEnv: () => {
    console.log("🔍 Environment Variables:");
    console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log(
      "VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY:",
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.slice(0, 20) +
        "...",
    );
  },

  // Check if user is authenticated
  checkAuth: async () => {
    console.log("🔍 Checking authentication...");
    const { supabase } = await import("./src/lib/supabase");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      console.log("✅ Authenticated as:", user.email);
      console.log("📧 User ID:", user.id);
    } else {
      console.log("❌ NOT authenticated");
    }
  },

  // Check current week
  checkCurrentWeek: async () => {
    console.log("🔍 Checking current week...");
    const { SupabaseService } = await import("./src/lib/supabaseService");
    try {
      const week = await SupabaseService.getOrCreateWeek(new Date());
      console.log("✅ Current week:", week);
    } catch (error) {
      console.log("❌ Error getting week:", error);
    }
  },

  // Test add expense
  testAddExpense: async () => {
    console.log("🧪 Testing add expense...");
    const { SupabaseService } = await import("./src/lib/supabaseService");
    const {
      data: { user },
    } = await (await import("./src/lib/supabase")).supabase.auth.getUser();

    try {
      const week = await SupabaseService.getOrCreateWeek(new Date());
      const expense = await SupabaseService.addExpense(week.id, {
        date: new Date().toISOString().split("T")[0],
        amount: 10.5,
        category: "fuel",
        description: "Test expense from console",
      });
      console.log("✅ Expense added:", expense);
    } catch (error) {
      console.log("❌ Error:", error);
    }
  },

  // Run all checks
  runAll: async () => {
    console.log("🚀 Running all diagnostic checks...\n");
    debugApp.checkEnv();
    console.log("");
    await debugApp.checkAuth();
    console.log("");
    await debugApp.checkCurrentWeek();
    console.log("\n✅ Diagnostics complete!");
  },
};

// Usage: In DevTools Console, paste and run:
// await debugApp.runAll()
// OR individual:
// debugApp.checkEnv()
// await debugApp.checkAuth()
// etc.

export default debugApp;
