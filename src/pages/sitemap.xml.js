// ============================================================
//  SITEMAP tu dong (KHONG can thu vien ngoai) — Google doc file nay
//  de biet web co nhung trang nao. Chay luc build -> ra /sitemap.xml
//  Tu them bai blog moi (chi tinh bai da toi ngay dang).
// ============================================================
import { getCollection } from 'astro:content';

// Trang tinh cho phep Google lap chi muc (KHONG gom /quan-ly, /admin)
const TRANG_TINH = ['/', '/blog/'];

export async function GET(context) {
  const site = (context.site?.href || 'https://chuxetai.com/').replace(/\/$/, '');
  const now = Date.now();

  const baiViet = (await getCollection('blog')).filter(
    (b) => b.data.ngayDang.valueOf() <= now,
  );

  const urls = [];
  for (const p of TRANG_TINH) urls.push({ loc: site + p, lastmod: null });
  for (const b of baiViet) {
    urls.push({
      loc: site + '/blog/' + b.id + '/',
      lastmod: new Date(b.data.ngayDang).toISOString().slice(0, 10),
    });
  }

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(
        (u) =>
          '  <url><loc>' +
          u.loc +
          '</loc>' +
          (u.lastmod ? '<lastmod>' + u.lastmod + '</lastmod>' : '') +
          '</url>',
      )
      .join('\n') +
    '\n</urlset>\n';

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
