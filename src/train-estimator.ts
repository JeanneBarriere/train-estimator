import { Discount } from "./discount";
import { DiscountCard, Passenger, TripRequest } from "./model/trip.request";
import { TripTicket } from "./trip-ticket";
import { InvalidTripInputException } from "./exceptions/InvalidTripInputException";
import { ApiPriceInformationsService } from "./external/api-price-informations.service";
import { Markup } from "./markup";
import { DateUtils } from "./date-utils";

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
    return DateUtils.getToday();
  }

  getDateInFutur(days: number): Date {
    const date = new Date(
      this.getToday().setDate(this.getToday().getDate() + days)
    );
    return date;
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

  calculAdjustmentPriceByAge(passenger: Passenger, tripTicket: TripTicket) {
      tripTicket.addDiscount(Discount.getDiscountByAge(passenger));
      tripTicket.addMarkup(Markup.getMarkupByAge(passenger));
      if (passenger.hasDiscount(DiscountCard.Senior) && passenger.isSenior()) {
        tripTicket.addDiscount(Discount.getDiscountByCard(DiscountCard.Senior));
      }
  }

  calculAdjustmentPriceByDate(trainDetails: TripRequest, tripTicket: TripTicket) {
    tripTicket.addMarkup(Markup.getMarkupByDate(trainDetails.getDeparture()));
    tripTicket.addDiscount(Discount.getDiscountByDate(trainDetails.getDeparture()));
  }


  protected async fetchPrice(trainDetails: TripRequest) {
    const apiService = new ApiPriceInformationsService();
    return await apiService.getPrice(trainDetails);
  }
}
