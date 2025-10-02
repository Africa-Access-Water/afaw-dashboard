// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useState, useEffect } from 'react';
import CardBox from '../../components/shared/CardBox';
import { Modal, Button, TextInput, Label, Select } from 'flowbite-react';
import { TbEdit, TbTrash, TbEyeOff } from 'react-icons/tb';

import { fetchPosts, createPost, updatePost, deletePost } from '../../utils/api/postsService';

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

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [showHideConfirm, setShowHideConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching team:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      setLoadingBtn(true);
      const newPost = await createPost(formData);
      setPosts((prev) => [...prev, newPost]);
      setShowCreateModal(false);
    } catch (err) {
      setLoadingBtn(false);
      console.error('Error adding Post:', err);
    }finally {
      setLoadingBtn(false); // stop loading
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      setLoadingBtn(true);
      const updated = await updatePost(selectedPost.id, formData);
      setPosts((prev) => prev.map((m) => (m.id === selectedPost.id ? updated : m)));
      setShowEditModal(false);
    } catch (err) {
      setLoadingBtn(false);
      console.error('Error updating Post:', err);
    } finally {
      setLoadingBtn(false); // stop loading
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPost) return;
    try {
      setLoadingBtn(true);
      await deletePost(selectedPost.id);
      setPosts((prev) => prev.filter((m) => m.id !== selectedPost.id));
      setShowDeleteConfirm(false);
    } catch (err) {
      setLoadingBtn(false);
      console.error('Error deleting Post:', err);
    }finally {
      setLoadingBtn(false); // stop loading
    }
  };

  const handleEditClick = (post: any) => {
    setSelectedPost(post);
    setShowEditModal(true);
  };

  const handleDeleteClick = (post: any) => {
    setSelectedPost(post);
    setShowDeleteConfirm(true);
  };

  const handleHideClick = (post: any) => {
    setSelectedPost(post);
    setShowHideConfirm(true);
  };

if (loading) return <p>Loading posts...</p>;

  return (
    <CardBox>
      <div className="flex justify-between items-center mb-6">
        <h5 className="card-title">Manage Posts</h5>
        <Button onClick={() => setShowCreateModal(true)}>Create New Post</Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-4 relative"
          >
            <img
              src={post.image_url}
              alt={post.title}
              className="rounded-md mb-4 w-full h-48 object-cover"
            />
            <h5 className="text-lg font-semibold mb-2">{post.title}</h5>
            <p className="text-sm mb-2">{post.content}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-darklink">
                {new Date(post.created_at).toLocaleString()}
              </span>
              <div className="flex gap-2">
                <TbEdit
                  className="text-blue-600 cursor-pointer"
                  size={20}
                  onClick={() => handleEditClick(post)}
                />
                <TbTrash
                  className="text-red-600 cursor-pointer"
                  size={20}
                  onClick={() => handleDeleteClick(post)}
                />
                <TbEyeOff
                  className="text-gray-600 cursor-pointer"
                  size={20}
                  onClick={() => handleHideClick(post)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      <Modal show={showCreateModal} size="4xl" onClose={() => setShowCreateModal(false)}>
        <Modal.Header>Publish New Post</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddPost} className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
              <TextInput id="title" name="title" placeholder="Enter title" required />
              <Select id="type" name="type" required>
                <option value="">Post Type</option>
                <option value="Article">Article</option>
                <option value="News">News</option>
                <option value="Project">Project</option>
              </Select>
              <div>
                <Label htmlFor="image_file" value="Image File" />
                <input
                  type="file"
                  id="image_file"
                  name="image"
                  accept="image/*"
                  required
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50"
                />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
              <textarea
                id="content"
                name="content"
                placeholder="Enter post content"
                required
                className="block w-full rounded border border-gray-300 text-sm text-gray-900 bg-gray-50"
                rows={8}
              />
            </div>

            <div className="col-span-12 flex gap-3">
              <Button type="submit" color="primary" isProcessing={loadingBtn}>
                Publish Post
              </Button>
              <Button color="failure" onClick={() => setShowCreateModal(false)}>
                Close Form
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Edit Post Modal */}
      <Modal show={showEditModal} size="4xl" onClose={() => setShowEditModal(false)}>
        <Modal.Header>Update your Post</Modal.Header>
        <Modal.Body>
          {selectedPost && (
            <form onSubmit={handleUpdatePost} className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
                <TextInput
                  id="title"
                  name="title"
                  defaultValue={selectedPost.title}
                  placeholder="Enter title"
                  required
                />
                <Select id="type" name="type" defaultValue={selectedPost.type} required>
                  <option value="News">News</option>
                  <option value="Project">Project</option>
                  <option value="Article">Article</option>
                </Select>
                <div>
                  <Label htmlFor="image_file" value="Replace Image" />
                  <input
                    type="file"
                    id="image_file"
                    name="image"
                    accept="image/*"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50"
                  />
                  <small className="text-gray-500">Leave blank to keep the current image.</small>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
                <textarea
                  id="content"
                  name="content"
                  defaultValue={selectedPost.content}
                  required
                  className="block w-full rounded border border-gray-300 text-sm text-gray-900 bg-gray-50"
                  rows={8}
                />
              </div>

              <div className="col-span-12 flex gap-3">
                <Button type="submit" color="primary" isProcessing={loadingBtn}>
                  Update Post
                </Button>
                <Button color="failure" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} size="md" onClose={() => setShowDeleteConfirm(false)}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the post "{selectedPost?.title}"?</p>
          <div className="mt-4 flex gap-3">
            <Button color="failure" onClick={handleDeletePost} isProcessing={loadingBtn}>
              Yes, Delete
            </Button>
            <Button color="gray" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Hide Confirmation Modal */}
      <Modal show={showHideConfirm} size="md" onClose={() => setShowHideConfirm(false)}>
        <Modal.Header>Confirm Hide</Modal.Header>
        <Modal.Body>
          <p>Do you want to hide the post "{selectedPost?.title}" from public view?</p>
          <div className="mt-4 flex gap-3">
            <Button color="warning">Yes, Hide</Button>
            <Button color="gray" onClick={() => setShowHideConfirm(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </CardBox>
  );
};

export default Posts;
