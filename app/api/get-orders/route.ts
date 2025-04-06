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
    console.log("email:", email);

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
    console.log("Customer ID:", customerId);
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
    const orders = orderRes.orderEntries;

    if (!orders || orders.length === 0) {
      return NextResponse.json({});
    }

    const orderList = orders.map((order) => {
      return {
        id: order.orderId,
        createdAt: order.created_at,
        lineItems: order.line_items,
      };
    });
    console.log("Orders:", orderList);
    return NextResponse.json(orderList);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders", error: (error as Error).message },
      { status: 500 }
    );
  }
}
