import { TrainTicketEstimator } from "../train-estimator";
import {
  Passenger,
  TripRequest,
  TripDetails,
  DiscountCard,
} from "../model/trip.request";
import { InvalidTripInputException } from "../exceptions/InvalidTripInputException";
import { ApiPriceInformationsInterface } from "../external/api-price-informations.service";
import { ApiException } from "../exceptions/ApiException";

describe("train estimator", function () {
  let trainTicketEstimator: TrainTicketEstimator;
  const date4Days: Date = new Date();
  const date5Days: Date = new Date();
  const date6Days: Date = new Date();
  const date25Days: Date = new Date();
  const date20Days: Date = new Date();
  const date29Days: Date = new Date();
  const date31Days: Date = new Date();
  const date5Hours: Date = new Date();
  const date6Hours: Date = new Date();

  const cardSenior = DiscountCard.Senior;
  const cardCouple = DiscountCard.Couple;
  const cardTrainStroke = DiscountCard.TrainStroke;
  const cardFamily = DiscountCard.Family;
  const cardHalfCouple = DiscountCard.HalfCouple;
  
        
  class ApiPriceInformationsService
  implements ApiPriceInformationsInterface
  {
    private result = 10;
    async getPrice(trainDetails: TripRequest): Promise<number> {
      return this.result;
    }
    
    setResults(value: number) {
      this.result = value;
    }
  }
        
  const apiPriceInformationsService = new ApiPriceInformationsService();

  beforeAll(() => {
    date4Days.setDate(date4Days.getDate() + 4);
    date5Days.setDate(date5Days.getDate() + 5);
    date6Days.setDate(date6Days.getDate() + 6);
    date20Days.setDate(date20Days.getDate() + 20);
    date25Days.setDate(date25Days.getDate() + 25);
    date29Days.setDate(date29Days.getDate() + 20);
    date31Days.setDate(date31Days.getDate() + 31);
    date5Hours.setHours(date5Hours.getHours() + 5);
    date6Hours.setHours(date6Hours.getHours() + 6);
  });

  beforeEach(() => {
    apiPriceInformationsService.setResults(10);
    trainTicketEstimator = new TrainTicketEstimator(apiPriceInformationsService);
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
    apiPriceInformationsService.setResults(10);
    await expect(
      async () => await trainTicketEstimator.estimate(request)
    ).rejects.toBeInstanceOf(InvalidTripInputException);
  });

  it("should return exception for price equal -1", async () => {
    const passenger: Passenger = new Passenger(10, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", new Date());
    const request = new TripRequest(tripDetails, [passenger]);
    const trainTicketEstimator2 = new TrainTicketEstimator();
    apiPriceInformationsService.setResults(-1);
    await expect(
      async () => await trainTicketEstimator2.estimate(request)
    ).rejects.toBeInstanceOf(ApiException);
  });

  it("should return price for request", async () => {
    const passenger: Passenger = new Passenger(10, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", new Date());
    const request = new TripRequest(tripDetails, [passenger]);
    apiPriceInformationsService.setResults(0);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(0);
  });

  // * Age under 1

  it("should return price for age 0 and more 30 days", async () => {
    const passenger: Passenger = new Passenger(0, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(0);
  });

  it("should return price for age 0 and plus 20 days", async () => {
    const passenger: Passenger = new Passenger(0, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date20Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(0);
  });

  it("should return price for age 0 and plus 29 days", async () => {
    const passenger: Passenger = new Passenger(0, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date29Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(0);
  });

  it("should return price for age 0 and more 6 days", async () => {
    const passenger: Passenger = new Passenger(0, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date6Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(0);
  });

  it("should return price for age 0 and plus 4 days", async () => {
    const passenger: Passenger = new Passenger(0, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date4Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(0);
  });
  // * Age 2

  it("should return price for age 2 and more 30 days", async () => {
    const passenger: Passenger = new Passenger(2, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(9);
  });

  it("should return price for age 2 and plus 20 days", async () => {
    const passenger: Passenger = new Passenger(2, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date20Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(9);
  });

  it("should return price for age 2 and plus 29 days", async () => {
    const passenger: Passenger = new Passenger(2, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date29Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(9);
  });

  it("should return price for age 2 and more 6 days", async () => {
    const passenger: Passenger = new Passenger(2, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date6Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(9);
  });

  it("should return price for age 2 and plus 4 days", async () => {
    const passenger: Passenger = new Passenger(2, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date4Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(9);
  });

  // * Age 17

  it("should return price for age 17 and more 30 days", async () => {
    const passenger: Passenger = new Passenger(17, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(4);
  });

  it("should return price for age 17 and plus 20 days", async () => {
    const passenger: Passenger = new Passenger(17, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date20Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(6);
  });

  it("should return price for age 17 and plus 29 days", async () => {
    const passenger: Passenger = new Passenger(17, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date29Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(6);
  });

  it("should return price for age 17 and more 6 days", async () => {
    const passenger: Passenger = new Passenger(17, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date6Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(8.8);
  });

  it("should return price for age 17 and plus 4 days", async () => {
    const passenger: Passenger = new Passenger(17, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date4Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(16);
  });

  // * Age 19

  it("should return price for age 19 and plus 25 days", async () => {
    const passenger: Passenger = new Passenger(19, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date25Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(11);
  });
  it("should return price for age 19 and plus 5 days", async () => {
    const passenger: Passenger = new Passenger(19, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date5Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(22);
  });
  it("should return price for age 19 and more 30 days", async () => {
    const passenger: Passenger = new Passenger(19, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(10);
  });
  it("should return price for age 19 and less 20 days", async () => {
    const passenger: Passenger = new Passenger(19, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date20Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(12);
  });
  it("should return price for age 19 and more 29 days", async () => {
    const passenger: Passenger = new Passenger(19, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date29Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(12);
  });

  it("should return price for age 19 and more 6 days", async () => {
    const passenger: Passenger = new Passenger(19, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date6Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(14.8);
  });

  it("should return price for age 19 and more 4 days", async () => {
    const passenger: Passenger = new Passenger(19, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date4Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(22);
  });

  // * Age 70

  it("should return price for age 70 and more 30 days", async () => {
    const passenger: Passenger = new Passenger(70, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(6);
  });
  it("should return price for age 70 and less 20 days", async () => {
    const passenger: Passenger = new Passenger(70, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date20Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(8);
  });
  it("should return price for age 70 and more 29 days", async () => {
    const passenger: Passenger = new Passenger(70, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date29Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(8);
  });

  it("should return price for age 70 and more 6 days", async () => {
    const passenger: Passenger = new Passenger(70, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date6Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(10.8);
  });
  it("should return price for age 70 and more 4 days", async () => {
    const passenger: Passenger = new Passenger(70, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date4Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(18);
  });

  // * Discount cards
  it("should return price for age 70 and discount card senior and more 30 days", async () => {
    const passenger: Passenger = new Passenger(70, [cardSenior]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(4);
  });
  it("should return price for age 70 and discount card senior and less 20 days", async () => {
    const passenger: Passenger = new Passenger(70, [cardSenior]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date20Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(6);
  });
  it("should return price for age 70 and discount card senior and more 29 days", async () => {
    const passenger: Passenger = new Passenger(70, [cardSenior]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date29Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(6);
  });

  it("should return price for age 70 and discount card senior and more 6 days", async () => {
    const passenger: Passenger = new Passenger(70, [cardSenior]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date6Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(8.8);
  });
  it("should return price for age 70 and discount card senior and more 4 days", async () => {
    const passenger: Passenger = new Passenger(70, [cardSenior]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date4Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(16);
  });
  it("should return price for age 18 and discount card senior and more 4 days", async () => {
    const passenger: Passenger = new Passenger(18, [cardSenior]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date4Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(22);
  });
  it("should return price for staff with 70 years discount card staff and more 30 days", async () => {
    const passenger: Passenger = new Passenger(70, [cardTrainStroke]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(1);
  });
  it("should return price for staff with 0 years discount card staff and more 30 days", async () => {
    const passenger: Passenger = new Passenger(0, [cardTrainStroke]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(0);
  });
  it("should return price for staff with 1 year discount card staff and more 30 days", async () => {
    const passenger: Passenger = new Passenger(1, [cardTrainStroke]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(1);
  });
  it("should return price for staff with 17 year discount card staff and more 30 days", async () => {
    const passenger: Passenger = new Passenger(17, [cardTrainStroke]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(1);
  });
  it("should return price for staff with 19 year discount card staff and more 30 days", async () => {
    const passenger: Passenger = new Passenger(19, [cardTrainStroke]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(1);
  });
  it("should return price couple with dicount card couple and age ok", async () => {
    const passenger1: Passenger = new Passenger(19, [cardCouple]);
    const passenger2: Passenger = new Passenger(19, [cardCouple]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1, passenger2]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(16);
  });
  it("should return price couple with dicount card couple for one in couple and age ok -- not discount", async () => {
    const passenger1: Passenger = new Passenger(19, [cardCouple]);
    const passenger2: Passenger = new Passenger(19, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1, passenger2]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(16);
  });
  it("should return price couple with dicount card couple for age not ok -- not discount", async () => {
    const passenger1: Passenger = new Passenger(17, [cardCouple]);
    const passenger2: Passenger = new Passenger(17, [cardCouple]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1, passenger2]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(8);
  });
  it("should return price couple with dicount card couple for age not ok -- not discount", async () => {
    const passenger1: Passenger = new Passenger(18, [cardCouple]);
    const passenger2: Passenger = new Passenger(18, [cardCouple]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1, passenger2]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(16);
  });
  it("should return price couple with dicount card couple for 3 personnes with age ok -- not discount", async () => {
    const passenger1: Passenger = new Passenger(18, [cardCouple]);
    const passenger2: Passenger = new Passenger(18, [cardCouple]);
    const passenger3: Passenger = new Passenger(18, [cardCouple]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [
      passenger1,
      passenger2,
      passenger3,
    ]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(30);
  });
  it("should return price couple with dicount card couple for 1 personne with age ok -- not discount", async () => {
    const passenger1: Passenger = new Passenger(18, [cardCouple]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(10);
  });

  it("should return price  with dicount card half-couple for 2 personnes with age ok -- not discount", async () => {
    const passenger1: Passenger = new Passenger(18, [cardHalfCouple]);
    const passenger2: Passenger = new Passenger(18, [cardHalfCouple]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1, passenger2]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(20);
  });
  it("should return price half-couple with dicount card half-couple for 1 personne with age ok", async () => {
    const passenger1: Passenger = new Passenger(18, [cardHalfCouple]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(9);
  });
  it("should return price half-couple with dicount card half-couple for 1 personne with age not ok", async () => {
    const passenger1: Passenger = new Passenger(16, [cardHalfCouple]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(4);
  });
  it("should return price senior with dicount card senior couple for 2 personne with age ok", async () => {
    const passenger1: Passenger = new Passenger(70, [cardCouple, cardSenior]);
    const passenger2: Passenger = new Passenger(70, [cardCouple, cardSenior]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1, passenger2]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(4);
  });
  it("should return price senior with dicount card senior couple for 2 personne with age ok", async () => {
    const passenger1: Passenger = new Passenger(70, [
      cardHalfCouple,
      cardSenior,
    ]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(3);
  });
  it("should return price trainstroke with half couple", async () => {
    const passenger1: Passenger = new Passenger(20, [
      cardHalfCouple,
      cardTrainStroke,
    ]);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(0);
  });

  it("should return price with 20% reduction for travel in 6hours", async () => {
    const passenger1: Passenger = new Passenger(18, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date5Hours);
    const request = new TripRequest(tripDetails, [passenger1]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(10);
  });

  it("should return price with 20% reduction for travel in 6hours", async () => {
    const passenger1: Passenger = new Passenger(18, []);
    const tripDetails = new TripDetails("Paris", "Bordeaux", date6Hours);
    const request = new TripRequest(tripDetails, [passenger1]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(10);
  });

  //TESTS FOR FAMILY FEATURE

  it("should return price with family card for 1 ", async () => {
    const passenger1: Passenger = new Passenger(18, [cardFamily], "Dubois"); //( 10 + 20% -20% - 30%) -> 8.4
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(7);
  });

  it("should return price with family card for 2", async () => {
    const passenger1: Passenger = new Passenger(18, [cardFamily], "Dubois");
    const passenger2: Passenger = new Passenger(22, [], "Dubois");
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1, passenger2]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(14);
  });

  it("should return price with two family card for 2", async () => {
    const passenger1: Passenger = new Passenger(18, [cardFamily], "Dubois");
    const passenger2: Passenger = new Passenger(22, [cardFamily], "Dubois");
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1, passenger2]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(14);
  });

  it("should return price with family card for 2 adults with child", async () => {
    const passenger1: Passenger = new Passenger(18, [cardFamily], "Dubois"); //( 10 +20% -20 %- 30%) -> 7
    const passenger2: Passenger = new Passenger(22, [], "Dubois"); //( 10 +20% -20% - 30%) -> 7
    const passenger3: Passenger = new Passenger(6, [], "Dubois"); //( 10 -40% -20% - 30%) -> 1
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [
      passenger1,
      passenger2,
      passenger3,
    ]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(15);
  });

  it("should return price with family card for 3 adults", async () => {
    const passenger1: Passenger = new Passenger(18, [cardFamily], "Dubois"); //( 10 +20% -20% - 30%) -> 7
    const passenger2: Passenger = new Passenger(22, [], "Dubois"); //( 10 +20%  -20% - 30%) -> 7
    const passenger3: Passenger = new Passenger(19, [], "Dubois"); //( 10 +20%  -20% - 30%) -> 7
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [
      passenger1,
      passenger2,
      passenger3,
    ]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(21);
  });

  it("should return price with family card for 1 senior 2 adults", async () => {
    const passenger1: Passenger = new Passenger(18, [cardFamily], "Dubois"); //( 10 + 20%  -20% - 30%) -> 7
    const passenger2: Passenger = new Passenger(22, [], "Dubois"); //( 10 + 20%  -20% - 30%) -> 7
    const passenger3: Passenger = new Passenger(71, [], "Dubois"); //( 10 + -20% -20% - 30%) -> 3
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [
      passenger1,
      passenger2,
      passenger3,
    ]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(17);
  });

  it("should return price with family card for 2 adults with same lastname, 1 adult without same lastname", async () => {
    const passenger1: Passenger = new Passenger(18, [cardFamily], "Dubois"); //( 10 + 20%  -20% - 30%) -> 8.4
    const passenger2: Passenger = new Passenger(22, [], "Dubois"); //( 10 + 20%  -20% - 30%) -> 8.4
    const passenger3: Passenger = new Passenger(22, [], "Toto"); //( 10 + 20% -20%) -> 10
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [
      passenger1,
      passenger2,
      passenger3,
    ]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(24);
  });

  it("should return price with family card for 1 adult 1 child with same lastname, 1 adult without same lastname", async () => {
    const passenger1: Passenger = new Passenger(18, [cardFamily], "Dubois"); //( 10 + 20% -20% - 30%) -> 7
    const passenger2: Passenger = new Passenger(2, [], "Dubois"); //( 9 ) -> 9 // ? Fixe ?
    const passenger3: Passenger = new Passenger(22, [], "Toto"); //( 10 + 20% -20) -> 10
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [
      passenger1,
      passenger2,
      passenger3,
    ]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(26);
  });

  it("should return price with family card for 1 adult 1 minor with same lastname, 1 adult without same lastname", async () => {
    const passenger1: Passenger = new Passenger(18, [cardFamily], "Dubois"); //( 10 + 20% -20% - 30%) -> 7
    const passenger2: Passenger = new Passenger(15, [], "Dubois"); //( 10 -40% -20% - 30%) -> 1
    const passenger3: Passenger = new Passenger(22, [], "Toto"); //( 10 + 20% -20%) -> 10
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [
      passenger1,
      passenger2,
      passenger3,
    ]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(18);
  });

  it("should return price with family card for 1 adult with family card and 1 adult + 1 minor without same lastname", async () => {
    const passenger1: Passenger = new Passenger(18, [], "Dubois"); //( 10 + 20% -20%) -> 10
    const passenger2: Passenger = new Passenger(15, [], "Dubois"); //( 10 - 40% -20%) -> 4
    const passenger3: Passenger = new Passenger(22, [cardFamily], "Toto"); //( 10 + 20% - 30%) -> 7
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [
      passenger1,
      passenger2,
      passenger3,
    ]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(21);
  });

  it("should return price with family card for 1 adult with halfcouple card", async () => {
    const passenger1: Passenger = new Passenger(
      18,
      [cardFamily, cardHalfCouple],
      "Dubois"
    ); //( 10 + 20% -20% - 30%) -> 7 (la carte half couple ne compte pas)
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(7);
  });

  it("should return price with family card for 2 adult with couple card", async () => {
    const passenger1: Passenger = new Passenger(
      18,
      [cardFamily, cardCouple],
      "Dubois"
    ); //( 10 + 20% -20% - 30%) -> 7 (la carte couple ne compte pas)
    const passenger2: Passenger = new Passenger(18, [], "Dubois"); //( 10 + 20% -20% - 30%) -> 7
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1, passenger2]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(14);
  });

  //Note : La carte Train Stroke prime sur toutes les autres car elle n'est pas plus avantageuse que family
  it("should return price with family card for 2 adult with couple card", async () => {
    const passenger1: Passenger = new Passenger(
      18,
      [cardFamily, cardTrainStroke],
      "Dubois"
    ); // => 1
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(1);
  });

  it("should return price with family card for 1 senior with senior card", async () => {
    const passenger1: Passenger = new Passenger(
      71,
      [cardFamily, cardSenior],
      "Dubois"
    ); // ( 10 - 20% -20% - 30% ) => 3 (la carte senior ne compte pas)
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(3);
  });

  it("should return price with family card for 2 adult one with lastname other without lastname", async () => {
    const passenger1: Passenger = new Passenger(20, [cardFamily], "Dubois"); // ( 10 + 20% -20% - 30% ) => 8.4
    const passenger2: Passenger = new Passenger(20, [], ""); // ( 10 + 20% - 20% ) => 12
    const tripDetails = new TripDetails("Paris", "Bordeaux", date31Days);
    const request = new TripRequest(tripDetails, [passenger1, passenger2]);
    const result = await trainTicketEstimator.estimate(request);
    expect(result).toEqual(17);
  });
});
