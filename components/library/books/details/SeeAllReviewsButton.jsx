'use client'

import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

const SeeAllReviewsButton = ({ slug, reviewCount = 0 }) => {
  if (reviewCount === 0) return null

  return (
    <Link 
      href={`/library/book/${slug}/reviews`}
      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline transition-all ml-4"
    >
      <MessageSquare size={16} />
      <span>See all {reviewCount} reviews</span>
    </Link>
  )
}

export default SeeAllReviewsButton
