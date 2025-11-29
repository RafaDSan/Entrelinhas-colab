import database from "infra/database";

async function update(userId, bookId, status) {
    const result = await database.query({
        text: `
        INSERT INTO user_book_statuses (user_id, book_id, status)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, book_id)
        DO UPDATE SET
            status = EXCLUDED.status,
            updated_at = timezone('utc', now())
        RETURNING *;
        `,
        values: [userId, bookId, status],
    });

    return result.rows[0];
}

async function listByUserId(userId) {
  const result = await database.query({
    text: `
      SELECT 
        b.*, 
        ubs.status, 
        ubs.updated_at as status_updated_at,
        -- Verifica se existe uma linha na tabela de favoritos para este usuário e livro
        CASE WHEN ufb.user_id IS NOT NULL THEN true ELSE false END as is_favorite
      FROM books b
      JOIN user_book_statuses ubs ON b.id = ubs.book_id
      -- O LEFT JOIN serve para trazer a info de favorito SE ela existir
      LEFT JOIN user_favorite_books ufb ON b.id = ufb.book_id AND ufb.user_id = $1
      WHERE ubs.user_id = $1
      ORDER BY ubs.updated_at DESC;
    `,
    values: [userId],
  });

  return result.rows;
}

async function listByStatus(userId, status) {
    const result = await database.query({
        text: `
        SELECT b.*
        FROM books b
        JOIN user_book_statuses ubs ON b.id = ubs.book_id
        WHERE ubs.user_id = $1 AND ubs.status = $2
        ORDER BY ubs.updated_at DESC;
        `,
        values: [userdId, status],
    });

    return result.rows;
}

const status = { 
    update,
    listByUserId,
    listByStatus,
};

export default status;