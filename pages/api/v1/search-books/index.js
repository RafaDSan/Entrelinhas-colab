import searchBooks from "models/searchBook.js";
import controller from "infra/controller.js";

export default async function getHandler(request, response) {
  const { q } = request.query;

  const books = await searchBooks(q);

  return response.status(200).json(books);
}

async function postHandler(request, response) {}
