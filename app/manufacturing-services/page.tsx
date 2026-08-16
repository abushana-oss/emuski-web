import { Metadata } from 'next'
import { ManufacturingServicesClient } from './manufacturing-services-client'

export const metadata: Metadata = {
  title: 'OEM Manufacturing Services | CNC Machining, Injection Molding & Rapid Prototyping',
  description: 'End-to-end OEM manufacturing in Bangalore — CNC machining, injection molding, sheet metal, rapid prototyping. ISO 9001:2015 certified. No minimum order.',
  alternates: {
    canonical: 'https://www.emuski.com/manufacturing-services',
  },
  robots: { index: true, follow: true },
}

export default function ManufacturingServicesPage() {
  return <ManufacturingServicesClient />
}
