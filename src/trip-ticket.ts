import { TripRequest } from "./model/trip.request";

export class TripTicket {
  adjustementsOfPrice: number[] = [];
  total = 0;
  passengersWithDiscount = 0;
  lastnames: string[] = [];

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
    const result = this.adjustementsOfPrice.map(
      (discount) => apiPrice * discount
    );
    let sum = 0;
    for (let i = 0; i < result.length; i++) {
      sum += result[i];
    }

    this.total += sum + apiPrice * this.passengersWithDiscount;
    return this.total;
  }

  addLastname(lastname: string) {
    if (!this.hasLastname(lastname)) {
      this.lastnames.push(lastname);
    }
  }

  hasLastname(lastname: string) {
    return this.lastnames.includes(lastname);
  }

  saveLastNames(trainDetails: TripRequest) {
    trainDetails.passengers.forEach((passenger) => {
      if (passenger.canApplyFamilyDiscount()) {
        this.addLastname(passenger.lastname);
      }
    });
  }
}
