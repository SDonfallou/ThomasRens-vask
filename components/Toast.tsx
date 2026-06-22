"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

type Toast = { id: string; message: string; type?: 'info' | 'success' | 'error' }

const ToastContext = createContext<{ show: (m: string, t?: Toast['type']) => void } | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = String(Date.now())
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed right-4 bottom-4 flex flex-col gap-2 items-end z-50">
        {toasts.map(t => (
          <div key={t.id} role="status" aria-live="polite" className={`max-w-sm w-full px-4 py-2 rounded shadow ${t.type === 'error' ? 'bg-red-600 text-white' : t.type === 'success' ? 'bg-green-600 text-white' : 'bg-gray-800 text-white'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default ToastProvider
