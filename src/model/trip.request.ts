export class Passenger {
  constructor(readonly age: number, readonly discounts: DiscountCard[]) {}

  public isMinor(): boolean {
    return this.age < 18;
  }

  public hasDiscount(discount: DiscountCard): boolean {
    return this.discounts.includes(discount);
  }
}

export class TripRequest {
  constructor(
    readonly details: TripDetails,
    readonly passengers: Passenger[]
  ) {}
  public getDeparture(): Date {
    return this.details.when;
  }

  public passengersHasDiscount(discount: DiscountCard): boolean {
    return this.passengers.some((passenger) =>
      passenger.hasDiscount(discount)
    );
  }

  public hasMinor(): boolean {
    return this.passengers.some((passenger) => passenger.isMinor());
  }

  numberOfPassengers(): number {
    return this.passengers.length;
  }

  cantApplyDiscountForCoupleCards(card : DiscountCard): boolean {
    return this.hasMinor() || !this.passengersHasDiscount(card);
  }

  hasOnePassenger(): boolean {
    return this.numberOfPassengers() === 1;
  }

}

export class TripDetails {
  constructor(
    readonly from: string,
    readonly to: string,
    readonly when: Date
  ) {}
}


export enum DiscountCard {
  Senior = "Senior",
  TrainStroke = "TrainStroke",
  Couple = "Couple",
  HalfCouple = "HalfCouple",
}
