import { promises as fs } from "fs";
import path from "path";

export async function POST(request) {
  try {
    const newTeam = await request.json();
    const teamsPath = path.join(process.cwd(), "Data", "teams.json");

    // Read existing teams data
    let teams = [];
    try {
      const fileData = await fs.readFile(teamsPath, "utf-8");
      teams = JSON.parse(fileData);
    } catch (err) {
      console.log("No teams file found, creating a new one.");
    }

    // Push the new team to the array
    teams.push(newTeam);

    // Write the updated teams data to the file
    await fs.writeFile(teamsPath, JSON.stringify(teams, null, 2));

    return new Response(
      JSON.stringify({ message: "Team registered successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}