'use client'

import { useState } from 'react'

interface SearchComponentProps {
  data: string[]
  onResults: (results: string[]) => void
}

export default function SearchComponent({ data, onResults }: SearchComponentProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      onResults([])
      return
    }

    setIsSearching(true)
    
    try {
      // Fuseライブラリを動的にインポート（ユーザーが検索時のみ）
      const Fuse = (await import('fuse.js')).default
      const fuse = new Fuse(data, {
        threshold: 0.3,
        keys: ['title', 'description']
      })
      
      const results = fuse.search(value)
      onResults(results)
    } catch (error) {
      console.error('Search error:', error)
      onResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          handleSearch(e.target.value)
        }}
        placeholder="検索..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {isSearching && (
        <div className="absolute right-3 top-2.5">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  )
}