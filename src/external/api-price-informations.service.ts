import { ApiException } from "../exceptions/ApiException";
import { TripRequest } from "../model/trip.request";

export interface ApiPriceInformationsInterface {
  getPrice(trainDetails: TripRequest): Promise<number>;
}

export class ApiPriceInformationsService
  implements ApiPriceInformationsInterface
{
  async getPrice(trainDetails: TripRequest): Promise<number> {
    const response = await fetch(
      `https://sncf.com/api/train/estimate/price?from=${trainDetails.details.from}&to=${trainDetails.details.to}&date=${trainDetails.details.when}`
    );
    const json = await response.json();
    const price = json.price || -1;
    if (price === -1) {
      throw new ApiException();
    }
    return price;
  }
}
