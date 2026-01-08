import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/projects - List all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        projectKits: {
          include: {
            kit: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // For now, we'll skip userId requirement until auth is implemented
    const project = await prisma.project.create({
      data: {
        userId: body.userId || "temp-user-id", // TODO: Get from session
        projectName: body.projectName,
        customerName: body.customerName,
        status: "draft",
        targetShipDate: body.targetShipDate ? new Date(body.targetShipDate) : null,
        fulfillmentModel: body.fulfillmentModel,
        totalManufactureCost: 0,
        totalAssemblyCost: 0,
        totalProjectCost: 0,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
