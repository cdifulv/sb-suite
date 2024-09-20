import { type draws } from '@/db/schema';
import { type InferSelectModel } from 'drizzle-orm';
import { type z } from 'zod';

import { type createDrawFormSchema } from '@/lib/zodSchemas';

export type Draw = InferSelectModel<typeof draws>;

export type CreateDraw = z.infer<typeof createDrawFormSchema>;
