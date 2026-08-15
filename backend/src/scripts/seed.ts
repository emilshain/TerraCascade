import { connectDatabase, disconnectDatabase, getClusterStatus } from "../config/database.js";
import { authService, DEMO_USERS } from "../services/auth-service.js";

async function main() {
  console.log("=================================================");
  console.log(" TerraCascade Database Setup & Seed Tool");
  console.log("=================================================");

  const connected = await connectDatabase();
  if (!connected) {
    console.error("❌ Failed to connect to MongoDB cluster.");
    process.exit(1);
  }

  console.log("\n📡 Checking Cluster Status...");
  const status = await getClusterStatus();
  console.log(`- Connected: ${status.connected}`);
  console.log(`- Cluster Host: ${status.clusterHost}`);
  console.log(`- Database Name: ${status.dbName}`);
  console.log(`- Latency: ${status.latencyMs}ms`);
  console.log(`- Type: ${status.isAtlas ? "MongoDB Atlas" : "Standalone / Private MongoDB"}`);

  console.log("\n🌱 Seeding Demo Emergency Officials...");
  const seedResult = await authService.seedDemoUsers();
  console.log(`- ${seedResult.message}`);

  console.log("\n👥 Official Accounts Ready:");
  DEMO_USERS.forEach((u) => {
    console.log(`  • ${u.name.padEnd(22)} | ${u.email.padEnd(32)} | Role: ${u.role}`);
  });

  console.log("\n✨ Database setup and seeding complete!");
  await disconnectDatabase();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Database seeding error:", err);
  process.exit(1);
});
