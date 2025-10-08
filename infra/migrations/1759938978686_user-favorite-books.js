/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("user_favorite_books", {
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users(id)",
      onDelete: "cascade",
    },

    book_id: {
      type: "uuid",
      notNull: true,
      references: "books(id)",
      onDelete: "cascade",
    },
  });

  pgm.addConstraint("user_favorite_books", "user_favorite_books_pkey", {
    primaryKey: ["user_id", "book_id"],
  });
};

exports.down = false;
