// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useState, useEffect } from 'react';
import CardBox from '../../components/shared/CardBox';
import { Modal, Button, TextInput, Label, Select } from 'flowbite-react';
import { TbEdit, TbTrash, TbEyeOff } from 'react-icons/tb';
import {
  fetchTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../../utils/api/teamService';

type TeamMember = {
  id: number;
  full_name: string;
  position: string;
  type: string;
  socials?: string;
  bio?: string;
  image_url?: string;
};

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await fetchTeamMembers();
      setTeamMembers(data);
    } catch (err) {
      console.error('Error fetching team:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      setLoadingBtn(true);
      const newMember = await createTeamMember(formData);
      setTeamMembers((prev) => [...prev, newMember]);
      setShowAddModal(false);
    } catch (err) {
      setLoadingBtn(false);
      console.error('Error adding member:', err);
    } finally {
      setLoadingBtn(false); // stop loading
    }
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      setLoadingBtn(true);
      const updated = await updateTeamMember(selectedMember.id, formData);
      setTeamMembers((prev) => prev.map((m) => (m.id === selectedMember.id ? updated : m)));
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating member:', err);
    } finally {
      setLoadingBtn(false); // stop loading
    }
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    try {
      setLoadingBtn(true);
      await deleteTeamMember(selectedMember.id);
      setTeamMembers((prev) => prev.filter((m) => m.id !== selectedMember.id));
      setShowDeleteModal(false);
    } catch (err) {
      setLoadingBtn(false);
      console.error('Error deleting member:', err);
    } finally {
      setLoadingBtn(false); // stop loading
    }
  };

  const openEditModal = (member: TeamMember) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const openDeleteModal = (member: TeamMember) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };

  if (loading) return <p>Loading team members...</p>;

  return (
    <CardBox>
      <div className="flex justify-between items-center mb-6">
        <h5 className="card-title">Team Members</h5>
        <Button onClick={() => setShowAddModal(true)}>Add New Member</Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="rounded-xl dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-4 relative"
          >
            <img
              src={member.image_url}
              alt={member.full_name}
              className="rounded-md mb-4 w-full h-48 object-cover"
            />
            <h5 className="text-lg font-semibold">{member.full_name}</h5>
            <p className="text-sm text-gray-600 dark:text-gray-300">{member.position}</p>
            {member.bio && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-3">
                {member.bio}
              </p>
            )}
            <div className="flex justify-between items-center mt-4">
              {member.socials && (
                <a
                  href={member.socials}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Profile
                </a>
              )}
              <div className="flex gap-2">
                <TbEdit
                  className="text-blue-600 cursor-pointer"
                  size={20}
                  onClick={() => openEditModal(member)}
                />
                <TbTrash
                  className="text-red-600 cursor-pointer"
                  size={20}
                  onClick={() => openDeleteModal(member)}
                />
                <TbEyeOff className="text-gray-600 cursor-pointer" size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Member Modal */}
      <Modal show={showAddModal} size="4xl" onClose={() => setShowAddModal(false)}>
        <Modal.Header>Add New Team Member</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddMember}>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
                <div>
                  <Label htmlFor="full_name" value="Full Name" className="mb-1" />
                  <TextInput
                    id="full_name"
                    name="full_name"
                    placeholder="Enter full name"
                    className="rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-darkgray dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="position" value="Position" className="mb-1" />
                  <TextInput
                    id="position"
                    name="position"
                    placeholder="Enter position"
                    className="rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-darkgray dark:text-gray-100"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type" value="Type" className="mb-1" />
                  <Select
                    id="type"
                    name="type"
                    required
                    className="rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-darkgray dark:text-gray-100"
                  >
                    <option>Volunteer</option>
                    <option>Team Member</option>
                    <option>Board Member</option>
                  </Select>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
                <div>
                  <Label htmlFor="socials" value="Social/Profile Link" className="mb-1" />
                  <TextInput
                    id="socials"
                    name="socials"
                    placeholder="https://linkedin.com/in/username"
                    className="rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-darkgray dark:text-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="image_file" value="Profile Image" className="mb-1" />
                  <input
                    type="file"
                    id="image_file"
                    name="image"
                    accept="image/*"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 dark:bg-darkgray dark:text-gray-100 focus:outline-none p-2"
                  />
                </div>

                <div>
                  <Label htmlFor="bio" value="Bio" className="mb-1" />
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Enter biography"
                    className="block w-full rounded-md border border-gray-300 text-gray-900 dark:text-gray-100 dark:bg-darkgray focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2"
                    rows={4}
                  />
                </div>
              </div>

              <div className="col-span-12 flex gap-3 mt-4">
                <Button
                  isProcessing={loadingBtn}
                  type="submit"
                  color="primary"
                  className="px-6 py-2 rounded-md"
                >
                  Add Team Member
                </Button>
                <Button
                  color="failure"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 rounded-md"
                >
                  Close Form
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Edit Team Member Modal */}
      <Modal show={showEditModal} size="4xl" onClose={() => setShowEditModal(false)}>
        <Modal.Header>Edit Team Member</Modal.Header>
        <Modal.Body>
          {selectedMember && (
            <form onSubmit={handleUpdateMember}>
              <div className="grid grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <div>
                    <Label htmlFor="full_name" value="Full Name" />
                    <TextInput
                      id="full_name"
                      name='full_name'
                      placeholder="Enter full name"
                      defaultValue={selectedMember.full_name}
                      className="rounded-md w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position" value="Position" />
                    <TextInput
                      id="position"
                      name='position'
                      placeholder="Enter position"
                      defaultValue={selectedMember.position}
                      className="rounded-md w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type" value="Type" />
                    <Select
                      id="type"
                      name='type'
                      defaultValue={selectedMember.type}
                      className="rounded-md w-full"
                    >
                      <option>Volunteer</option>
                      <option>Team Member</option>
                      <option>Board Member</option>
                    </Select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
                  <div>
                    <Label htmlFor="socials" value="Social/Profile Link" />
                    <TextInput
                      id="socials"
                      placeholder="https://linkedin.com/in/username"
                      defaultValue={selectedMember.socials}
                      className="rounded-md w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio" value="Bio" />
                    <textarea
                      id="bio"
                      name='bio'
                      placeholder="Enter biography"
                      defaultValue={selectedMember.bio}
                      className="block w-full rounded-md p-2 border border-gray-300"
                      rows={4}
                    />
                  </div>

                  {/* Profile Image Upload */}
                  <div>
                    <Label htmlFor="profile_image" value="Profile Image" />
                    <input
                      type="file"
                      id="profile_image"
                      name='image'
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 
              file:mr-4 file:py-2 file:px-4 
              file:rounded-full file:border-0 
              file:text-sm file:font-semibold 
              file:bg-blue-50 file:text-blue-700 
              hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="col-span-12 flex gap-3 mt-4">
                  <Button type="submit" color="primary" isProcessing={loadingBtn}>
                    Update Member Info.
                  </Button>

                  <Button
                    type="submit"
                    color="failure"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 rounded-md"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} size="md" onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          {selectedMember && (
            <div>
              <p className="mb-4">
                Are you sure you want to delete <strong>{selectedMember.full_name}</strong>?
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  isProcessing={loadingBtn}
                  type="submit"
                  color="failure"
                  onClick={handleDeleteMember}
                >
                  Yes, Delete
                </Button>
                <Button color="secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </CardBox>
  );
};

export default Team;
