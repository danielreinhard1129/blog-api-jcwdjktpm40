import { PrismaClient } from "../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";
// import { RedisService } from "../redis/redis.service.js";

export class SampleService {
  constructor(
    private prisma: PrismaClient,
    // private redisService: RedisService,
  ) {}

  getSamples = async () => {
    // const cacheSamples = await this.redisService.getValue("samples");

    // if (cacheSamples) {
    //   console.log("INI DATA SAMPLES DARI REDIS");
    //   return JSON.parse(cacheSamples);
    // }

    const samples = await this.prisma.sample.findMany();

    // await this.redisService.setValue("samples", JSON.stringify(samples), 30);

    // console.log("INI DATA SAMPLES DARI DATABASE");
    return samples;
  };

  getSample = async (id: number) => {
    const sample = await this.prisma.sample.findUnique({
      where: { id },
    });

    if (!sample) {
      throw new ApiError("sample not found", 404);
    }

    return sample;
  };
}
