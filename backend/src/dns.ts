import * as dns from 'node:dns';

export function configureDnsServers(
  servers: string[] = ['1.1.1.1', '8.8.8.8'],
) {
  dns.setServers(servers);
}
