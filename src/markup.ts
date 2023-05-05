import { DiscountCard, Passenger } from "./model/trip.request";

export class Markup {

  static getMarkupByAge(passenger: Passenger): number {
    if (passenger.isMajor()) {
      return 0.2;
    } else {
        return 0;
    }
  }
  
}
