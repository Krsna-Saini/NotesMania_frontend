'use client'
import React from 'react'
import { useGetAttachmentByUserQuery } from '@/state/Api/attachment/api'
import { useSelector } from 'react-redux'
import { themeStatetype } from '@/state/Global'
import AttachmentTable from '@/components/docs/AttachmentTable'
import FileTypeSummaryCarousel from '@/components/docs/Overview'
import { Attachment } from '@/lib/utils'
import { Skeleton } from "@/components/ui/skeleton"

const Page = () => {
  const userData = useSelector((state: { global: themeStatetype }) => state.global.user)
  const { data: Response, isLoading, refetch } = useGetAttachmentByUserQuery(userData.id)
  const data = Response?.data?.getAttachments || []

  const groupedAttachments: Record<string, Attachment[]> = {}
  data?.forEach((item) => {
    if (!groupedAttachments[item.fileType]) {
      groupedAttachments[item.fileType] = []
    }
    groupedAttachments[item.fileType].push(item)
  })

  return (
    <div className='w-screen h-full'>
      {/* Header */}
      <div className='w-full py-4 border-b border-gray-600'>
        <strong className='text-5xl px-2 md:px-6 font-sans font-bold w-full'>My Documents</strong>
      </div>

      {/* Document Overview */}
      <div className='w-full py-3 mt-13 mb-6'>
        <strong className='text-4xl px-2 md:px-6 w-full'>Overview</strong>
      </div>

      {/* Overview Carousel Skeleton or Real */}
      {isLoading? (
        <div className="px-6 flex gap-4 overflow-x-auto">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="min-w-[220px] h-[200px] rounded-xl" />
          ))}
        </div>
      ) : (
        <FileTypeSummaryCarousel groupedAttachments={groupedAttachments} />
      )}

      {/* Documents Header */}
      <div className='w-full py-3 mt-20 mb-6'>
        <strong className='text-4xl px-2 md:px-6 w-full'>Documents</strong>
      </div>

      {/* Table Skeleton or Real */}
      {isLoading ? (
        <div className="px-2 md:px-6 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : (
        <AttachmentTable refetch={refetch} all={data || []} />
      )}
    </div>
  )
}

export default Page
