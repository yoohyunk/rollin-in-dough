import { verifyIdToken } from "@/firebase/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { SquareClient, SquareEnvironment, SquareError } from "square";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { items, userEmail } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Invalid items in order" },
        { status: 400 }
      );
    }

    const lineItems = items.map(
      (item: { quantity: number; variationId: string }) => ({
        quantity: item.quantity.toString(),
        catalogObjectId: item.variationId,
      })
    );

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

    let customerId: string | null = null;
    try {
      const { customers } = await Client.customers.search({
        query: {
          filter: {
            emailAddress: {
              exact: userEmail,
            },
          },
        },
      });

      if (customers && customers.length > 0) {
        customerId = customers[0].id ?? null;
      }
    } catch (err) {
      console.error("Error searching customer:", err);
    }

    // ➕ Step 2: If not found, create new customer
    if (!customerId) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    const orderRequest = {
      order: {
        locationId,
        customer_id: customerId,
        lineItems: lineItems,
      },
      checkout_options: {
        allow_tipping: false,
        ask_for_shipping_address: true,
        enable_coupon: false,
        shipping_fee: {
          charge: {
            amount: 2,
            currency: "CAD",
          },
          name: "shipping",
        },
      },
      pre_populated_data: {
        buyer_email: "yoohyunk20@gmail.com",
        buyer_phone_number: "8255613205",
      },
    };

    const { paymentLink } =
      await Client.checkout.paymentLinks.create(orderRequest);

    if (!paymentLink) {
      return NextResponse.json(
        { message: "Payment link creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        order: {
          id: paymentLink.id,
          url: paymentLink.url,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    if (error instanceof SquareError) {
      return NextResponse.json(
        { message: error.errors?.[0] || "Square Error" },
        { status: error?.statusCode }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
