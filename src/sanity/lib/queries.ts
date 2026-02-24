// Tagged template literal for GROQ queries (identity function, no runtime dependency needed)
const groq = (strings: TemplateStringsArray, ...values: unknown[]): string =>
  String.raw({ raw: strings }, ...values);

// Get all blog posts (with pagination support)
// Only shows posts with publishedAt set (drafts have no publishedAt)
export const blogPostsQuery = groq`
  *[_type == "blogPost" && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featuredImage {
      asset->,
      alt
    },
    author->{
      name,
      slug,
      role,
      image {
        asset->,
        alt
      }
    },
    categories[]->{
      name,
      slug
    }
  }
`;

// Get single blog post by slug
export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featuredImage {
      asset->,
      alt
    },
    author->{
      name,
      slug,
      role,
      image {
        asset->,
        alt
      },
      bio
    },
    categories[]->{
      name,
      slug
    },
    body,
    seo,
    relatedCaseStudies[]->{
      title,
      "slug": slug.current,
      tag,
      description,
      metrics
    }
  }
`;

// Get all blog post slugs (for static generation)
// Only published posts get static pages
export const blogPostSlugsQuery = groq`
  *[_type == "blogPost" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()][].slug.current
`;

// Get total count of published blog posts
export const blogPostsCountQuery = groq`
  count(*[_type == "blogPost" && defined(publishedAt) && publishedAt <= now()])
`;

// Get recent blog posts (for sidebar or related posts)
export const recentBlogPostsQuery = groq`
  *[_type == "blogPost" && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) [0...5] {
    _id,
    title,
    slug,
    publishedAt,
    featuredImage {
      asset->,
      alt
    }
  }
`;

// Get featured case studies for homepage (ordered by priority)
export const featuredCaseStudiesQuery = groq`
  *[_type == "caseStudy" && featured == true] | order(priority asc) [0...3] {
    title,
    "slug": slug.current,
    tag,
    description,
    metrics,
    featured,
    priority
  }
`;

// Get all case studies (ordered by priority)
export const caseStudiesQuery = groq`
  *[_type == "caseStudy"] | order(priority asc) {
    title,
    "slug": slug.current,
    tag,
    description,
    metrics,
    featured,
    category,
    priority,
    annualSavings,
    publishedAt
  }
`;

// Get single case study by slug
export const caseStudyBySlugQuery = groq`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    tag,
    description,
    metrics,
    featured,
    category,
    priority,
    annualSavings,
    publishedAt,
    content,
    "seo": seo,
    clientName,
    industry,
    timeframe,
    faqSchema,
    tldr,
    keyTakeaways,
    problemStatement,
    solutionApproach,
    resultsOutcome,
    servicesUsed,
    relatedCases[]->{
      title,
      "slug": slug.current,
      tag,
      description,
      metrics
    },
    relatedBlogPosts[]->{
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      featuredImage {
        asset->,
        alt
      },
      categories[]->{
        name,
        slug
      }
    }
  }
`;

// Get related case studies by category (fallback when relatedCases is empty)
export const relatedCaseStudiesQuery = groq`
  *[_type == "caseStudy" && slug.current != $slug && category == $category] | order(priority asc) [0...3] {
    title,
    "slug": slug.current,
    tag,
    description,
    metrics
  }
`;

// Get a related case study for a blog post (match by mapped category names)
// Pass $categoryNames (array of case study category display names mapped from blog slugs)
export const relatedCaseStudyForBlogQuery = groq`
  *[_type == "caseStudy" && category in $categoryNames] | order(featured desc, priority asc) [0] {
    title,
    "slug": slug.current,
    tag,
    description,
    metrics
  }
`;

// Fallback: get most recent featured case study (when no category match)
export const featuredCaseStudyFallbackQuery = groq`
  *[_type == "caseStudy" && featured == true] | order(priority asc) [0] {
    title,
    "slug": slug.current,
    tag,
    description,
    metrics
  }
`;

// Get related blog posts for a case study page (match by category keywords)
// Pass $categoryKeywords as an array of lowercase keyword strings derived from the case study category
export const relatedBlogPostsForCaseStudyQuery = groq`
  *[_type == "blogPost" && defined(publishedAt) && publishedAt <= now() && count((categories[]->slug.current)[@ in $categoryKeywords]) > 0] | order(publishedAt desc) [0...2] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featuredImage {
      asset->,
      alt
    },
    categories[]->{
      name,
      slug
    }
  }
`;

// Get related blog posts by category (for sidebar, excluding current post)
export const relatedBlogPostsByCategoryQuery = groq`
  *[_type == "blogPost" && defined(publishedAt) && publishedAt <= now() && _id != $currentId && count((categories[]->slug.current)[@ in $categorySlugs]) > 0] | order(publishedAt desc) [0...5] {
    _id,
    title,
    slug,
    publishedAt,
    featuredImage {
      asset->,
      alt
    }
  }
`;

// Get all case study slugs (for sitemap/static generation)
export const caseStudySlugsQuery = groq`
  *[_type == "caseStudy" && defined(slug.current)][].slug.current
`;

// ===== V2 QUERIES =====

// Get all V2 blog posts (with pagination support)
export const blogPostsV2Query = groq`
  *[_type == "blogPostV2" && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) [$start...$end] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    pullQuote,
    readingTime,
    publishedAt,
    featuredImage {
      asset->,
      alt
    },
    author->{
      name,
      slug,
      role,
      image {
        asset->,
        alt
      }
    },
    categories[]->{
      name,
      slug
    }
  }
`;

// Get single V2 blog post by slug
export const blogPostBySlugV2Query = groq`
  *[_type == "blogPostV2" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    pullQuote,
    readingTime,
    publishedAt,
    featuredImage {
      asset->,
      alt
    },
    author->{
      name,
      slug,
      role,
      image {
        asset->,
        alt
      },
      bio
    },
    categories[]->{
      name,
      slug
    },
    body,
    seo,
    relatedCaseStudies[]->{
      title,
      "slug": slug.current,
      tag,
      description,
      metrics
    },
    relatedPosts[]->{
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      readingTime,
      featuredImage {
        asset->,
        alt
      },
      categories[]->{
        name,
        slug
      }
    }
  }
`;

// Get total count of published V2 blog posts
export const blogPostsCountV2Query = groq`
  count(*[_type == "blogPostV2" && defined(publishedAt) && publishedAt <= now()])
`;

// Get all V2 blog posts combined with V1 (union query for blog index)
export const blogPostsUnionQuery = groq`
  *[_type in ["blogPost", "blogPostV2"] && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) [$start...$end] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    readingTime,
    publishedAt,
    featuredImage {
      asset->,
      alt
    },
    author->{
      name,
      slug,
      role,
      image {
        asset->,
        alt
      }
    },
    categories[]->{
      name,
      slug
    }
  }
`;

// Count all published blog posts (V1 + V2)
export const blogPostsCountUnionQuery = groq`
  count(*[_type in ["blogPost", "blogPostV2"] && defined(publishedAt) && publishedAt <= now()])
`;

// Get all V2 case studies (ordered by priority)
export const caseStudiesV2Query = groq`
  *[_type == "caseStudyV2"] | order(priority asc) {
    title,
    "slug": slug.current,
    tag,
    description,
    metrics,
    featured,
    category,
    priority,
    annualSavings,
    publishedAt,
    featuredImage {
      asset->,
      alt
    }
  }
`;

// Get single V2 case study by slug
export const caseStudyBySlugV2Query = groq`
  *[_type == "caseStudyV2" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    tag,
    description,
    metrics,
    featured,
    category,
    priority,
    annualSavings,
    publishedAt,
    content,
    "seo": seo,
    clientName,
    industry,
    timeframe,
    faqSchema,
    tldr,
    pullQuote,
    keyTakeaways,
    problemStatement,
    solutionApproach,
    resultsOutcome,
    servicesUsed,
    featuredImage {
      asset->,
      alt
    },
    beforeAfter {
      before,
      after
    },
    relatedCases[]->{
      title,
      "slug": slug.current,
      tag,
      description,
      metrics
    },
    relatedBlogPosts[]->{
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      featuredImage {
        asset->,
        alt
      },
      categories[]->{
        name,
        slug
      }
    }
  }
`;

// Get featured V2 case studies for homepage
export const featuredCaseStudiesV2Query = groq`
  *[_type == "caseStudyV2" && featured == true] | order(priority asc) [0...3] {
    title,
    "slug": slug.current,
    tag,
    description,
    metrics,
    featured,
    priority,
    featuredImage {
      asset->,
      alt
    }
  }
`;
