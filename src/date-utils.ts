import { DiscountCard, Passenger } from "./model/trip.request";

export class DateUtils {
 


  static getDateInFutur(days: number): Date {
    const date = new Date(
      this.getToday().setDate(this.getToday().getDate() + days)
    );
    return date;
  }

    
  static getToday() {
    return new Date();
  }

  static getDateInFuturHours(hours: number): Date {
    const date = new Date(
      this.getToday().setHours(this.getToday().getHours() + hours)
    );
    return date;
  }

  static dateDiffInDays(date1: Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const diffTime: number = Math.abs(
      date1.getTime() - this.getToday().getTime()
    );
    const diffDays: number = Math.ceil(diffTime / _MS_PER_DAY);

    return diffDays;
  }

 
  
}
