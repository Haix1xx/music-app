import { Box, Card, Stack, Typography } from '@mui/material'
import Image, { StaticImageData } from 'next/image'
interface WidgetSummaryProps {
  title: string
  total: number
  icon: StaticImageData
  color: string
}
export default function WidgetSummary({ title, total = 0, icon, color = 'primary' }: WidgetSummaryProps) {
  return (
    <Card
      component={Stack}
      spacing={3}
      direction='row'
      sx={{
        px: 3,
        py: 5,
        borderRadius: 2
      }}
    >
      {icon && <Image src={icon} alt='logo' width={64} height={64} />}
      <Stack spacing={0.5}>
        <Typography variant='h4'>{total.toLocaleString('en-US')}</Typography>

        <Typography variant='subtitle1' sx={{ color: 'text.disabled' }}>
          {title}
        </Typography>
      </Stack>
    </Card>
  )
}
