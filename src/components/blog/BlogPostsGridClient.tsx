"use client";

import { Grid } from '@/once-ui/components';
import Post from './Post';
import { BlogPost } from '@/app/utils/blog';
import { useBlogPosts } from '@/hooks/useBlogPosts';

interface BlogPostsGridClientProps {
  initialPosts: BlogPost[];
  range?: [number, number?];
  columns?: '1' | '2' | '3';
  thumbnail?: boolean;
  direction?: 'row' | 'column';
}

export function BlogPostsGridClient({
  initialPosts,
  range,
  columns = '1',
  thumbnail = false,
  direction
}: BlogPostsGridClientProps) {
  const { posts } = useBlogPosts(initialPosts);

  const displayedPosts = range 
    ? posts.slice(range[0] - 1, range[1] ?? posts.length)
    : posts;

  if (!displayedPosts || displayedPosts.length === 0) {
    return null;
  }

  return (
    <Grid
      columns={columns} 
      mobileColumns="1"
      fillWidth 
      marginBottom="40" 
      gap="12"
    >
      {displayedPosts.map((post) => (
        <Post
          key={post.slug}
          post={post}
          thumbnail={thumbnail}
          direction={direction}
        />
      ))}
    </Grid>
  );
} 