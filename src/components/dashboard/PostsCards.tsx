import { useState, useEffect } from 'react';
import { Badge } from 'flowbite-react';
import { fetchPosts } from '../../utils/api/postsService';

type Post = {
  id: number;
  title: string;
  slug: string | null;
  content: string;
  type: string;
  image_url: string;
  created_at: string;
  updated_at: string | null;
  is_hidden: boolean;
};

const PostCards = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching team:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="grid-responsive">
      {posts.map((post) => (
        <div key={post.id}>
          <div className="card-elevated overflow-hidden animate-fade-in">
            {/* Image */}
            <div className="relative">
              <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover" />
              <Badge color={'info'} className="absolute top-3 left-3 capitalize">
                {post.type}
              </Badge>
            </div>

            {/* Content */}
            <div className="card-spacing-sm">
              <h5 className="heading-6 mt-4 mb-2 line-clamp-2">{post.title}</h5>
              <p className="text-body line-clamp-3">{post.content}</p>

              {/* Footer with actions */}
              <div className="flex items-center mt-4">
                <span className="text-caption">{formatDate(post.created_at)}</span>
                <div className="flex gap-3 ms-auto text-bodytext"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostCards;
