import { curatedServices, curatedServicesMap } from "./services";
import { blocklist } from "./blocklist";
import { createBasicService, type DisposableService } from "./types";

// Build the complete list of services
// Curated services take priority, blocklist fills in the rest
export function getAllServices(): DisposableService[] {
  const allServices: DisposableService[] = [];
  const seenDomains = new Set<string>();

  // Add all curated services first
  for (const service of curatedServices) {
    if (!seenDomains.has(service.domain)) {
      allServices.push(service);
      seenDomains.add(service.domain);
    }
    // Also mark alt domains as seen
    for (const altDomain of service.altDomains) {
      seenDomains.add(altDomain);
    }
  }

  // Add remaining domains from blocklist
  for (const domain of blocklist) {
    if (!seenDomains.has(domain)) {
      allServices.push(createBasicService(domain));
      seenDomains.add(domain);
    }
  }

  // Sort by domain name
  allServices.sort((a, b) => a.domain.localeCompare(b.domain));

  return allServices;
}

export { curatedServices, curatedServicesMap };
export type { DisposableService };
