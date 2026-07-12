// currencyDisplay: "narrowSymbol" is required to get "৳" instead of the
// literal "BDT" prefix Node's ICU data falls back to for this locale.
const bdtFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  currencyDisplay: "narrowSymbol",
});

export function formatCurrency(amount: number | string) {
  return bdtFormatter.format(Number(amount));
}
