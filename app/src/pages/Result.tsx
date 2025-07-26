import { Box, Heading, Text, VStack, Button, HStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

function Result() {
  const navigate = useNavigate()

  // 保存されたお題と解説を読み込む
  const storedData = localStorage.getItem('themeData')
  const topicData = storedData
    ? JSON.parse(storedData)
    : {
        citizen: { word: '???', explanation: '???' },
        werewolf: { word: '???', explanation: '???' }
      }

  return (
    <Box h="100vh" display="flex" justifyContent="center" alignItems="center">
      <VStack>
        <Heading>結果発表</Heading>

        <Box p={4} borderWidth="1px" borderRadius="lg" w="300px">
          <Text fontWeight="bold">市民のお題:</Text>
          <Text>{topicData.citizen.word}</Text>
          <Text fontSize="sm" color="gray.600">
            {topicData.citizen.explanation}
          </Text>
        </Box>

        <Box p={4} borderWidth="1px" borderRadius="lg" w="300px">
          <Text fontWeight="bold">ウルフのお題:</Text>
          <Text>{topicData.werewolf.word}</Text>
          <Text fontSize="sm" color="gray.600">
            {topicData.werewolf.explanation}
          </Text>
        </Box>

        <HStack>
          <Button colorScheme="teal" onClick={() => navigate('/game')}>
            もう一度
          </Button>
          <Button colorScheme="gray" onClick={() => navigate('/')}>
            ホームへ戻る
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}

export default Result