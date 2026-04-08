import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "../../generated/prisma/client.js";
import { ApiError } from "../../utils/api-error.js";

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  register = async (body: User) => {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (user) {
      throw new ApiError("Email already exist", 400);
    }

    const hashedPassword = await hash(body.password);

    await this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      },
    });

    return {
      message: "register success",
    };
  };

  login = async (body: User) => {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) throw new ApiError("Invalid credentials", 400);

    const isPassMatch = await verify(user.password, body.password);

    if (!isPassMatch) throw new ApiError("Invalid credentials", 400);

    const payload = { id: user.id, role: user.role };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "2h",
    });

    const { password, ...userWithoutPassword } = user; // remove property password

    return { user: userWithoutPassword, accessToken };
  };
}
