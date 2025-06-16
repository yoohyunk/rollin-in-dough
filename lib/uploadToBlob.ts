import { BlobServiceClient } from "@azure/storage-blob";
import { Order } from "@/types/customerData";

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING!;
const containerName = "orders";

export async function uploadOrderToBlob(orderId: string, data: Order) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobName = `${orderId}.json`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const jsonData = JSON.stringify(data, null, 2);
  await blockBlobClient.upload(jsonData, jsonData.length);
}
