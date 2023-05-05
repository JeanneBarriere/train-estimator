import { TrainTicketEstimator } from "../train-estimator";
import {
  Passenger,
  TripRequest,
  TripDetails,
  InvalidTripInputException,
  ApiException,
} from "../model/trip.request";

describe("train estimator", function () {
  let trainTicketEstimator: TrainTicketEstimatorOverloads;

  class TrainTicketEstimatorOverloads extends TrainTicketEstimator {
    result = 0;

    public async fetchApi(trainDetails: TripRequest): Promise<number> {
      return this.result;
    }

    setResults(value: number) {
      this.result = value;
    }
  }

  beforeEach(() => {
    trainTicketEstimator = new TrainTicketEstimatorOverloads();
  });

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
});

// it('should throw an exception if the file is not valid', async function () {
//     await expect(async () => await gameOfLifeFileManager.computeFromFilePath(`${__dirname}/tests/files/invalid.txt`)).rejects.toBeInstanceOf(InvalidInputException)
//   });
