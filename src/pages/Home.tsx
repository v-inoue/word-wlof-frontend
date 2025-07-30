import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  HStack,
  Text,
  SegmentGroup
} from '@chakra-ui/react'
import { FaPlus, FaMinus } from 'react-icons/fa'

function Home() {
  const [players, setPlayers] = useState(['', '', '']) // 初期3人 
  const navigate = useNavigate()

  const [withExplanation, setWithExplanation] = useState<string|null>(
  () => localStorage.getItem('withExplanation') ?? '解説あり'
)

  const saveExplanation = (withExplanation: string|null) => {
    setWithExplanation(withExplanation)
    localStorage.setItem('withExplanation', withExplanation || '解説あり')
  }
  const handleChange = (index: number, value: string) => {
    const newPlayers = [...players]
    newPlayers[index] = value
    setPlayers(newPlayers)
  }

  const handleAddPlayer = () => {
    setPlayers([...players, ''])
  }

  const handleRemovePlayer = (index: number) => {
    if (players.length <= 3) return // 最低3人を保証
    const newPlayers = players.filter((_, i) => i !== index)
    setPlayers(newPlayers)
  }

  const handleStart = () => {
    const trimmed = players.map(p => p.trim())
    const hasDuplicates = new Set(trimmed).size !== trimmed.length
    if (hasDuplicates) {
      alert('プレイヤー名に重複があります。')
      return
    }
    if (trimmed.every(name => name !== '')) {
      localStorage.setItem('players', JSON.stringify(trimmed))
      navigate('/game')
    }
  }

  return (
    <Box h="100vh" display="flex" justifyContent="center" alignItems="center" px={4}>
      <VStack>
        <Heading>エンジニアワードウルフ</Heading>
    <SegmentGroup.Root value={withExplanation} onValueChange={(e) => saveExplanation(e.value)}>
      <SegmentGroup.Indicator />
      <SegmentGroup.Items items={["解説あり", "解説なし"]} />
    </SegmentGroup.Root>

        {players.map((name, idx) => (
          <HStack key={idx} w="100%">
            <Input
              placeholder={`プレイヤー${idx + 1}の名前`}
              value={name}
              onChange={(e) => handleChange(idx, e.target.value)}
            />
            
          </HStack>
        ))}

        <HStack>
          <Button
            aria-label="プレイヤーを追加"
            onClick={handleAddPlayer}
            colorScheme="blue"
          >
            <FaPlus />
          </Button>

          {players.length > 3 && (
              <Button
                aria-label="プレイヤーを削除"
                onClick={() => handleRemovePlayer(players.length - 1)}
                colorScheme="red"
              >
                <FaMinus />
              </Button>
            )}
            
          <Button
            colorScheme="teal"
            onClick={handleStart}
            disabled={players.some(p => p.trim() === '')}
          >
            スタート
          </Button>
        </HStack>

        <Text fontSize="sm" color="gray.500">
          プレイヤー名をすべて入力してください（最低3人）
        </Text>
      </VStack>
    </Box>
  )
}

export default Home
