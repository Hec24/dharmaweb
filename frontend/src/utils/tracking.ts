// src/utils/tracking.ts
export type TrackBuyClickArgs = {
  areaSlug: string;
  cursoId: string;
  cursoTitulo: string;
  valueEUR?: number;
};

export function trackListView(areaSlug: string): void {
  // GA4: vista de lista de cursos del área
  window.gtag?.("event", "view_item_list", {
    item_list_id: `area_${areaSlug}`,
    item_list_name: `Área ${areaSlug}`,
  });

  // Meta: ViewContent de la lista
  window.fbq?.("track", "ViewContent", {
    content_category: `area_${areaSlug}`,
  });
}

export function trackBuyClick({
  areaSlug,
  cursoId,
  cursoTitulo,
  valueEUR,
}: TrackBuyClickArgs): void {
  // GA4: select_item + begin_checkout (patrón estándar)
  window.gtag?.("event", "select_item", {
    item_list_id: `area_${areaSlug}`,
    item_list_name: `Área ${areaSlug}`,
    items: [{ item_id: cursoId, item_name: cursoTitulo }],
  });

  window.gtag?.("event", "begin_checkout", {
    currency: "EUR",
    value: valueEUR,
    items: [{ item_id: cursoId, item_name: cursoTitulo }],
  });

  // Meta Pixel: InitiateCheckout
  window.fbq?.("track", "InitiateCheckout", {
    content_ids: [cursoId],
    content_name: cursoTitulo,
    content_category: `area_${areaSlug}`,
    currency: "EUR",
    value: valueEUR,
  });
}
