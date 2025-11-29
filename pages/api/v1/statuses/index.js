import { createRouter } from "next-connect";
import controller from "infra/controller";
import status from "models/bookStatus.js";

const router = createRouter();

router.post(postHandler);
router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userId = "a7287bcb-c496-4389-ba20-b7d6943dffe3";
  
  const { bookId, status: providedStatus } = request.body;

  const statusToSave = providedStatus || "WANT_TO_READ";

  const result = await status.update(userId, bookId, statusToSave);

  return response.status(200).json(result);
}

async function getHandler(request, response) {
  const userId = "a7287bcb-c496-4389-ba20-b7d6943dffe3";

  if (!userId) {
    return response.status(400).json({
      error: "userId is required in the query parameters.",
    });
  }

  const myStatusList = await status.listByUserId(userId);

  return response.status(200).json(myStatusList);
}
