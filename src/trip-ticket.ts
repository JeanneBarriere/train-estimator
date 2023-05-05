export class TripTicket {
  adjustementsOfPrice: number[] = [];
  total = 0;
  passengersWithDiscount = 0;

  addTotal(total: number) {
    this.total += total;
  }
  addPassengerWithAdjustments() {
    this.passengersWithDiscount++;
    }

  addDiscount(discount: number) {
    this.adjustementsOfPrice.push(-discount);
  }

  addMarkup(discount: number) {
    this.adjustementsOfPrice.push(discount);
  }

  calculTotal(apiPrice: number): number {
    const result = this.adjustementsOfPrice.map((discount) => apiPrice * discount);
    let sum = 0;
    for (let i = 0; i < result.length; i++) {
      sum += result[i];
    }

    this.total += sum + apiPrice * this.passengersWithDiscount;
    return this.total;
  }
}
