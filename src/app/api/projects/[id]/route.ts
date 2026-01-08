import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/projects/[id] - Get single project
export async function GET(
  request: NextRequest,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await segmentData.params;
    const project = await prisma.project.findUnique({
      where: { id: id },
      include: {
        projectKits: {
          include: {
            kit: {
              include: {
                bomLineItems: {
                  include: {
                    component: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();

    const { id } = await segmentData.params;
    const project = await prisma.project.update({
      where: { id: id },
      data: {
        projectName: body.projectName,
        customerName: body.customerName,
        status: body.status,
        targetShipDate: body.targetShipDate ? new Date(body.targetShipDate) : null,
        fulfillmentModel: body.fulfillmentModel,
        totalManufactureCost: body.totalManufactureCost ? parseFloat(body.totalManufactureCost) : undefined,
        totalAssemblyCost: body.totalAssemblyCost ? parseFloat(body.totalAssemblyCost) : undefined,
        totalProjectCost: body.totalProjectCost ? parseFloat(body.totalProjectCost) : undefined,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  segmentData: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await segmentData.params;
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
