import database from "infra/database";

async function create(bookDataFromApi) {
  const authorName = bookDataFromApi.author_name
    ? bookDataFromApi.author_name[0]
    : null;

  const result = await database.query({
    text: `INSERT INTO books (
      title,
      author_name,
      cover_url,
      first_publish_year,
      open_library_key
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
        `,
    values: [
      bookDataFromApi.title,
      authorName,
      bookDataFromApi.cover_url,
      bookDataFromApi.first_publish_year,
      bookDataFromApi.key,
    ],
  });

  return result.rows[0];
}

// async function findAll()  {

// }

export default {
  create,
};
