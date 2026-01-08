import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/kits - List all kits
export async function GET() {
  try {
    const kits = await prisma.kit.findMany({
      where: { isActive: true },
      include: {
        bomLineItems: {
          include: {
            component: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(kits);
  } catch (error) {
    console.error("Error fetching kits:", error);
    return NextResponse.json(
      { error: "Failed to fetch kits" },
      { status: 500 }
    );
  }
}

// POST /api/kits - Create new kit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const kit = await prisma.kit.create({
      data: {
        name: body.name,
        description: body.description,
        distributionModel: body.distributionModel,
        fulfillmentModel: body.fulfillmentModel,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(kit, { status: 201 });
  } catch (error) {
    console.error("Error creating kit:", error);
    return NextResponse.json(
      { error: "Failed to create kit" },
      { status: 500 }
    );
  }
}
