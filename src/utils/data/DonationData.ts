  // Sample donations data
  const donations = [
    {
      id: 1,
      name: "John Banda",
      email: "johnbanda@example.com",
      amount: 250,
      message: "Happy to support your cause!",
      created_at: "2025-08-12T10:15:00.000Z",
      method: "Debit Card"
    },
    {
      id: 2,
      name: "Bupe Katongo",
      email: "katongobupe444@gmail.com",
      amount: 500,
      message: "Keep up the great work.",
      created_at: "2025-08-10T14:35:00.000Z",
      method: "VISA Card"
    },
    {
      id: 3,
      name: "Grace Mwansa",
      email: "gracemwansa@example.com",
      amount: 120,
      message: "Small contribution but from the heart.",
      created_at: "2025-08-08T09:00:00.000Z",
      method: "Mobile Money"
    },
    {
      id: 4,
      name: "John Banda",
      email: "johnbanda@example.com",
      amount: 100,
      message: "So happy to donate again",
      created_at: "2025-09-05T15:15:00.000Z",
      method: "Debit Card"
    },
  ];

  const DonationActivity = [
   
    {
      Time: "09:58",
      action: "K1,500.00,  Green Earth Foundation",
      color: "bg-green-500",
      line: "h-full w-px bg-border",
    },
    {
      Time: "09:40",
      action: "K500.00, Mary Banda",
      color: "bg-blue-500",
      line: "h-full w-px bg-border",
    },
    {
      Time: "09:22",
      action: "K5,000.00, Zambezi Bank",
      color: "bg-yellow-500",
      line: "h-full w-px bg-border",
    },
    {
      Time: "09:05",
      action: "K200.00, anonymous donor",
      color: "bg-gray-400",
      line: "h-full w-px bg-border",
    },
    
  ];

export { donations, DonationActivity };