export interface Project {
  id: number;
  name: string;
  description: string;
  category?: string | null;
  donation_goal?: number | null;
  donation_raised?: number | null;
  cover_image?: string | null;   // URL returned by the server
  media?: string[];              // array of media URLs returned by the server
  pdf_document?: string | null;  // ✅ URL to the uploaded PDF
  created_at: string;            // ISO timestamp from server
  updated_at: string | null;     // ISO timestamp or null
  is_hidden?: boolean;           // optional, if backend supports hiding
  // add other server fields here if present (slug, owner_id, etc.)
}
