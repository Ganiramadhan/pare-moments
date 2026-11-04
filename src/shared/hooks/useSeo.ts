import { useEffect } from 'react'
import { absoluteUrl, site } from '@/shared/config/site'

type Seo = {
  // The page's own name. The website name is added after it.
  title?: string
  description?: string
  // Where this page lives, e.g. "/gallery".
  path: string
  // A picture for the share preview (a path or a full address).
  image?: string
  // Keep the page out of search results.
  noindex?: boolean
}

const head = () => document.head

const metaTag = (attribute: 'name' | 'property', key: string) => {
  let tag = head().querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    head().appendChild(tag)
  }
  return tag
}

const canonicalTag = () => {
  let tag = head().querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!tag) {
    tag = document.createElement('link')
    tag.rel = 'canonical'
    head().appendChild(tag)
  }
  return tag
}

const apply = ({ title, description, path, image, noindex }: Seo) => {
  const fullTitle = title ? `${title} · ${site.name}` : site.title
  const text = description ?? site.description
  const picture = absoluteUrl(image ?? site.image)
  const url = absoluteUrl(path)

  document.title = fullTitle
  metaTag('name', 'description').content = text
  canonicalTag().href = url
  metaTag('property', 'og:title').content = fullTitle
  metaTag('property', 'og:description').content = text
  metaTag('property', 'og:url').content = url
  metaTag('property', 'og:image').content = picture
  metaTag('name', 'twitter:title').content = fullTitle
  metaTag('name', 'twitter:description').content = text
  metaTag('name', 'twitter:image').content = picture
  metaTag('name', 'robots').content = noindex
    ? 'noindex, follow'
    : 'index, follow, max-image-preview:large'
}

// Gives each page its own title, description, address and share preview. When the page goes
// away, the website's defaults come back.
export function useSeo({ title, description, path, image, noindex }: Seo) {
  useEffect(() => {
    apply({ title, description, path, image, noindex })
    return () => apply({ path: '/' })
  }, [title, description, path, image, noindex])
}
