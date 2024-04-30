import React from 'react'
import { useEffect } from 'react'
import ListFollowCard from '../ListFollowing/ListFollowCard'
import { Modal, Box } from '@mui/material'
import useResponsive from '@/hooks/useResponsive'
import InfiniteScroll from 'react-infinite-scroll-component'
import { User } from '@/types/user'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

interface UserListProps {
  open: boolean
  handleClose: () => void
  data: User[]
  propFetchMoreData: (currentPage?: number) => Promise<User[]>
}

const UserList = ({ open, handleClose, propFetchMoreData }: UserListProps) => {
  const isMobile = useResponsive('down', 'sm')
  const [dataUser, setDataUser] = React.useState<User[]>([])
  const [currentPage, setCurrentPage] = React.useState(2)
  const [loading, setLoading] = React.useState(true)
  async function fetchMoreData() {
    setLoading(true)
    const data = await propFetchMoreData(currentPage)
    setDataUser((prev) => [...prev, ...data])
    setCurrentPage((prev) => prev + 1)
    setLoading(false)
  }
  useEffect(() => {
    const fetchData = async () => {
      const newDataUser = await propFetchMoreData()
      setDataUser(newDataUser)
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
          //   width: isMobile ? '80vw' : width ? width : '100vw',
          width: isMobile ? '80%' : '40%',
          height: isMobile ? '80%' : '83%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          padding: isMobile ? 3 : '20px',
          overflow: 'auto'
        }}
        id='userList'
      >
        <InfiniteScroll
          dataLength={dataUser?.length || 5}
          next={fetchMoreData}
          hasMore={false}
          loader={<></>}
          scrollableTarget='userList'
        >
          {dataUser?.map((user, index) => <ListFollowCard key={index} user={user} />)}
        </InfiniteScroll>
      </Box>
    </Modal>
  )
}

export default UserList
