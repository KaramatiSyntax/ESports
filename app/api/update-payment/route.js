// /app/api/update-payment/route.js
import { promises as fs } from "fs";
import path from "path";

export async function POST(request) {
  try {
    const { upi, screenshot, payment, teamName } = await request.json();

    if (!upi || !screenshot || !payment || !teamName) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const dataDir = path.join(process.cwd(), "Data");
    const filePath = path.join(dataDir, "teams.json");

    try {
      await fs.access(filePath);
    } catch {
      console.error("No, such file/Dir Found!");
      return;
    }

    const fileData = await fs.readFile(filePath, "utf-8");
    let teams = JSON.parse(fileData);

    const teamIndex = teams.findIndex((t) => t.teamName === teamName);
    if (teamIndex === -1) {
      return new Response(JSON.stringify({ error: "Team not found" }), {
        status: 404,
      });
    }

    teams[teamIndex] = {
      ...teams[teamIndex],
      upi,
      screenshot,
      payment,
    };

    await fs.writeFile(filePath, JSON.stringify(teams, null, 2));

    return new Response(JSON.stringify({ message: "Payment updated" }), {
      status: 200,
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ message: "Error updating payment" }), {
      status: 500,
    });
  }
}
