import { useState, useEffect } from "react";
import { Badge, Dropdown, Button, Modal, Table } from "flowbite-react";
import { Icon } from "@iconify/react";

import { API_BASE_URL } from '../../../config';
const BASE_URL = API_BASE_URL;

interface PendingUser {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar_url: string;
  created_at: string;
}

const PendingRequests = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const tokenData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;

  const fetchPendingUsers = async () => {
    if (!tokenData) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/pending-users`, {
        headers: {
          "Authorization": `Bearer ${tokenData.token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPendingUsers(data.users);
      } else {
        setPendingUsers([]);
      }
    } catch (err) {
      console.error(err);
      setPendingUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: number) => {
    const user = pendingUsers.find(u => u.id === userId);
    if (!user) return;
    if (!window.confirm(`Are you sure you want to approve ${user.name} (${user.email}) as a ${user.role}?`)) return;

    try {
      const res = await fetch(`${BASE_URL}/api/auth/approve-user/${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${tokenData.token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
        alert(`${user.name} approved successfully`);
      }
    } catch (err) {
      console.error(err);
      alert("Error approving user");
    }
  };

  const handleReject = async (userId: number) => {
    const user = pendingUsers.find(u => u.id === userId);
    if (!user) return;
    if (!window.confirm(`Are you sure you want to reject ${user.name} (${user.email})'s registration request? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`${BASE_URL}/api/auth/reject-user/${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${tokenData.token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
        alert(`${user.name} rejected successfully`);
      }
    } catch (err) {
      console.error(err);
      alert("Error rejecting user");
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return (
    <>
      <Dropdown
        label=""
        className="rounded-sm w-[300px]"
        dismissOnClick={false}
        renderTrigger={() => (
          <span
            className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer relative"
            onClick={() => { fetchPendingUsers(); setShowModal(true); }}
          >
            <Icon icon="solar:user-plus-linear" height={20} />
            {pendingUsers.length > 0 && (
              <Badge className="absolute top-1 right-1 min-w-[8px] h-[14px] bg-red-500 text-white text-xs font-bold flex items-center justify-center px-1 rounded-full">
                {pendingUsers.length > 99 ? "99+" : pendingUsers.length}
              </Badge>
            )}
          </span>
        )}
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Pending Requests</h3>
            <Button size="xs" color="primary" onClick={fetchPendingUsers}>
              Refresh
            </Button>
          </div>
          {loading ? (
            <div className="text-center py-4">
              <Icon icon="eos-icons:loading" className="inline-block" />
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          ) : pendingUsers.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No pending user requests
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {pendingUsers.map(user => (
                <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <Badge color="warning" className="text-xs">{user.role}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="xs" color="success" onClick={() => handleApprove(user.id)}>Approve</Button>
                    <Button size="xs" color="failure" onClick={() => handleReject(user.id)}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Dropdown>

      {/* Modal Big Box */}
      {showModal && (
        <Modal show={showModal} onClose={() => setShowModal(false)} size="4xl">
          <Modal.Header>Pending Registration Requests</Modal.Header>
          <Modal.Body>
            {loading ? (
              <div className="text-center py-8">
                <Icon icon="eos-icons:loading" className="inline-block text-2xl" />
                <p className="text-gray-500 mt-2">Loading requests...</p>
              </div>
            ) : pendingUsers.length === 0 ? (
              <div className="text-center py-8">
                <Icon icon="solar:check-circle-linear" className="inline-block text-4xl text-green-500" />
                <p className="text-gray-500 mt-2">No pending requests</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <Table.Head>
                    <Table.HeadCell>User</Table.HeadCell>
                    <Table.HeadCell>Email</Table.HeadCell>
                    <Table.HeadCell>Role</Table.HeadCell>
                    <Table.HeadCell>Request Date</Table.HeadCell>
                    <Table.HeadCell>Actions</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {pendingUsers.map(user => (
                      <Table.Row key={user.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell>
                          <div className="flex items-center gap-3">
                            <img src={user.avatar_url} alt={user.name} className="w-10 h-10 rounded-full" />
                            <p className="font-medium">{user.name}</p>
                          </div>
                        </Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell><Badge color="warning">{user.role}</Badge></Table.Cell>
                        <Table.Cell>{new Date(user.created_at).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>
                          <div className="flex gap-2">
                            <Button size="xs" color="success" onClick={() => handleApprove(user.id)}>Approve</Button>
                            <Button size="xs" color="failure" onClick={() => handleReject(user.id)}>Reject</Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            )}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default PendingRequests;
