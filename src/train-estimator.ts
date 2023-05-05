import {
  ApiException,
  DiscountCard,
  InvalidTripInputException,
  Passenger,
  TripRequest,
} from "./model/trip.request";

export class TrainTicketEstimator {
  getToday() {
    return new Date();
  }

  getDateInFutur(days: number): Date {
    const date = new Date(
      this.getToday().setDate(this.getToday().getDate() + days)
    );
    return date;
  }

  async estimate(trainDetails: TripRequest): Promise<number> {
    const passengers = trainDetails.passengers;
    if (passengers.length === 0) {
      return 0;
    }

    this.inputValidate(trainDetails);

    // TODO USE THIS LINE AT THE END
    const apiPrice = await this.fetchPrice(trainDetails);

    if (apiPrice === -1) {
      throw new ApiException();
    }

    let total = 0;

    for (const passenger of passengers) {
      const fixPrice = this.getFixPrice(passenger);
      if (fixPrice != -1) {
        total += fixPrice;
        continue;
      }

      const reductions = this.calculReductionsPassenger(
        passenger,
        trainDetails
      );

      const result = reductions.map((reduction) => apiPrice * reduction);
      let sum = 0;
      for (let i = 0; i < result.length; i++) {
        sum += result[i];
      }
      total += sum + apiPrice;
    }

    if (passengers.length == 2) {
      let hasDiscount = false;
      let minor = false;
      for (let i = 0; i < passengers.length; i++) {
        if (passengers[i].hasDiscount(DiscountCard.Couple)) {
          hasDiscount = true;
        }
        if (passengers[i].isMinor()) {
          minor = true;
        }
      }
      if (hasDiscount && !minor) {
        total -= apiPrice * 0.2 * 2;
      }
    }

    if (passengers.length == 1) {
      if (
        passengers[0].hasDiscount(DiscountCard.HalfCouple) &&
        !passengers[0].isMinor()
      ) {
        total -= apiPrice * 0.1;
      }
    }

    return total;
  }

  private inputValidate(trainDetails: TripRequest) {
    if (trainDetails.details.from.trim().length === 0) {
      throw new InvalidTripInputException("Start city is invalid");
    }

    if (trainDetails.details.to.trim().length === 0) {
      throw new InvalidTripInputException("Destination city is invalid");
    }

    if (
      trainDetails.getDeparture() <
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDay(),
        0,
        0,
        0
      )
    ) {
      throw new InvalidTripInputException("Date is invalid");
    }
  }

  protected async fetchPrice(trainDetails: TripRequest) {
    return (
      (
        await (
          await fetch(
            `https://sncf.com/api/train/estimate/price?from=${trainDetails.details.from}&to=${trainDetails.details.to}&date=${trainDetails.details.when}`
          )
        ).json()
      )?.price || -1
    );
  }

  dateDiffInDays(date1: Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const diffTime: number = Math.abs(
      date1.getTime() - this.getToday().getTime()
    );
    const diffDays: number = Math.ceil(diffTime / _MS_PER_DAY);

    return diffDays;
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

  calculReductionsPassenger(
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
      // on retire les 20% de la reduc quand on achete le billet tardivement
      reductions.push(-0.2);
    } else if (trainDetails.getDeparture() > this.getDateInFutur(5)) {
      const diffDays = this.dateDiffInDays(trainDetails.getDeparture());
      reductions.push((20 - diffDays) * 0.02); // I tried. it works. I don't know why.
    } else {
      reductions.push(1);
    }
    return reductions;
  }
}
