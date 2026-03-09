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
    seo {
      metaTitle,
      metaDescription,
      keywords,
      socialImage {
        asset->
      }
    },
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
    featuredImage {
      asset->,
      alt
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

// Get related case studies by category (fallback when relatedCases is empty)
export const relatedCaseStudiesQuery = groq`
  *[_type == "caseStudyV2" && slug.current != $slug && category == $category] | order(priority asc) [0...3] {
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
  *[_type == "caseStudyV2" && category in $categoryNames] | order(featured desc, priority asc) [0] {
    title,
    "slug": slug.current,
    tag,
    description,
    metrics
  }
`;

// Fallback: get most recent featured case study (when no category match)
export const featuredCaseStudyFallbackQuery = groq`
  *[_type == "caseStudyV2" && featured == true] | order(priority asc) [0] {
    title,
    "slug": slug.current,
    tag,
    description,
    metrics
  }
`;

// Get related V2 blog posts for a case study page (match by category keywords)
// Pass $categoryKeywords as an array of lowercase keyword strings derived from the case study category
export const relatedBlogPostsForCaseStudyQuery = groq`
  *[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && count((categories[]->slug.current)[@ in $categoryKeywords]) > 0] | order(publishedAt desc) [0...2] {
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

// Get related V2 blog posts by category (for sidebar, excluding current post)
export const relatedBlogPostsByCategoryQuery = groq`
  *[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && _id != $currentId && count((categories[]->slug.current)[@ in $categorySlugs]) > 0] | order(publishedAt desc) [0...5] {
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
    updatedAt,
    status,
    showTableOfContents,
    featured,
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
    seo {
      metaTitle,
      metaDescription,
      keywords,
      socialImage {
        asset->
      }
    },
    faqSchema,
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

// Get all published V2 blog posts (primary listing query)
export const blogPostsUnionQuery = groq`
  *[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now()] | order(featured desc, publishedAt desc) [$start...$end] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    readingTime,
    publishedAt,
    featured,
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

// Count all published V2 blog posts
export const blogPostsCountUnionQuery = groq`
  count(*[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now()])
`;

// Get all categories that have at least one published V2 blog post
export const blogCategoriesQuery = groq`
  *[_type == "category" && count(*[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && references(^._id)]) > 0] | order(name asc) {
    _id,
    name,
    slug
  }
`;

// Get V2 blog posts filtered by category slug (with pagination)
export const blogPostsByCategoryQuery = groq`
  *[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && $categorySlug in categories[]->slug.current] | order(featured desc, publishedAt desc) [$start...$end] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    readingTime,
    publishedAt,
    featured,
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

// Count V2 blog posts filtered by category slug
export const blogPostsCountByCategoryQuery = groq`
  count(*[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && $categorySlug in categories[]->slug.current])
`;

// Search V2 blog posts by title or excerpt (with pagination)
export const blogPostsSearchQuery = groq`
  *[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && (title match $searchQuery || excerpt match $searchQuery)] | order(featured desc, publishedAt desc) [$start...$end] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    readingTime,
    publishedAt,
    featured,
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

// Count V2 search results
export const blogPostsSearchCountQuery = groq`
  count(*[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && (title match $searchQuery || excerpt match $searchQuery)])
`;

// Search V2 blog posts filtered by category (with pagination)
export const blogPostsSearchByCategoryQuery = groq`
  *[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && $categorySlug in categories[]->slug.current && (title match $searchQuery || excerpt match $searchQuery)] | order(featured desc, publishedAt desc) [$start...$end] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    readingTime,
    publishedAt,
    featured,
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

// Count V2 search results filtered by category
export const blogPostsSearchByCategoryCountQuery = groq`
  count(*[_type == "blogPostV2" && status == "published" && defined(publishedAt) && publishedAt <= now() && $categorySlug in categories[]->slug.current && (title match $searchQuery || excerpt match $searchQuery)])
`;

// Get all V2 case studies (ordered by priority)
export const caseStudiesV2Query = groq`
  *[_type == "caseStudyV2" && status == "published"] | order(priority asc) {
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
    seo {
      metaTitle,
      metaDescription,
      keywords,
      socialImage {
        asset->
      }
    },
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
