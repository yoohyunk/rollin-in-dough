import { verifyIdToken } from "@/firebase/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { SquareClient, SquareEnvironment } from "square";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    console.log("orderId:", orderId);
    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    const token = request.cookies.get("token")?.value;
    console.log("token:", token);
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized, no token found" },
        { status: 401 }
      );
    }
    const decodedToken = await verifyIdToken(token);
    console.log("decodedToken:", decodedToken);
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
    console.log("Order response:", res);
    const order = res.order;
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    console.log("Order:", order);
    const lineItems = order.lineItems?.map((item) => ({
      quantity: item.quantity,
      catalogObjectId: item.catalogObjectId,
      basePriceMoney: item.basePriceMoney,
      name: item.name,
    }));
    const serviceCharges = order.serviceCharges?.map((charge) => ({
      name: charge.name,
      amountMoney: charge.amountMoney,
      totalMoney: charge.totalMoney,
    }));
    const orderDetails = {
      orderId: order.id,
      createdAt: order.createdAt,
      orderStatus: order.state,
      lineItems: lineItems,
      totalPrice: order.totalMoney,
      totalTax: order.totalTaxMoney,
      serviceCharges: serviceCharges,
    };
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
    console.log("Error in GET /api/get-order:", error);
    console.error("Error in GET /api/get-order:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
