// ============================================================
//  SITEMAP RIENG CHO /blog/  —  ra /blog/sitemap.xml
//
//  Vi sao can file nay: chuxetai.com (goc) do project MARKETING phuc vu,
//  chi rieng duong /blog/* moi chay vao project blog nay. Nen ban sitemap.xml
//  o goc (/sitemap.xml) KHONG mo duoc tu chuxetai.com — phai co ban trong /blog/.
//  File khoa IndexNow cung nam o /blog/ vi ly do tuong tu, va IndexNow chi cho
//  bao nhung URL nam CUNG thu muc voi file khoa -> sitemap nay chi liet ke /blog/.
// ============================================================
import { getCollection } from 'astro:content';

export async function GET(context) {
  const site = (context.site?.href || 'https://chuxetai.com/').replace(/\/$/, '');
  const now = Date.now();

  const baiViet = (await getCollection('blog')).filter(
    (b) => b.data.ngayDang.valueOf() <= now,
  );

  const urls = [{ loc: site + '/blog/', lastmod: null }];
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
