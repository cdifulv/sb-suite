'use server';

import { revalidateTag as revalidate } from 'next/cache';

async function revalidateTag(name: string) {
  revalidate(name);
}

export default revalidateTag;
