import { Grid, Stack, Typography } from '@mui/material'
// components
import Image from 'next/image'

import NoResultBanner from '@/assets/no_results.png'
interface NotFoundProps {
  q: string | null
}
export default function NotFound({ q }: NotFoundProps) {
  return (
    <Grid spacing={1} sx={{ alignSelf: 'center' }}>
      <Stack sx={{ maxWidth: '450px', marginTop: '30px' }}>
        <Typography variant='h2'>No results for</Typography>
        <Typography variant='h2' sx={{ wordWrap: 'break-word', color: 'primary.main' }}>
          "{q}"
        </Typography>
        <Typography sx={{ maxWidth: '400px' }}>
          Try searching for something else, or check your Search settings to see if they’re protecting you from
          potentially sensitive content.
        </Typography>
        <Image src={NoResultBanner} alt='No Results' />
      </Stack>
    </Grid>
  )
}
