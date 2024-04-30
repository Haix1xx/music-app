import React, { useEffect, useState } from 'react'
import useResponsive from '@/hooks/useResponsive'
import InfiniteScroll from 'react-infinite-scroll-component'
import Stack from '@mui/material/Stack'
import { Post } from '@/types/post'
import PostCard from './PostCard'
import { Modal, Box } from '@mui/material'

interface SharePostListProps {
  open: boolean
  handleClose: () => void
  propFetchMoreData: (currentPage?: number) => Promise<Post[]>
}

const SharePostList: React.FC<SharePostListProps> = ({ open, handleClose, propFetchMoreData }) => {
  const isMobile = useResponsive('down', 'sm')
  const [data, setData] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(2)
  const [loading, setLoading] = useState(true)

  const fetchMoreData = async () => {
    setLoading(true)
    const newData = await propFetchMoreData(currentPage)
    setData((prev) => [...prev, ...newData])
    setCurrentPage((prev) => prev + 1)
    setLoading(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      const newData = await propFetchMoreData()
      setData(newData)
    }

    fetchData()
  }, [open])

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '80%' : '40%',
          height: isMobile ? '80%' : '83%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          padding: isMobile ? 3 : '20px',
          paddingTop: '30px',
          overflow: 'auto'
        }}
        id='sharepostlist'
      >
        <InfiniteScroll
          dataLength={data?.length || 5}
          next={fetchMoreData}
          hasMore={!loading}
          loader={<div key='loader'>loading</div>}
          scrollableTarget='sharepostlist'
        >
          {data?.map((item, index) => <PostCard key={index} post={item} />)}
        </InfiniteScroll>
      </Box>
    </Modal>
  )
}

export default SharePostList
