import database from "infra/database";

async function add(userId, bookId) {
  const result = await database.query({
    text: `
        INSERT INTO user_favorite_books (user_id, book_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, book_id) DO NOTHING
        RETURNING *;
        `,
    values: [userId, bookId],
  });

  return result.rows[0];
}

async function findByUserId(userId) {
  const result = await database.query({
    text: `
      SELECT b.*
      FROM books b
      JOIN user_favorite_books ufb ON b.id = ufb.book_id
      WHERE ufb.user_id = $1
      ORDER BY b.created_at DESC;
    `,
    values: [userId],
  });

  return result.rows;
}

const favorite = {
  add,
  findByUserId,
};

export default favorite;
