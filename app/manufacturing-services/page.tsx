import { Metadata } from 'next'
import { ManufacturingServicesClient } from './manufacturing-services-client'

export const metadata: Metadata = {
  title: 'OEM Manufacturing Services | CNC Machining, Injection Molding & Rapid Prototyping | EMUSKI',
  description: 'End-to-end OEM manufacturing in Bangalore — CNC machining, injection molding, sheet metal, rapid prototyping, casting and more. ISO 9001:2015 certified. No minimum order. Get a quote.',
  alternates: {
    canonical: 'https://www.emuski.com/manufacturing-services',
  },
  robots: { index: true, follow: true },
}

export default function ManufacturingServicesPage() {
  return <ManufacturingServicesClient />
}
