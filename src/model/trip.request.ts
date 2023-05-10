export class Passenger {
  constructor(
    readonly age: number,
    readonly discounts: DiscountCard[],
    readonly lastname = ""
  ) {}
  
  canApplyFamilyDiscount() {
    return this.hasLastname() && this.hasDiscount(DiscountCard.Family);
  }
  hasLastname(): boolean {
    return this.lastname !== "";
  }
  isApplyFamilyDiscount = false;


  public isMinor(): boolean {
    return this.age < 18;
  }

  public isMajor(): boolean {
    return this.age >= 18 && this.age < 70;
  }

  public isSenior(): boolean {
    return this.age >= 70;
  }

  public isBaby(): boolean {
    return this.age < 1;
  }

  public isKid(): boolean {
    return this.age >= 1 && this.age < 4;
  }

  public hasDiscount(discount: DiscountCard): boolean {
    return this.discounts.includes(discount);
  }

  get isFamilyDiscount(): boolean {
    return this.isApplyFamilyDiscount;
  }

  valideFamilyDiscount(): void {
    this.isApplyFamilyDiscount = true;
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
    return this.passengers.some((passenger) => passenger.hasDiscount(discount));
  }

  public hasMinor(): boolean {
    return this.passengers.some((passenger) => passenger.isMinor());
  }

  numberOfPassengers(): number {
    return this.passengers.length;
  }

  cantApplyDiscountForCoupleCards(card: DiscountCard): boolean {
    return this.hasMinor() || !this.passengersHasDiscount(card);
  }

  hasOnePassenger(): boolean {
    return this.numberOfPassengers() === 1;
  }

  canApplyFamilyDiscount(): boolean {
    return this.passengers.some(
      (passenger) =>
        passenger.hasDiscount(DiscountCard.Family) && passenger.hasLastname()
    );
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
  Family = "Family",
}
