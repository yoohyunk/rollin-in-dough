import { verifyIdToken } from "@/firebase/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { SquareClient, SquareEnvironment } from "square";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized, no token found" },
        { status: 401 }
      );
    }
    const decodedToken = await verifyIdToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { message: "Unauthorized", error: "Invalid token" },
        { status: 401 }
      );
    }

    const Client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment: SquareEnvironment.Sandbox,
    });

    const res = await Client.orders.get({
      orderId,
    });
    const order = res.order;
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const lineItems = order.lineItems?.map((item) => ({
      quantity: item.quantity,
      catalogObjectId: item.catalogObjectId,
      basePriceMoney: {
        amount: Number(item.basePriceMoney?.amount) / 100,
        currency: item.basePriceMoney?.currency,
      },
      name: item.name,
      imageUrl: "",
    }));
    const serviceCharges = order.serviceCharges?.map((charge) => ({
      name: charge.name,
      amountMoney: {
        amount: Number(charge.amountMoney?.amount) / 100,
        currency: charge.amountMoney?.currency,
      },
      totalMoney: {
        amount: Number(charge.totalMoney?.amount) / 100,
        currency: charge.totalMoney?.currency,
      },
    }));
    const orderDetails = {
      orderId: order.id,
      createdAt: order.createdAt,
      orderStatus: order.state,
      lineItems: lineItems,
      totalPrice: {
        amount: Number(order.totalMoney?.amount) / 100,
        currency: order.totalMoney?.currency,
      },
      totalTax: {
        amount: Number(order.totalTaxMoney?.amount) / 100,
        currency: order.totalTaxMoney?.currency,
      },
      serviceCharges: serviceCharges,
    };

    // use BATCH GET API to get image URLs using item.id (not item.variation_id)
    // TODO: not type safe
    for (const item of lineItems!) {
      const objId = item.catalogObjectId as string;
      const relatedObj = await Client.catalog.batchGet({
        objectIds: [objId],
        includeRelatedObjects: true,
      });
      const objIds = relatedObj.relatedObjects?.map(
        (item) => item.id
      ) as string[];
      const relatedImgs = await Client.catalog.batchGet({
        objectIds: objIds,
        includeRelatedObjects: true,
      });
      const relatedImgURLs = relatedImgs.relatedObjects
        ?.filter((item) => item.type === "IMAGE")
        .map((item) => item.imageData?.url) as string[];

      item.imageUrl = relatedImgURLs.length > 0 ? relatedImgURLs[0] : "";
    }

    const replacer = (_: string, value: unknown) =>
      typeof value === "bigint" ? value.toString() : value;

    const orderDetailsSerialized = JSON.parse(
      JSON.stringify(orderDetails, replacer)
    );

    return NextResponse.json(
      { order: orderDetailsSerialized },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/get-order:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
