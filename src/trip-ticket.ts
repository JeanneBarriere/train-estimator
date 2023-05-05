export class TripTicket {
  discounts: number[] = [];
  total = 0;
  passengersWithDiscount = 0;

  addTotal(total: number) {
    this.total += total;
  }

  addDiscounts(discounts: number[]) {
    this.discounts = this.discounts.concat(discounts);
    this.passengersWithDiscount++;
  }

  addDiscount(discount: number) {
    this.discounts.push(discount);
  }

  calculTotal(apiPrice: number): number {
    const result = this.discounts.map((discount) => apiPrice * discount);
    let sum = 0;
    for (let i = 0; i < result.length; i++) {
      sum += result[i];
    }

    this.total += sum + apiPrice * this.passengersWithDiscount;
    return this.total;
  }
}
