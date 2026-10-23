export const DOCUMENT_STATUSES = ["issued", "cancelled"] as const;

export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export type DocumentType = {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
  description?: string | null;
  created_at: string;
  updated_at: string;
};

export type DocumentRecord = {
  id: string;
  reference_number: string;
  title: string | null;
  document_type_id: string;
  sequence_number: number;
  issue_year: number;
  status: DocumentStatus;
  description: string | null;
  version?: string;
  owner?: string | null;
  issue_date?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  document_types?: Pick<DocumentType, "name" | "code"> | null;
};
