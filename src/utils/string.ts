const ALPHANUMERICS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generate_random_string(length: number) {
  const result = [];
  for (var i = 0; i < length; i++) {
    result.push(ALPHANUMERICS.charAt(Math.floor(Math.random() * ALPHANUMERICS.length)));
  }
  return result.join('');
}

export function generate_random_id() {
  return generate_random_string(20);
}
