"use client";

import { Grid } from '@/once-ui/components';
import Post from './Post';
import { BlogPost } from '@/app/utils/blog';

interface BlogPostsGridProps {
  posts: BlogPost[];
  columns?: '1' | '2' | '3';
  thumbnail?: boolean;
  direction?: 'row' | 'column';
}

export function BlogPostsGrid({
  posts,
  columns = '1',
  thumbnail = false,
  direction
}: BlogPostsGridProps) {
  if (!posts || posts.length === 0) {
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
      {posts.map((post) => (
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