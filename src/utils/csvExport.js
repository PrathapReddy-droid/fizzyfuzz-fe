// utils/csvExport.js

/**
 * Escapes a single CSV field: wraps in quotes if it contains a comma,
 * quote, or newline, and doubles any internal quotes.
 */
const escapeCSVField = (value) => {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Converts an array of (possibly nested) objects into a CSV string.
 * columns: [{ key: "wallet.balance", label: "Wallet Balance", format?: fn }]
 * `key` is dot-path resolved against each row; `format`, if given, runs
 * on the raw value before it's stringified/escaped.
 */
export const arrayToCSV = (rows, columns) => {
  const getValue = (row, key) =>
    key.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), row);

  const header = columns.map((c) => escapeCSVField(c.label)).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const raw = getValue(row, c.key);
          const value = c.format ? c.format(raw, row) : raw;
          return escapeCSVField(value);
        })
        .join(",")
    )
    .join("\r\n");

  return `${header}\r\n${body}`;
};

/**
 * Triggers a browser download of a CSV string as a named file.
 */
export const downloadCSV = (csvString, filename) => {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};