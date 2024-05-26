export default function formatCurrency() {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
}
