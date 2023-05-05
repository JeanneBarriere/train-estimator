export class Passenger {
  constructor(readonly age: number, readonly discounts: DiscountCard[]) {}

  public isMinor(): boolean {
    return this.age < 18;
  }

  public hasDiscount(discount : DiscountCard): boolean {
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
}

export class TripDetails {
  constructor(
    readonly from: string,
    readonly to: string,
    readonly when: Date
  ) {}
}

export class InvalidTripInputException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ApiException extends Error {
  constructor() {
    super("Api error");
  }
}

export enum DiscountCard {
  Senior = "Senior",
  TrainStroke = "TrainStroke",
  Couple = "Couple",
  HalfCouple = "HalfCouple",
}
