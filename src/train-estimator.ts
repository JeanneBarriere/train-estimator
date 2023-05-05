import { DiscountByCard } from "./discount";
import { DiscountCard, Passenger, TripRequest } from "./model/trip.request";
import { TripTicket } from "./trip-ticket";
import { InvalidTripInputException } from "./exceptions/InvalidTripInputException";
import { ApiPriceInformationsService } from "./external/api-price-informations.service";

export class TrainTicketEstimator {
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

      tripTicket.addDiscounts(
        this.calculAdjustmentPrice(passenger, trainDetails)
      );
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

  addDiscountForCoupleCards(
    tripTicket: TripTicket,
    trainDetails: TripRequest
  ): void {
    const discountCard: DiscountCard = trainDetails.hasOnePassenger()
      ? DiscountCard.HalfCouple
      : DiscountCard.Couple;

    if (trainDetails.cantApplyDiscountForCoupleCards(discountCard)) return;
    tripTicket.addDiscount(-DiscountByCard.getDiscount(discountCard));
  }

  getFixPrice(passenger: Passenger) {
    if (passenger.age < 0) {
      throw new InvalidTripInputException("Age is invalid");
    }
    if (passenger.age < 1) {
      return 0;
    }
    if (passenger.hasDiscount(DiscountCard.TrainStroke)) {
      return 1;
    }
    if (passenger.age < 4) {
      return 9;
    }
    return -1;
  }

  // TODO: refacto and split this method in two
  calculAdjustmentPrice(
    passenger: Passenger,
    trainDetails: TripRequest
  ): number[] {
    const reductions = [];

    if (passenger.age <= 17) {
      reductions.push(-0.4);

      // Seniors
    } else if (passenger.age >= 70) {
      reductions.push(-0.2);
      if (passenger.hasDiscount(DiscountCard.Senior)) {
        reductions.push(-0.2);
      }
    } else {
      reductions.push(0.2);
    }

    if (trainDetails.getDeparture() >= this.getDateInFutur(30)) {
      reductions.push(-0.2);
    } else if (trainDetails.getDeparture() > this.getDateInFutur(5)) {
      const diffDays = this.dateDiffInDays(trainDetails.getDeparture());
      reductions.push((20 - diffDays) * 0.02); // I tried. it works. I don't know why.
    } else {
      reductions.push(1);
    }
    return reductions;
  }

  protected async fetchPrice(trainDetails: TripRequest) {
    const apiService = new ApiPriceInformationsService();
    return await apiService.getPrice(trainDetails);
  }
}
