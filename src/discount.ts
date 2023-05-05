import { DiscountCard, Passenger } from "./model/trip.request";

export class Discount {
  static getDiscountByCard(card: DiscountCard): number {
    switch (card) {
      case DiscountCard.Senior:
        return 0.2;
      case DiscountCard.TrainStroke:
        return 0;
      case DiscountCard.Couple:
        return 0.4;
      case DiscountCard.HalfCouple:
        return 0.1;
      default:
        return 0;
    }
  }
  static getDiscountByAge(passenger: Passenger): number {
    if (passenger.isMinor()) {
      return 0.4;
    } else if (passenger.isSenior()) {
      return 0.2;
    } else {
      return 0;
    }
  }
  
}
