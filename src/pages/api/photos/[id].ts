import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/index';
import { animalPhotos } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ params }) => {
  const photoId = parseInt(params.id ?? '0');
  if (!photoId) {
    return new Response('Not found', { status: 404 });
  }

  const [photo] = await db
    .select({
      photoData: animalPhotos.photoData,
      mimeType: animalPhotos.mimeType,
    })
    .from(animalPhotos)
    .where(eq(animalPhotos.id, photoId));

  if (!photo || !photo.photoData) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(photo.photoData as Buffer, {
    status: 200,
    headers: {
      'Content-Type': photo.mimeType,
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
