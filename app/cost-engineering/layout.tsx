// Layout wrapper for cost-engineering route
// Metadata is managed in metadata.ts file
import { metadata as pageMetadata } from './metadata'

export const metadata = pageMetadata

export default function CostEngineeringLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
