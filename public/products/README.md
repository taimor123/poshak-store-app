# Demo product images

Put product images here named `{slug}-{n}.jpg` (`.png`/`.webp` also work), e.g. `noor-1.jpg`, `noor-2.jpg`.
`-1` is the cover. Portrait 3:4 works best (e.g. 900×1200).

Then attach them to the demo products in the database (from poshak-store-apis):

    npm run db:attach-images -- ../poshak-store-app/public/products

Slugs: gulnar, noor, mahjabeen, zeenat, rania, farasha, sitara, dilnaz, mehr,
ayesha, hania, shireen, sana, roshan, parveen, bano.

These are for development/demo only. Real products get real photos uploaded
through the admin (Cloudinary) — the product page promises photos taken in daylight.
