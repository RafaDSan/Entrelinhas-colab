/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn("user_book_statuses", "status", {
    default: "WANT_TO_READ",
  });
};

exports.down = pgm => {};
