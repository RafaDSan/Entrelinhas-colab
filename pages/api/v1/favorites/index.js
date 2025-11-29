import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import favorite from "models/favorite.js";

const router = createRouter();

router.post(postHandler);
router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const currentUserId = "e76221c5-6860-49a7-a9b0-82720d3ea6a9";
  const { book_id } = request.body;

  if (!book_id) {
    return response.status(400).json({ error: "book_id é necessário." });
  }

  const newFavorite = await favorite.add(currentUserId, book_id);

  if (!newFavorite) {
    return response
      .status(200)
      .json({ message: "Livro já está nos favoritos." });
  }

  return response.status(201).json(newFavorite);
}

async function getHandler(request, response) {
  const currentUserId = "e76221c5-6860-49a7-a9b0-82720d3ea6a9";

  const favoriteBooks = await favorite.findByUserId(currentUserId);
  return response.status(200).json(favoriteBooks);
}
