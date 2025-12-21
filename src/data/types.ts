export interface DisposableService {
  domain: string;
  name: string;
  status: "active" | "inactive" | "unknown";
  website?: string;
  pricing: "free" | "paid" | "freemium" | "unknown";
  retention?: string;
  features: {
    api: boolean;
    customInbox: boolean;
    attachments: boolean;
    replyable: boolean;
  };
  domainCount: number;
  altDomains: string[];
  dateAdded: string;
  lastVerified?: string;
  description?: string;
}

export function createBasicService(domain: string): DisposableService {
  // Extract a name from the domain
  const name = domain
    .replace(/\.(com|net|org|io|email|mail|me|cc|co|de|ru|tk|ml|ga|cf|gq)$/i, "")
    .split(".")
    .pop() || domain;
  
  // Capitalize first letter
  const displayName = name.charAt(0).toUpperCase() + name.slice(1);
  
  return {
    domain,
    name: displayName,
    status: "unknown",
    pricing: "unknown",
    features: {
      api: false,
      customInbox: false,
      attachments: false,
      replyable: false,
    },
    domainCount: 1,
    altDomains: [],
    dateAdded: "2024-01-01",
  };
}
