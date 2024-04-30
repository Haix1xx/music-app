import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  OutlinedInput,
  InputAdornment,
  styled,
  Grid,
  IconButton
} from '@mui/material'
import React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import AdvertisementPost from './AdvertisementPost'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import { AdvertisementFormProps } from './page'
import { unitPrice } from '@/types/unitPrice'
import { formatNumber } from '@/utils/formatNumber'

const TypographyHelper = styled(Typography)({
  color: 'black',
  fontSize: '14px',
  opacity: '0.7',
  marginBottom: '35px'
})

interface RegisterFormsProps {
  step: number
  advertisementForm: AdvertisementFormProps
  setAdvertisementForm: React.Dispatch<React.SetStateAction<AdvertisementFormProps>>
}

const AdvertisementForm = ({ step, advertisementForm, setAdvertisementForm }: RegisterFormsProps) => {
  const [plan, setPlan] = React.useState('day')
  const [reachPotential, setReachPotential] = React.useState<number>(0)
  const [unitPrice, setUnitPrice] = React.useState<unitPrice[]>()
  const [ageValue, setAgeValue] = React.useState('all')
  const toAgeChoices = [24, 34, 49, 54, 100]
  const axiosPrivate = useAxiosPrivate()
  const daysDifference = dayjs(advertisementForm.expireDate).diff(dayjs(advertisementForm.activeDate), 'day')
  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //@ts-ignore
    setAgeValue(event.target.value)
    if (event.target.value === 'all') {
      setAdvertisementForm({ ...advertisementForm })
    } else {
      //@ts-ignore
      setAdvertisementForm({ ...advertisementForm, targetAge: [13, 100] })
    }
  }
  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdvertisementForm({ ...advertisementForm, targetGender: event.target.value })
  }

  React.useEffect(() => {
    const getUnitPrice = async () => {
      const response = await axiosPrivate.get(UrlConfig.bussiness.getUnitPrice)
      if (response.status === 200) {
        setUnitPrice(response.data.data)
      }
    }
    getUnitPrice()
  }, [axiosPrivate])

  React.useEffect(() => {
    let reachPotential = 0
    if (daysDifference > 30) {
      const unit = unitPrice?.find((item) => item.type === 'month')
      if (unit) {
        // @ts-ignore
        reachPotential = (advertisementForm.amount * daysDifference) / unit.price
      }
    } else {
      const unit = unitPrice?.find((item) => item.type === 'day')
      if (unit) {
        // @ts-ignore
        reachPotential = (advertisementForm.amount * daysDifference) / unit.price
      }
    }
    setReachPotential(reachPotential)
  }, [advertisementForm.amount, daysDifference, unitPrice])

  return (
    <>
      {step === 0 && (
        <Box sx={{ marginTop: '20px' }}>
          <AdvertisementPost advertisementForm={advertisementForm} setAdvertisementForm={setAdvertisementForm} />
        </Box>
      )}
      {step === 1 && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7} sx={{ height: '100%' }}>
              <Stack direction={'column'} gap={3}>
                <Card>
                  <CardContent>
                    <Typography variant='h6' sx={{ fontSize: '22px' }}>
                      Demographics
                    </Typography>
                    <TypographyHelper>Narrow your audience based on their gender, age</TypographyHelper>
                    <Stack direction={'column'} gap={4}>
                      <FormControl>
                        <FormLabel id='demo-row-radio-buttons-group-label' sx={{ fontWeight: '600' }}>
                          Gender
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby='demo-row-radio-buttons-group-label'
                          name='gender'
                          value={advertisementForm.targetGender}
                          onChange={handleGenderChange}
                        >
                          <FormControlLabel value='female' control={<Radio />} label='Female' />
                          <FormControlLabel value='male' control={<Radio />} label='Male' />
                          <FormControlLabel value='any' control={<Radio />} label='Any' />
                        </RadioGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel id='controlled-radio-buttons-group' sx={{ fontWeight: '600' }}>
                          Age
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby='controlled-radio-buttons-group'
                          name='age'
                          value={ageValue}
                          onChange={handleAgeChange}
                        >
                          <FormControlLabel value='all' control={<Radio />} label='All' />
                          <FormControlLabel value='range' control={<Radio />} label='Age range' />
                        </RadioGroup>
                      </FormControl>
                      {ageValue === 'range' && (
                        <Stack direction={'row'} sx={{ alignItems: 'center' }}>
                          <FormControl style={{ minWidth: 160 }}>
                            <InputLabel id='demo-simple-select-label'>Age</InputLabel>
                            <Select
                              labelId='demo-simple-select-label'
                              id='demo-simple-select'
                              //@ts-ignore
                              value={advertisementForm.targetAge[0]}
                              label='Age'
                              onChange={(event: any) => {
                                setAdvertisementForm({
                                  ...advertisementForm,
                                  // @ts-ignore
                                  targetAge: [event.target.value, advertisementForm.targetAge[1]]
                                }) // Cast event.target.value to number
                              }}
                            >
                              <MenuItem value={13}>13</MenuItem>
                              <MenuItem value={18}>18</MenuItem>
                              <MenuItem value={21}>21</MenuItem>
                              <MenuItem value={25}>25</MenuItem>
                              <MenuItem value={35}>35</MenuItem>
                              <MenuItem value={50}>50</MenuItem>
                            </Select>
                          </FormControl>
                          <span style={{ padding: '0 15px' }}>to</span>
                          <FormControl style={{ minWidth: 160 }}>
                            <InputLabel id='demo-simple'>And up</InputLabel>
                            <Select
                              labelId='demo-simple'
                              id='demo-simple-select'
                              //@ts-ignore
                              value={advertisementForm.targetAge[1]}
                              label='Age'
                              onChange={(event: any) => {
                                // @ts-ignore
                                setAdvertisementForm({
                                  ...advertisementForm,
                                  // @ts-ignore
                                  targetAge: [advertisementForm.targetAge[0], event.target.value]
                                })
                              }}
                            >
                              {toAgeChoices
                                // @ts-ignore
                                .filter((item) => item > advertisementForm.targetAge[0])
                                .map((item, index) => (
                                  <MenuItem value={item} key={index}>
                                    {item}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Stack>
                      )}
                      {/* <FormControl fullWidth>
                        <FormLabel htmlFor='outlined-adornment' sx={{ fontWeight: '600', marginBottom: '15px' }}>
                          Location
                        </FormLabel>
                        <OutlinedInput id='outlined-adornment' placeholder='Enter a location' sx={{ width: '50%' }} />
                      </FormControl> */}
                    </Stack>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant='h6' sx={{ fontSize: '22px' }}>
                      Budget & Schedule
                    </Typography>
                    <TypographyHelper>
                      Set a budget that fits your needs and a date range to take more control of your spend.
                    </TypographyHelper>
                    <Stack direction={'column'} gap={4}>
                      {/* <FormControl>
                        <FormLabel id='demo-row-radio-buttons-group-label' sx={{ fontWeight: '600' }}>
                          Plan
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby='demo-row-radio-buttons-group-label'
                          name='plan'
                          value={plan}
                          onChange={(event: any) => {
                            setPlan(event.target.value)
                          }}
                        >
                          <FormControlLabel value='day' control={<Radio />} label='Day' />
                          <FormControlLabel value='month' control={<Radio />} label='Month' />
                        </RadioGroup>
                      </FormControl> */}
                      <FormControl fullWidth>
                        <FormLabel htmlFor='outlined-adornment' sx={{ fontWeight: '600', marginBottom: '15px' }}>
                          Daily budget (VND) *
                        </FormLabel>
                        <TextField
                          error={!advertisementForm.amount || advertisementForm.amount < 10000}
                          id='outlined-basic'
                          required
                          variant='outlined'
                          type='number'
                          placeholder='Enter a budget'
                          sx={{ width: '32%', minWidth: '120px' }}
                          value={advertisementForm.amount}
                          onChange={(event: any) => {
                            setAdvertisementForm({ ...advertisementForm, amount: event.target.value })
                          }}
                          inputProps={{
                            min: 0,
                            max: 10000000000 // Set your desired maximum value
                          }}
                          helperText={
                            !advertisementForm.amount
                              ? 'You must enter a budget'
                              : advertisementForm.amount < 10000
                              ? 'Budget must be greater than 10,000'
                              : 'Your daily budget is the average amount you’d like to spend each day.'
                          }
                        />
                      </FormControl>
                      <FormControl fullWidth>
                        <Typography variant='h6' sx={{ marginBottom: '10px' }}></Typography>
                        <FormLabel htmlFor='outlined-adornment-amount' sx={{ fontWeight: '600', marginBottom: '15px' }}>
                          Date range
                        </FormLabel>
                        <Stack direction={'row'}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                              <DatePicker
                                label='Start'
                                value={advertisementForm.activeDate}
                                onChange={(newValue) => {
                                  // @ts-ignore
                                  const newActiveDate = newValue.startOf('day') // Ensure it's the start of the day
                                  setAdvertisementForm({
                                    ...advertisementForm,
                                    activeDate: newActiveDate,
                                    expireDate:
                                      newActiveDate > advertisementForm.expireDate
                                        ? newActiveDate.add(1, 'day') // Update expireDate if needed
                                        : advertisementForm.expireDate
                                  })
                                }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                          <span style={{ padding: '0 15px' }}>to</span>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                              <DatePicker
                                label='End'
                                value={advertisementForm.expireDate}
                                onChange={(newValue) => {
                                  // @ts-ignore
                                  const newExpireDate = newValue.startOf('day') // Ensure it's the start of the day
                                  setAdvertisementForm({
                                    ...advertisementForm,
                                    expireDate: newExpireDate,
                                    activeDate:
                                      advertisementForm.activeDate > newExpireDate
                                        ? newExpireDate.subtract(1, 'day') // Update activeDate if needed
                                        : advertisementForm.activeDate
                                  })
                                }}
                                slotProps={{
                                  textField: {
                                    helperText:
                                      advertisementForm.activeDate > advertisementForm.expireDate
                                        ? 'Expire date must be greater than active date'
                                        : '',
                                    sx: {
                                      '& p': {
                                        color: 'red' // Change the text color to red
                                      }
                                    }
                                  }
                                }}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </Stack>
                      </FormControl>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} sx={{ height: '100%' }}>
              <Card>
                <CardContent>
                  <Typography variant='h6' sx={{ fontSize: '22px', marginBottom: '20px' }}>
                    Audience summary
                  </Typography>
                  <Box sx={{ margin: 'auto', marginTop: '20px' }}>
                    <Typography variant='h6' sx={{ fontSize: '20px', textAlign: 'center' }}>
                      {formatNumber(reachPotential * 0.95)} - {formatNumber(reachPotential * 1.05)}
                    </Typography>
                    <Typography sx={{ fontSize: '16px', color: 'black', opacity: '0.7', textAlign: 'center' }}>
                      Reach potential
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant='h6' sx={{ fontSize: '18px', marginTop: '25px', marginBottom: '25px' }}>
                      Demographics
                    </Typography>
                    <Stack direction={'row'} gap={20}>
                      <Stack direction={'column'} sx={{ alignItems: 'center' }} gap={2}>
                        <Box>
                          <Typography variant='h5'>Gender</Typography>
                          <Typography>{advertisementForm.targetGender}</Typography>
                        </Box>
                        {/* <Box>
                          <Typography variant='h5'>Location</Typography>
                          <Typography>Vietnam</Typography>
                        </Box> */}
                      </Stack>
                      <Box>
                        <Typography variant='h5'>Age</Typography>
                        {advertisementForm.targetAge === null ? (
                          <Typography>All</Typography>
                        ) : (
                          //@ts-ignore
                          <Typography>{`${advertisementForm.targetAge[0]} - ${advertisementForm.targetAge[1]}`}</Typography>
                        )}
                      </Box>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant='h6' sx={{ fontSize: '18px', marginTop: '25px', marginBottom: '25px' }}>
                      Budget & Schedule
                    </Typography>
                    <Grid container spacing={2}>
                      {/* First Column */}
                      <Grid item xs={12} md={6} spacing={2}>
                        <Stack direction={'column'} gap={2}>
                          <Box>
                            <Typography variant='h5'>Daily budget</Typography>
                            <Typography>{`${formatNumber(advertisementForm.amount)} vnd`} </Typography>
                          </Box>
                          <Box>
                            <Typography variant='h5'>Total</Typography>
                            <Typography>{`${formatNumber(advertisementForm.amount * daysDifference)} vnd`}</Typography>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6} spacing={2}>
                        <Stack direction={'column'} gap={2}>
                          {/* <Box>
                            <Typography variant='h5'>Plan</Typography>
                            <Typography>{plan}</Typography>
                          </Box> */}
                          <Box>
                            <Typography variant='h5'>Date range</Typography>
                            <Typography>{`${dayjs(advertisementForm.activeDate).format('MM/DD/YYYY')} - ${dayjs(
                              advertisementForm.expireDate
                            ).format('MM/DD/YYYY')} `}</Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      {/* Second Column */}
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  )
}

export default AdvertisementForm
