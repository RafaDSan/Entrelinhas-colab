/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.renameColumn("books", "conver_url", "cover_url");
};

exports.down = (pgm) => {};
