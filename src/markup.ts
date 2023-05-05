import { DateUtils } from "./date-utils";
import { InvalidTripInputException } from "./exceptions/InvalidTripInputException";
import { Passenger } from "./model/trip.request";

export class Markup {

  static getMarkupByAge(passenger: Passenger): number {
    if (passenger.isMajor()) {
      return 0.2;
    } else {
        return 0;
    }
  }
    
  static getDateInFutur(days: number): Date {
    const date = new Date(
      this.getToday().setDate(this.getToday().getDate() + days)
    );
    return date;
  }

    
  static getToday() {
    return new Date();
  }
    
    static getMarkupByDate(date: Date): number {
       

        if (date > this.getDateInFutur(5) && date < this.getDateInFutur(30)) {
        const diffDays = DateUtils.dateDiffInDays(date);
            return (20 - diffDays) * 0.02;
        }
        
        if (date <= this.getDateInFutur(5)) {
            return 1;
        }
        return 0;
    }


  
}
