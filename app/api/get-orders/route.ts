import { verifyIdToken } from "@/firebase/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { SquareClient, SquareEnvironment } from "square";

export async function GET(request: NextRequest) {
  try {
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

    const { email } = decodedToken;

    const Client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment: SquareEnvironment.Sandbox,
    });

    const locationId = process.env.SQUARE_LOCATION_ID!;
    if (!locationId) {
      return NextResponse.json(
        { message: "Missing Square Location ID" },
        { status: 500 }
      );
    }

    const res = await Client.customers.search({
      query: {
        filter: {
          emailAddress: {
            exact: email,
          },
        },
      },
    });

    const customerId = res.customers?.[0]?.id;
    if (!customerId) {
      return NextResponse.json(
        { message: "Customer ID not found" },
        { status: 404 }
      );
    }

    const orderRes = await Client.orders.search({
      query: {
        filter: {
          customerFilter: {
            customerIds: [customerId],
          },
        },
        sort: {
          sortField: "CREATED_AT",
          sortOrder: "DESC",
        },
      },
      returnEntries: true,
      locationIds: [locationId],
    });

    const _orders = orderRes.orderEntries;

    const orderIds = (_orders?.map((order) => order.orderId) ?? []) as string[];
    const orders = await Client.orders.batchGet({
      orderIds: orderIds,
    });

    if (!orders || orders.orders?.length === 0) {
      return NextResponse.json({});
    }

    const orderList = orders.orders?.map((order) => {
      return {
        id: order.id,
        createdAt: order.createdAt,
        lineItems: order.lineItems,
        orderStatus: order.state,
        totalPrice: {
          amount: Number(order.totalMoney?.amount) / 100,
          currency: Number(order.totalMoney?.currency) / 100,
        },
      };
    });

    const replacer = (_: string, value: unknown) =>
      typeof value === "bigint" ? value.toString() : value;

    const orderListSerialized = JSON.parse(JSON.stringify(orderList, replacer));
    return NextResponse.json(orderListSerialized, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders", error: (error as Error).message },
      { status: 500 }
    );
  }
}
