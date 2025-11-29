/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("user_book_statuses", {
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
    status: {
      type: "varchar(50)",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });

  pgm.addConstraint("user_book_statuses", "user_book_statuses_pkey", {
    primaryKey: ["user_id", "book_id"],
  });
  // -----------------------------------------

  pgm.addConstraint("user_book_statuses", "status_value_check", {
    check: "status IN ('WANT_TO_READ', 'READING', 'READ', 'DROPPED')",
  });
};

exports.down = (pgm) => {
  pgm.dropTable("user_book_statuses");
};
