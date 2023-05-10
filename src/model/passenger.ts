export enum DiscountCard {
    Senior = "Senior",
    TrainStroke = "TrainStroke",
    Couple = "Couple",
    HalfCouple = "HalfCouple",
    Family = "Family",
  }
  

export class Passenger {
    hasLastname(): boolean {
      return this.lastname !== "";
    }
    isApplyFamilyDiscount = false;
  
    constructor(
      readonly age: number,
      readonly discounts: DiscountCard[],
      readonly lastname = ""
    ) {}
  
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