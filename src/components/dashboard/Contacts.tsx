import { Badge, Table, Spinner } from "flowbite-react";
import SimpleBar from "simplebar-react";
import { useEffect, useState } from "react";
import { fetchContacts, Contact } from "../../utils/api/contactsService";

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const data = await fetchContacts();
        setContacts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    getContacts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[450px]">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[450px] text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="card-elevated pt-6 px-0 relative w-full break-words">
      <div className="card-spacing-sm">
        <h5 className="heading-5 mb-6">Contacts</h5>
      </div>
      <SimpleBar className="max-h-[450px]">
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell className="p-6">Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Message</Table.HeadCell>
              <Table.HeadCell>Date</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-border dark:divide-darkborder">
              {contacts.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell className="whitespace-nowrap ps-6">
                    <div className="flex gap-3 items-center">
                     
                      <div className="truncate max-w-56">
                        <h6 className="text-label">{item.name}</h6>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <p className="text-body">{item.email}</p>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge className="bg-lightsecondary text-secondary">
                      {item.message}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-body">{new Date(item.created_at).toLocaleString()}</span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </SimpleBar>
    </div>
  );
};

export default Contacts;
