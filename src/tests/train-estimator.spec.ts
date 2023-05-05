import { TrainTicketEstimator } from "../train-estimator";
import {
  Passenger,
  TripRequest,
  TripDetails,
  InvalidTripInputException,
  ApiException,
  DiscountCard,
} from "../model/trip.request";

describe("train estimator", function () {
  let trainTicketEstimator: TrainTicketEstimatorOverloads;
  const datePlus4Days: Date = new Date();
  const datePlus5Days: Date = new Date();
  const datePlus6Days: Date = new Date();
  const datePlus25Days: Date = new Date();
  const datePlus20Days: Date = new Date();
  const datePlus29Days: Date = new Date();
  const datePlus31Days: Date = new Date();

  class TrainTicketEstimatorOverloads extends TrainTicketEstimator {
    result = 0;

    public async fetchApi(trainDetails: TripRequest): Promise<number> {
      return this.result;
    }

    setResults(value: number) {
      this.result = value;
    }
  }

  beforeAll(() => {
    datePlus4Days.setDate(datePlus4Days.getDate() + 4);
    datePlus5Days.setDate(datePlus5Days.getDate() + 5);
    datePlus6Days.setDate(datePlus6Days.getDate() + 6);
    datePlus20Days.setDate(datePlus20Days.getDate() + 20);
    datePlus25Days.setDate(datePlus25Days.getDate() + 25);
    datePlus29Days.setDate(datePlus29Days.getDate() + 20);
    datePlus31Days.setDate(datePlus31Days.getDate() + 31);
  });

  beforeEach(() => {
    trainTicketEstimator = new TrainTicketEstimatorOverloads();
  });

  // * Exeptions

  it("should return 0 for no passenger", async () => {
    const tripDetails = new TripDetails("Paris", "Bordeaux", new Date());
    const request = new TripRequest(tripDetails, []);
    const result = await trainTicketEstimator.estimate(request);

    expect(result).toBe(0);
  });

  it("should return Exception for invalid departure", async () => {
    const passenger: Passenger = new Passenger(10, []);
    const tripDetails = new TripDetails(" ", "Bordeaux", new Date());
    const request = new TripRequest(tripDetails, [passenger]);
    await expect(
      async () => await trainTicketEstimator.estimate(request)
    ).rejects.toBeInstanceOf(InvalidTripInputException);
  });

  it("should return Exception for invalid destination", async () => {
    const passenger: Passenger = new Passenger(10, []);
    const tripDetails = new TripDetails("Paris", "    ", new Date());
    const request = new TripRequest(tripDetails, [passenger]);
    await expect(
      async () => await trainTicketEstimator.estimate(request)
    ).rejects.toBeInstanceOf(InvalidTripInputException);
  });

  it("should return Exception for invalid date", async () => {
    const passenger: Passenger = new Passenger(10, []);
    const tripDetails = new TripDetails(
      "Paris",
      "Bordeaux",
      new Date("2020-01-01")
    );
    const request = new TripRequest(tripDetails, [passenger]);
    await expect(
      async () => await trainTicketEstimator.estimate(request)
    ).rejects.toBeInstanceOf(InvalidTripInputException);
  });

  it("should return exception for invalid age", async () => {
    const passenger: Passenger = new Passenger(-1, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", new Date());
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 0;
    await expect(
      async () => await trainTicketEstimator.estimate(request)
    ).rejects.toBeInstanceOf(InvalidTripInputException);
  });

  it("should return exception for price equal -1", async () => {
    const passenger: Passenger = new Passenger(10, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", new Date());
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = -1;
    await expect(
      async () => await trainTicketEstimator.estimate(request)
    ).rejects.toBeInstanceOf(ApiException);
  });

  it("should return price for request", async () => {
    const passenger: Passenger = new Passenger(10, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", new Date());
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 0;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(0);
  });

  // * Age under 1

  it("should return price for age 0 and more 30 days", async () => {
    const passenger: Passenger = new Passenger(0, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(0);
  });

  it("should return price for age 0 and plus 20 days", async () => {
    const passenger: Passenger = new Passenger(0, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus20Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(0);
  });

  it("should return price for age 0 and plus 29 days", async () => {
    const passenger: Passenger = new Passenger(0, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus29Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(0);
  });

  it("should return price for age 0 and more 6 days", async () => {
    const passenger: Passenger = new Passenger(0, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus6Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(0);
  });

  it("should return price for age 0 and plus 4 days", async () => {
    const passenger: Passenger = new Passenger(0, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus4Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(0);
  });
  // * Age 2

  it("should return price for age 2 and more 30 days", async () => {
    const passenger: Passenger = new Passenger(2, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(9);
  });

  it("should return price for age 2 and plus 20 days", async () => {
    const passenger: Passenger = new Passenger(2, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus20Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(9);
  });

  it("should return price for age 2 and plus 29 days", async () => {
    const passenger: Passenger = new Passenger(2, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus29Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(9);
  });

  it("should return price for age 2 and more 6 days", async () => {
    const passenger: Passenger = new Passenger(2, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus6Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(9);
  });

  it("should return price for age 2 and plus 4 days", async () => {
    const passenger: Passenger = new Passenger(2, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus4Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(9);
  });

  // * Age 17

  it("should return price for age 17 and more 30 days", async () => {
    const passenger: Passenger = new Passenger(17, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(4);
  });

  it("should return price for age 17 and plus 20 days", async () => {
    const passenger: Passenger = new Passenger(17, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus20Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(6);
  });

  it("should return price for age 17 and plus 29 days", async () => {
    const passenger: Passenger = new Passenger(17, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus29Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(6);
  });

  it("should return price for age 17 and more 6 days", async () => {
    const passenger: Passenger = new Passenger(17, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus6Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(8.8);
  });

  it("should return price for age 17 and plus 4 days", async () => {
    const passenger: Passenger = new Passenger(17, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus4Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(16);
  });

  // * Age 19

  it("should return price for age 19 and plus 25 days", async () => {
    const passenger: Passenger = new Passenger(19, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus25Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(11);
  });
  it("should return price for age 19 and plus 5 days", async () => {
    const passenger: Passenger = new Passenger(19, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus5Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(22);
  });
  it("should return price for age 19 and more 30 days", async () => {
    const passenger: Passenger = new Passenger(19, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(10);
  });
  it("should return price for age 19 and less 20 days", async () => {
    const passenger: Passenger = new Passenger(19, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus20Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(12);
  });
  it("should return price for age 19 and more 29 days", async () => {
    const passenger: Passenger = new Passenger(19, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus29Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(12);
  });

  it("should return price for age 19 and more 6 days", async () => {
    const passenger: Passenger = new Passenger(19, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus6Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(14.8);
  });

  it("should return price for age 19 and more 4 days", async () => {
    const passenger: Passenger = new Passenger(19, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus4Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(22);
  });

  // * Age 70

  it("should return price for age 70 and more 30 days", async () => {
    const passenger: Passenger = new Passenger(70, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(6);
  });
  it("should return price for age 70 and less 20 days", async () => {
    const passenger: Passenger = new Passenger(70, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus20Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(8);
  });
  it("should return price for age 70 and more 29 days", async () => {
    const passenger: Passenger = new Passenger(70, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus29Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(8);
  });

  it("should return price for age 70 and more 6 days", async () => {
    const passenger: Passenger = new Passenger(70, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus6Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(10.8);
  });
  it("should return price for age 70 and more 4 days", async () => {
    const passenger: Passenger = new Passenger(70, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus4Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(18);
  });

  // * Discount cards
  it("should return price for age 70 and discount card senior and more 30 days", async () => {
    const discountCard = DiscountCard.Senior;
    const passenger: Passenger = new Passenger(70, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(4);
  });
  it("should return price for age 70 and discount card senior and less 20 days", async () => {
    const discountCard = DiscountCard.Senior;
    const passenger: Passenger = new Passenger(70, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus20Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(6);
  });
  it("should return price for age 70 and discount card senior and more 29 days", async () => {
    const discountCard = DiscountCard.Senior;
    const passenger: Passenger = new Passenger(70, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus29Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(6);
  });

  it("should return price for age 70 and discount card senior and more 6 days", async () => {
    const discountCard = DiscountCard.Senior;
    const passenger: Passenger = new Passenger(70, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus6Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(8.8);
  });
  it("should return price for age 70 and discount card senior and more 4 days", async () => {
    const discountCard = DiscountCard.Senior;
    const passenger: Passenger = new Passenger(70, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus4Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(16);
  });
  it("should return price for age 18 and discount card senior and more 4 days", async () => {
    const discountCard = DiscountCard.Senior;
    const passenger: Passenger = new Passenger(18, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus4Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(22);
  });
  it("should return price for staff with 70 years discount card staff and more 30 days", async () => {
    const discountCard = DiscountCard.TrainStroke;
    const passenger: Passenger = new Passenger(70, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(1);
  });
  it("should return price for staff with 0 years discount card staff and more 30 days", async () => {
    const discountCard = DiscountCard.TrainStroke;
    const passenger: Passenger = new Passenger(0, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(0);
  });
  it("should return price for staff with 1 year discount card staff and more 30 days", async () => {
    const discountCard = DiscountCard.TrainStroke;
    const passenger: Passenger = new Passenger(1, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(1);
  });
  it("should return price for staff with 17 year discount card staff and more 30 days", async () => {
    const discountCard = DiscountCard.TrainStroke;
    const passenger: Passenger = new Passenger(17, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(1);
  });
  it("should return price for staff with 19 year discount card staff and more 30 days", async () => {
    const discountCard = DiscountCard.TrainStroke;
    const passenger: Passenger = new Passenger(19, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(1);
  });
  it("should return price couple with dicount card couple and age ok", async () => {
    const discountCard = DiscountCard.Couple;
    const passenger1: Passenger = new Passenger(19, [discountCard]);
    const passenger2: Passenger = new Passenger(19, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger1, passenger2]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(16);
  });
  it("should return price couple with dicount card couple for one in couple and age ok -- not discount", async () => {
    const discountCard = DiscountCard.Couple;
    const passenger1: Passenger = new Passenger(19, [discountCard]);
    const passenger2: Passenger = new Passenger(19, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger1, passenger2]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(16);
  });
  it("should return price couple with dicount card couple for age not ok -- not discount", async () => {
    const discountCard = DiscountCard.Couple;
    const passenger1: Passenger = new Passenger(17, [discountCard]);
    const passenger2: Passenger = new Passenger(17, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger1, passenger2]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(8);
  });
  it("should return price couple with dicount card couple for age not ok -- not discount", async () => {
    const discountCard = DiscountCard.Couple;
    const passenger1: Passenger = new Passenger(18, [discountCard]);
    const passenger2: Passenger = new Passenger(18, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger1, passenger2]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(16);
  });
  it("should return price couple with dicount card couple for 3 personnes with age ok -- not discount", async () => {
    const discountCard = DiscountCard.Couple;
    const passenger1: Passenger = new Passenger(18, [discountCard]);
    const passenger2: Passenger = new Passenger(18, [discountCard]);
    const passenger3: Passenger = new Passenger(18, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [
      passenger1,
      passenger2,
      passenger3,
    ]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(30);
  });
  it("should return price couple with dicount card couple for 1 personne with age ok -- not discount", async () => {
    const discountCard = DiscountCard.Couple;
    const passenger1: Passenger = new Passenger(18, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger1]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(10);
  });

  it("should return price  with dicount card half-couple for 2 personnes with age ok -- not discount", async () => {
    const discountCard = DiscountCard.HalfCouple;
    const passenger1: Passenger = new Passenger(18, [discountCard]);
    const passenger2: Passenger = new Passenger(18, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger1, passenger2]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(20);
  });
  it("should return price half-couple with dicount card half-couple for 1 personne with age ok", async () => {
    const discountCard = DiscountCard.HalfCouple;
    const passenger1: Passenger = new Passenger(18, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger1]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(9);
  });
  it("should return price half-couple with dicount card half-couple for 1 personne with age not ok", async () => {
    const discountCard = DiscountCard.HalfCouple;
    const passenger1: Passenger = new Passenger(16, [discountCard]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger1]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(4);
  });
  it("should return price senior with dicount card senior couple for 2 personne with age ok", async () => {
    const discountCardCouple = DiscountCard.Couple;
    const discountCardSenior = DiscountCard.Senior;
    const passenger1: Passenger = new Passenger(70, [
      discountCardCouple,
      discountCardSenior,
    ]);
    const passenger2: Passenger = new Passenger(70, [
      discountCardCouple,
      discountCardSenior,
    ]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger1, passenger2]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(4);
  });
  it("should return price senior with dicount card senior couple for 2 personne with age ok", async () => {
    const discountCardHalfCouple = DiscountCard.HalfCouple;
    const discountCardSenior = DiscountCard.Senior;
    const passenger1: Passenger = new Passenger(70, [
      discountCardHalfCouple,
      discountCardSenior,
    ]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", datePlus31Days);
    const request = new TripRequest(tripDetails, [passenger1]);
    trainTicketEstimator.result = 10;
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(3);
  });
});
