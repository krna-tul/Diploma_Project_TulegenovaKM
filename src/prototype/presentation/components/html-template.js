export function html(strings, ...values) {
  return strings.reduce(
    (markup, part, index) => markup + part + (index < values.length ? values[index] : ''),
    '',
  );
}
