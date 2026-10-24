// News articles. Gatherfund LLC has not published any yet, so the list holds placeholder entries that show
// where a date, headline and summary go. Remove them to show the empty state; add real articles here.
export type Article = {
  slug: string;
  date: string;
  headline: string;
  summary: string;
  author: string;
  isTemplate: boolean;
};

const TEMPLATE: Omit<Article, 'slug'> = {
  date: '[DATE]',
  headline: '[NEWS HEADLINE]',
  summary: '[ONE-SENTENCE SUMMARY OF THE NEWS]',
  author: '[AUTHOR NAME]',
  isTemplate: true,
};

export const ARTICLES: Article[] = [
  { slug: 'template-1', ...TEMPLATE },
  { slug: 'template-2', ...TEMPLATE },
  { slug: 'template-3', ...TEMPLATE },
];

export function findArticle(slug: string): Article | undefined {
  return ARTICLES.find(article => article.slug === slug);
}
