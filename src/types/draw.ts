import { type draws } from '@/db/schema';
import { type InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';

import { createDrawFormSchema } from '@/lib/zodSchemas';

export type Draw = InferSelectModel<typeof draws>;

export type CreateDraw = z.infer<typeof createDrawFormSchema>;
