import fs from 'fs';
import path from 'path';
import { toPosixPath } from './utils';

export function writeSitemap(rootUrl: string, distRoot: string) {
    // Walk all files under /llm, write all to a `sitemap-llm.xml` file. Also include `llms.txt`
    const llmFiles = walkDir(distRoot, path.join(distRoot, 'llm'));
    llmFiles.push(toPosixPath(path.relative(distRoot, path.join(distRoot, 'llms.txt'))));
    const llmSitemapUrls = llmFiles.map(file => `<url><loc>${rootUrl}/${file}</loc></url>`).join('\n');
    fs.writeFileSync(
        path.join(distRoot, 'sitemap-llm.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${llmSitemapUrls}
</urlset>
`,
'utf8',
    );

    // Check if there's already a `sitemap-index.xml` file. If so, we want to *add* to it.
    const sitemapIndexPath = path.join(distRoot, 'sitemap-index.xml');
    let sitemapIndexXml: string
    if (fs.existsSync(sitemapIndexPath)) {
        sitemapIndexXml = fs.readFileSync(sitemapIndexPath, 'utf8');
        sitemapIndexXml = sitemapIndexXml.replace(
            '</sitemapindex>', 
`<sitemap>
    <loc>${rootUrl}/sitemap-llm.xml</loc>
</sitemap>
</sitemapindex>`
        );
    } else {
        sitemapIndexXml = 
`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${rootUrl}/sitemap.xml</loc>
    </sitemap>
    <sitemap>
        <loc>${rootUrl}/sitemap-llm.xml</loc>
    </sitemap>
</sitemapindex>
`;
    }

    fs.writeFileSync(sitemapIndexPath, sitemapIndexXml, 'utf8');
}

function walkDir(distRoot: string, dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((file) => {
        if (file.isDirectory()) {
            return walkDir(distRoot, path.join(dir, file.name));
        } else {
            return [toPosixPath(path.relative(distRoot, path.join(dir, file.name)))];
        }
    });
}