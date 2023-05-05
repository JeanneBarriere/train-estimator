import { DiscountCard } from "./model/trip.request";

export class DiscountByCard {
  static getDiscount(card: DiscountCard): number {
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
}
