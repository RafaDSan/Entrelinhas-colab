import { createRouter } from "next-connect";
import controller from "infra/controller";
import book from "models/book.js";

const router = createRouter();

router.post(postHandler);
router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const bookInputValues = request.body;
  const newBook = await book.create(bookInputValues);
  return response.status(201).json(newBook);
}

async function getHandler(request, response) {
  const myBooksList = await book.findAll();
  console.log(myBooksList);
  return response.status(200).json(myBooksList);
}
