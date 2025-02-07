import { ResearchTable } from '@/components/research-table'
import { SearchResults } from '@/components/search-results'
import React from 'react'

const SearchResultPage = () => {
  return (
    <div>
       <div className="flex-1 mx-auto w-full max-w-6xl px-4 mt-6 mb-6">
            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-220px)] rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="col-span-12 lg:col-span-4 p-4 overflow-hidden">
                <SearchResults />
              </div>  
              <div className="col-span-12 lg:col-span-8 p-4 overflow-hidden">
                <ResearchTable />
              </div>
            </div>
          </div>
    </div>
  )
}

export default SearchResultPage
