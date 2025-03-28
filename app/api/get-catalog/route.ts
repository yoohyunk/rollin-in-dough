import { NextRequest, NextResponse } from "next/server";
import { SquareClient, SquareEnvironment, SquareError } from "square";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || "";

    const Client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment: SquareEnvironment.Sandbox,
    });

    const objects = await Client.catalog.list({
      types: "ITEM,IMAGE,ITEM_VARIATION",
      cursor,
    });

    // console.log("Catalog response:", objects.response.objects);
    // console.log(
    //   "Catalog response:",
    //   objects.data[0].itemData.variations[0].itemVariationData
    // );

    const replacer = (key: string, value: unknown): unknown =>
      typeof value === "bigint" ? value.toString() : value;

    const serializedData = JSON.stringify(objects.data, replacer);
    // console.log("Serialized data:", serializedData);

    return new NextResponse(serializedData, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof SquareError) {
      return NextResponse.json(
        { message: error.errors?.[0]?.detail || "Square Error" },
        { status: error?.statusCode }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
