import { NextResponse, type NextRequest } from 'next/server';
import { updateOrder } from '@/db/actions';

import { type UpdateOrder } from '@/types/order';
import { updateOrderSchema } from '@/lib/zodSchemas';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = Number(params.id);
    const body = (await request.json()) as UpdateOrder;
    const parsedBody = updateOrderSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: 'Invalid form data',
          errors: parsedBody.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    await updateOrder(orderId, parsedBody.data);

    return NextResponse.json({
      status: 'success',
      message: 'Due date set successfully'
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
