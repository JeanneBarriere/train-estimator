import { Discount } from "./discount";
import { DiscountCard, Passenger, TripRequest } from "./model/trip.request";
import { TripTicket } from "./trip-ticket";
import { InvalidTripInputException } from "./exceptions/InvalidTripInputException";
import { ApiPriceInformationsService } from "./external/api-price-informations.service";

export class TrainTicketEstimator {
  // Note : Dans le code de base TrainStroke est bien cumulable avec la carte halfCouple, cf le dernier test de la classe TrainTicketEstimatorTest
  // nous avons n'avons pas modifier ce fonctionnement
  async estimate(trainDetails: TripRequest): Promise<number> {
    if (trainDetails.numberOfPassengers() === 0) {
      return 0;
    }
    this.validateInputs(trainDetails);

    const tripTicket = new TripTicket();

    for (const passenger of trainDetails.passengers) {
      const fixPrice = this.getFixPrice(passenger);
      if (fixPrice != -1) {
        tripTicket.addTotal(fixPrice);
        continue;
      }

      this.calculAdjustmentPrice(passenger, trainDetails, tripTicket);
    }

    if (trainDetails.numberOfPassengers() < 3) {
      this.addDiscountForCoupleCards(tripTicket, trainDetails);
    }

    const apiPrice = await this.fetchPrice(trainDetails);
    return tripTicket.calculTotal(apiPrice);
  }

  // TODO: refacto extract all methods with date logic
  getToday() {
    return new Date();
  }

  getDateInFutur(days: number): Date {
    const date = new Date(
      this.getToday().setDate(this.getToday().getDate() + days)
    );
    return date;
  }

  dateDiffInDays(date1: Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const diffTime: number = Math.abs(
      date1.getTime() - this.getToday().getTime()
    );
    const diffDays: number = Math.ceil(diffTime / _MS_PER_DAY);

    return diffDays;
  }

  private validateInputs(trainDetails: TripRequest) {
    if (trainDetails.details.from.trim().length === 0) {
      throw new InvalidTripInputException("Start city is invalid");
    }

    if (trainDetails.details.to.trim().length === 0) {
      throw new InvalidTripInputException("Destination city is invalid");
    }

    const todayMidnight = this.getToday().setHours(0, 0, 0, 0);
    if (trainDetails.getDeparture().getTime() < todayMidnight) {
      throw new InvalidTripInputException("Date is invalid");
    }
  }

  private addDiscountForCoupleCards(
    tripTicket: TripTicket,
    trainDetails: TripRequest
  ): void {
    const discountCard: DiscountCard = trainDetails.hasOnePassenger()
      ? DiscountCard.HalfCouple
      : DiscountCard.Couple;

    if (trainDetails.cantApplyDiscountForCoupleCards(discountCard)) return;
    tripTicket.addDiscount(Discount.getDiscountByCard(discountCard));
  }

  private getFixPrice(passenger: Passenger) {
    if (passenger.age < 0) {
      throw new InvalidTripInputException("Age is invalid");
    }
    if (passenger.isBaby()) {
      return 0;
    }
    if (passenger.hasDiscount(DiscountCard.TrainStroke)) {
      return 1;
    }
    if (passenger.isKid()) {
      return 9;
    }
    return -1;
  }

  
  private calculAdjustmentPrice(
    passenger: Passenger,
    trainDetails: TripRequest,
    tripTicket: TripTicket
  ): void {
    this.calculAdjustmentPriceByAge(passenger, tripTicket);
    this.calculAdjustmentPriceByDate(trainDetails, tripTicket);
    tripTicket.addPassengerWithAdjustments();
  }

  // TODO: refacto 
  calculAdjustmentPriceByAge(passenger: Passenger, tripTicket: TripTicket) {
    // if (passenger.isMinor()) {
    //   tripTicket.addDiscount(Discount.getDiscountByAge(passenger));
    // } else if (passenger.isSenior()) {
      tripTicket.addDiscount(Discount.getDiscountByAge(passenger));
      if (passenger.hasDiscount(DiscountCard.Senior) && passenger.isSenior()) {
        tripTicket.addDiscount(Discount.getDiscountByCard(DiscountCard.Senior));
      }
    // } else {
    //   tripTicket.addMarkup(0.2);
    // }
  }

  // TODO: refacto 
  calculAdjustmentPriceByDate(trainDetails: TripRequest, tripTicket: TripTicket) {
    if (trainDetails.getDeparture() >= this.getDateInFutur(30)) {
      tripTicket.addDiscount(0.2);
    } else if (trainDetails.getDeparture() > this.getDateInFutur(5)) {
      const diffDays = this.dateDiffInDays(trainDetails.getDeparture());
      tripTicket.addMarkup((20 - diffDays) * 0.02); // I tried. it works. I don't know why.
    } else {
      tripTicket.addMarkup(1);
    }
  }


  protected async fetchPrice(trainDetails: TripRequest) {
    const apiService = new ApiPriceInformationsService();
    return await apiService.getPrice(trainDetails);
  }
}
