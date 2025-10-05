// src/app/blog/edit/[id]/page.tsx
import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { isUploader } from '@/lib/roles';
import EditPostForm from '@/components/edit-post/EditPostForm';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const resolvedParams = await params;
  const postId = resolvedParams.id;

  // Session validation
  if (!session || !isUploader(session.role)) {
    redirect('/blog?unauthorized=1');
  }

  // Fetch the post
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      reviewedBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Check if user owns this post
  if (post.authorId !== session.id) {
    redirect('/dashboard?error=not-your-post');
  }

  // Check if post can be edited (should be DRAFT with review comments)
  if (post.status !== 'DRAFT' || !post.reviewComments) {
    redirect('/dashboard?error=cannot-edit');
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#ffffff]">
            Edit Post
          </h1>
          <p className="mt-2 text-[#fffff2]">
            Update your post based on reviewer feedback
          </p>
        </div>

        {/* Reviewer Feedback */}
        {post.reviewComments && (
          <div className="mb-8 p-6 bg-orange-900/20 border border-orange-500/30 rounded-lg">
            <h2 className="text-lg font-semibold text-orange-400 mb-3">
              Reviewer Feedback
            </h2>
            <div className="bg-orange-900/10 rounded-lg p-4">
              <p className="text-orange-200 leading-relaxed whitespace-pre-wrap">
                {post.reviewComments}
              </p>
            </div>
            {post.reviewedBy && (
              <p className="text-orange-300 text-sm mt-3">
                Reviewed by: {post.reviewedBy.name || post.reviewedBy.email}
              </p>
            )}
            {post.reviewedAt && (
              <p className="text-orange-300 text-sm">
                Reviewed on: {new Date(post.reviewedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Edit Form */}
        <EditPostForm post={post} />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Edit Post',
  description: 'Edit your post based on reviewer feedback',
};