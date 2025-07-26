import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Text,
  Button,
  VStack,
  Heading
} from '@chakra-ui/react'

function Play() {
  const [timeLeft, setTimeLeft] = useState(300) // 5分
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <Box h="100vh" display="flex" justifyContent="center" alignItems="center">
      <VStack >
        <Heading>話し合いタイム</Heading>
        <Text fontSize="6xl" fontWeight="bold">
          {formatTime(timeLeft)}
        </Text>
        <Button colorScheme="red" size="lg" onClick={() => navigate('/result')}>
          終了
        </Button>
      </VStack>
    </Box>
  )
}

export default Play