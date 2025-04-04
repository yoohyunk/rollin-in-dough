// import { CookieProduct } from "@/app/cookies";
import { NextResponse } from "next/server";
// import { SquareClient, SquareEnvironment, SquareError } from "square";

// interface CatalogItem {
//   id: string;
//   type: string;
//   imageData?: { url: string };
//   itemData?: {
//     name: string;
//     description: string;
//     imageIds: string[];
//     variations: {
//       itemVariationData?: {
//         priceMoney?: {
//           amount: number;
//           currency: string;
//         };
//       };
//     }[];
//   };
// }
// _request: NextRequest

export async function GET() {
  return NextResponse.json({
    message: "This endpoint is temporarily disabled.",
  });

  // try {
  //   const { searchParams } = new URL(request.url);
  //   const objectIds = searchParams.get("objectIds")?.split(",") || [];

  //   const Client = new SquareClient({
  //     token: process.env.SQUARE_ACCESS_TOKEN,
  //     environment: SquareEnvironment.Sandbox,
  //   });

  //   const objects = (await Client.catalog.batchGet({
  //     objectIds,
  //   })) as { data: CatalogItem[] };

  //   const replacer = (key: string, value: unknown): unknown =>
  //     typeof value === "bigint" ? value.toString() : value;

  //   const items = objects.data.filter(
  //     (obj: { id: string; type?: string }) => obj.type === "ITEM"
  //   );
  //   const images = objects.data.filter(
  //     (obj: { id: string; type?: string }) => obj.type === "IMAGE"
  //   );
  //   const imageDict = images.reduce(
  //     (
  //       acc: Record<string, string>,
  //       image: { id: string; type: string; imageData?: { url: string } }
  //     ) => {
  //       if (image.imageData && image.imageData.url) {
  //         acc[image.id] = image.imageData.url;
  //       }
  //       return acc;
  //     },
  //     {} as Record<string, string>
  //   );

  //   const mappedItems: CookieProduct[] = items.map((item: CatalogItem) => {
  //     const name = item.itemData?.name || "";
  //     const description = item.itemData?.description || "";
  //     const imageIDs: string[] = item.itemData?.imageIds || [];
  //     const imageUrl = imageIDs.length > 0 ? imageDict[imageIDs[0]] || "" : "";
  //     let price = 0;

  //     if (
  //       item.itemData?.variations &&
  //       Array.isArray(item.itemData.variations) &&
  //       item.itemData.variations.length > 0
  //     ) {
  //       const variation = item.itemData.variations[0];
  //       if (
  //         variation.itemVariationData &&
  //         variation.itemVariationData.priceMoney
  //       ) {
  //         price = variation.itemVariationData.priceMoney.amount;
  //       }
  //     }
  //     return {
  //       id: item.id,
  //       name,
  //       description,
  //       imageUrl,
  //       price,
  //     };
  //   });

  //   return new NextResponse(JSON.stringify(mappedItems, replacer), {
  //     headers: {
  //       "Cache-Control": "s-maxage=3600, stale-while-revalidate",
  //       "Content-Type": "application/json",
  //     },
  //   });
  // } catch (error) {
  //   if (error instanceof SquareError) {
  //     return NextResponse.json(
  //       { message: error.errors?.[0]?.detail || "Square Error" },
  //       { status: error?.statusCode }
  //     );
  //   }

  //   return NextResponse.json(
  //     { message: "Internal Server Error" },
  //     { status: 500 }
  //   );
  // }
}
