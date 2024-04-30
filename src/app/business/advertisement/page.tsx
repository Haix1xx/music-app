'use client'
import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import AdvertisementForm from './AdvertisementForm'
import dayjs, { Dayjs } from 'dayjs'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import UrlConfig from '@/config/urlConfig'
import RootModal from '@/components/common/modals/RootModal'
import { CircularProgress } from '@mui/material'
import axios from 'axios'
import useSnackbar from '@/context/snackbarContext'
import Snackbar from '@/components/common/Snackbar'
import withAuth from '@/authorization/withAuth'

const steps = ['Create advertisement', 'Customize delivery', 'Make payment']

export interface AdvertisementFormProps {
  content: string
  images: string[]
  imageVideo: null
  categories: string[]
  activeDate: any
  expireDate: any
  targetLocation: string
  targetGender: string
  targetAge: [] | null
  amount: number
}

async function handleFileUpload(files: any) {
  const uploadPromises = files.map((file: any) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`)

    return fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.secure_url !== '') {
          const uploadedFileUrl = data.secure_url
          return uploadedFileUrl
        }
      })
      .catch((err) => {
        return err
      })
  })
  const uploadedUrls = await Promise.all(uploadPromises)
  return uploadedUrls
}

function BussinessStepper() {
  const [activeStep, setActiveStep] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [skipped, setSkipped] = React.useState(new Set<number>())
  const { setSnack } = useSnackbar()
  const [advertisementForm, setAdvertisementForm] = React.useState<AdvertisementFormProps>({
    content: '',
    images: [],
    imageVideo: null,
    categories: [],
    activeDate: dayjs(),
    expireDate: dayjs().add(1, 'day'),
    targetLocation: 'Hue',
    targetGender: 'any',
    targetAge: null,
    amount: 100000
  })
  const axiosPrivate = useAxiosPrivate()

  const createBussinessPost = async () => {
    setIsLoading(true)
    if (!advertisementForm.amount || advertisementForm.amount < 10000) {
      setIsLoading(false)
      return
    }
    if (!advertisementForm.content) {
      setSnack({ open: true, message: 'Content is required', type: 'error' })
      setIsLoading(false)
      return
    }
    const uploadedUrls = await handleFileUpload(advertisementForm.images)
    const advertisement = {
      content: advertisementForm.content,
      images: uploadedUrls,
      imageVideo: advertisementForm.imageVideo,
      categories: advertisementForm.categories,
      activeDate: dayjs(advertisementForm.activeDate).format(),
      expireDate: dayjs(advertisementForm.expireDate).format(),
      targetLocation: null,
      targetGender: advertisementForm.targetGender,
      targetAge: advertisementForm.targetAge,
      amount:
        advertisementForm.amount * dayjs(advertisementForm.expireDate).diff(dayjs(advertisementForm.activeDate), 'day')
    }
    const response = await axiosPrivate.post(UrlConfig.bussiness.createAdvertisement, advertisement)
    const paymentUrl = response.data.url
    if (response.status === 200) {
      // const response = axiosPrivate.get(paymentUrl)
      setIsLoading(false)
      window.location.href = paymentUrl
    } else {
      setSnack({ open: true, message: 'Something went wrong', type: 'error' })
      setIsLoading(false)
    }
  }

  const isStepOptional = (step: number) => {
    return step === 1
  }

  const isStepSkipped = (step: number) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    if (activeStep === 0 && !advertisementForm.content && !advertisementForm.images.length) {
      setSnack({ open: true, message: 'Content or images is required', type: 'error' })
      return
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      return newSkipped
    })
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <Box sx={{ overflow: 'auto', maxHeight: '95%' }}>
      <Snackbar />
      <Box sx={{ width: '90%', margin: 'auto', padding: '0 60px' }}>
        <Stepper activeStep={activeStep} sx={{ marginBottom: '30px' }}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {}
            const labelProps: {
              optional?: React.ReactNode
            } = {}

            if (isStepSkipped(index)) {
              stepProps.completed = false
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            )
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <AdvertisementForm
              step={activeStep}
              advertisementForm={advertisementForm}
              setAdvertisementForm={setAdvertisementForm}
            />
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button color='inherit' disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {/* {isStepOptional(activeStep) && (
                <Button color='inherit' onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )} */}
              {/* <Button onClick={handleNext}>{activeStep === steps.length - 1 ? 'Finish' : 'Next'}</Button> */}
              {activeStep === 1 ? (
                <Button onClick={createBussinessPost}>
                  {' '}
                  {isLoading ? <CircularProgress size={20} color='primary' /> : 'Next'}
                </Button>
              ) : (
                <Button onClick={handleNext}>{activeStep === steps.length - 1 ? 'Finish' : 'Next'}</Button>
              )}
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Box>
  )
}

export default withAuth(BussinessStepper)(['business'])
