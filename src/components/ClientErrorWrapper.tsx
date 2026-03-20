'use client'

import { ReactNode, useEffect } from 'react'

interface ClientErrorWrapperProps {
  children: ReactNode
}

export function ClientErrorWrapper({ children }: ClientErrorWrapperProps) {
  useEffect(() => {
    // Override Node.prototype.removeChild to catch DOM manipulation errors
    const originalRemoveChild = Node.prototype.removeChild
    const originalAppendChild = Node.prototype.appendChild
    const originalInsertBefore = Node.prototype.insertBefore

    Node.prototype.removeChild = function<T extends Node>(this: Node, child: T): T {
      try {
        // Check if the child is actually a child of this node
        if (!this.contains(child)) {
          console.warn('DOM manipulation warning: Attempted to remove a node that is not a child of this node')
          return child
        }
        return originalRemoveChild.call(this, child)
      } catch (error: any) {
        if (error.name === 'NotFoundError' && error.message.includes('removeChild')) {
          console.warn('DOM manipulation error suppressed:', error.message)
          return child
        }
        throw error
      }
    }

    Node.prototype.appendChild = function<T extends Node>(this: Node, child: T): T {
      try {
        return originalAppendChild.call(this, child)
      } catch (error: any) {
        if (error.message.includes('insertBefore') || error.message.includes('appendChild')) {
          console.warn('DOM manipulation error suppressed:', error.message)
          return child
        }
        throw error
      }
    }

    Node.prototype.insertBefore = function<T extends Node>(this: Node, newNode: T, referenceNode: Node | null): T {
      try {
        return originalInsertBefore.call(this, newNode, referenceNode)
      } catch (error: any) {
        if (error.message.includes('insertBefore')) {
          console.warn('DOM manipulation error suppressed:', error.message)
          return newNode
        }
        throw error
      }
    }

    // Cleanup on unmount
    return () => {
      Node.prototype.removeChild = originalRemoveChild
      Node.prototype.appendChild = originalAppendChild
      Node.prototype.insertBefore = originalInsertBefore
    }
  }, [])

  return <>{children}</>
}