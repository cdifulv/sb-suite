import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { createOrder } from '@/db/actions';

import { CreateOrder } from '@/types/order';
import { createOrderFormSchema } from '@/lib/zodSchemas';

export async function POST(request: NextRequest) {
  const tags = request.nextUrl.searchParams.get('tags');
  try {
    const body = (await request.json()) as CreateOrder;
    const parsedBody = createOrderFormSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: 'Invalid form data',
          errors: parsedBody.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    await createOrder(parsedBody.data);
    if (tags && tags.length > 0) {
      for (const tag of tags.split(',')) {
        revalidateTag(tag);
      }
    }

    return NextResponse.json({
      status: 'success',
      message: 'Order created successfully'
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message: (error as Error).message
      },
      { status: 500 }
    );
  }
}
