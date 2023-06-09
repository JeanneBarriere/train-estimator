import { DateUtils } from "./date-utils";
import { DiscountCard, Passenger } from "./model/trip.request";

export class Discount {
  static getDiscountByCard(card: DiscountCard): number {
    switch (card) {
      case DiscountCard.Senior:
        return 0.2;
      case DiscountCard.Family:
        return 0.3;
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

  static getDiscountByDate(date: Date): number {
    if (date <= DateUtils.getDateInFuturHours(6)) {
      return 0.2;
    }
    if (date >= DateUtils.getDateInFutur(30)) {
      return 0.2;
    }
    return 0;
  }
}
