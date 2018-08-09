export const fromParseCurrency = (currency) => {
  return {
    id: currency.id,
    name: currency.get('name'),
  };
}