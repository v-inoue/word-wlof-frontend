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
        werewlof: { word: '???', explanation: '???' }
      }

  return (
    <Box h="100vh" display="flex" justifyContent="center" alignItems="center">
      <VStack>
        <Heading>結果発表</Heading>
        <Text>分野: {topicData.domain}</Text>
        <Text>お題のレベル: {topicData.level}</Text>

        <Box p={4} borderWidth="1px" borderRadius="lg" w="400px">
          <Text fontWeight="bold">市民のお題:</Text>
          <Text>{topicData.citizen.word}（{topicData.citizen.english}）</Text>
          <Text fontSize="sm" color="gray.600">
            {topicData.citizen.explanation}
          </Text>
        </Box>

        <Box p={4} borderWidth="1px" borderRadius="lg" w="400px">
          <Text fontWeight="bold">ウルフのお題:</Text>
          <Text>{topicData.werewlof.word}（{topicData.werewlof.english}）</Text>
          <Text fontSize="sm" color="gray.600">
            {topicData.werewlof.explanation}
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