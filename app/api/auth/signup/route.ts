import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth/user-store";

interface SignupBody {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
}

function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SignupBody;

    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const password = body.password || "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters and include uppercase, lowercase, and a number.",
        },
        { status: 400 }
      );
    }

    const user = await createUser({
      name,
      email,
      password,
      phone: body.phone,
    });

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create account at the moment.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
