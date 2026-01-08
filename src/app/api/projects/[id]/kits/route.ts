import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/projects/[id]/kits - Add kit to project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const projectKit = await prisma.projectKit.create({
      data: {
        projectId: id,
        kitId: body.kitId,
        quantity: parseInt(body.quantity),
        manufactureCost: 0, // Will be calculated
        assemblyCost: 0, // Will be calculated
        extendedTotal: 0, // Will be calculated
      },
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
    });

    return NextResponse.json(projectKit, { status: 201 });
  } catch (error) {
    console.error("Error adding kit to project:", error);
    return NextResponse.json(
      { error: "Failed to add kit to project" },
      { status: 500 }
    );
  }
}
